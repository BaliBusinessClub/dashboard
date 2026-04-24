"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  CalendarRange,
  ChartColumn,
  ChevronDown,
  Globe,
  Heart,
  House,
  LogOut,
  MapPin,
  MessageCircleMore,
  MessagesSquare,
  Newspaper,
  PencilLine,
  Podcast,
  Save,
  Sparkles,
  Trash2,
  Youtube,
  X
} from "lucide-react";
import { SessionUser, useAuth } from "@/components/auth-provider";
import { BaliTime } from "@/components/bali-time";
import {
  baliEvents,
  dashboardShortcuts,
  initialFavorites,
  marketReports,
  marketStatCards,
  newsSections,
  partnerBenefits,
  podcastFeed,
  podcastTopics,
  reidReports,
  resourceDocuments,
  socials
} from "@/lib/mock-data";
import { DashboardEvent, getReviewedEvents, submitEvent } from "@/lib/event-store";
import { submitMessage } from "@/lib/message-store";
import { getApprovedPartners, submitPartnerApplication } from "@/lib/partner-store";

const dashboardTabs = [
  { id: "home", label: "Home", icon: House },
  { id: "market", label: "Market Insights", icon: ChartColumn },
  { id: "news", label: "News", icon: Newspaper },
  { id: "events", label: "Events", icon: CalendarRange },
  { id: "podcasts", label: "Podcasts", icon: Podcast },
  { id: "resources", label: "Ressources", icon: BookOpen },
  { id: "partners", label: "Partners", icon: Building2 },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "connect", label: "Connect", icon: MessagesSquare }
] as const;

type DashboardTab = (typeof dashboardTabs)[number]["id"];
type NewsTopic = "All" | (typeof newsSections)[number]["title"];
type PodcastTopic = (typeof podcastTopics)[number];
type MarketReport = (typeof marketReports)[number]["report"];
type FavoriteItem = {
  id: string;
  type: "News" | "Podcast" | "Ressource" | "Event";
  title: string;
  note: string;
  sourceId: string;
};

type NewsArticleView = {
  id: string;
  title: string;
  teaser: string;
  content: string;
  source: string;
  date: string;
  url: string;
  topic: string;
  region: "Bali" | "Indonesia";
};

function formatMetricValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatChartValue(value: number, unit: "percent" | "currency" | "change") {
  if (unit === "currency") {
    return `$${formatMetricValue(value)}`;
  }

  if (unit === "change") {
    return `${value > 0 ? "+" : ""}${value}%`;
  }

  return `${value}%`;
}

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

const businessQuotes = [
  { quote: "Price is what you pay. Value is what you get.", source: "Warren Buffett" },
  { quote: "The way to get started is to quit talking and begin doing.", source: "Walt Disney" },
  { quote: "In the middle of difficulty lies opportunity.", source: "Albert Einstein" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", source: "Henry David Thoreau" },
  { quote: "Opportunities don't happen. You create them.", source: "Chris Grosser" }
] as const;

function getDailyQuote() {
  const dayIndex = new Date().getDate() % businessQuotes.length;
  return businessQuotes[dayIndex];
}

function sanitizeCopy(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s*[\-|.]\s*/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatDateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function formatMonthKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0")].join("-");
}

function parseEventDateParts(value: string) {
  const cleaned = sanitizeCopy(value).replace(/\s+-\s+/g, " | ");
  const parts = cleaned.split("|").map((part) => part.trim()).filter(Boolean);
  const rawDate = parts[0] ?? "";
  const rawTime = parts.slice(1).join(" | ");
  const parsed = new Date(rawDate);
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date("2026-04-24T00:00:00") : parsed;
  return {
    parsed: safeDate,
    key: formatDateKey(safeDate),
    time: rawTime
  };
}
const ebookCoverMap: Record<string, string> = {
  "Comprehensive Guide to Real Estate Investing in Bali": "/resources/covers/bbc-real-estate-investing.png",
  "Why Location Is Everything": "/resources/covers/bbc-why-location-is-everything.png",
  "Dubai-Based Entrepreneurs and Investors": "/resources/covers/bbc-dubai-investor-guide.jpg",
  "Escape to Bali - A Guide to a Better Life": "/resources/covers/bbc-escape-to-bali.png"
};

const partnerBusinessOptions = [
  "Visa Agency",
  "Accounting Agency",
  "International School",
  "Real Estate",
  "Hospitality",
  "Marketing Agency",
  "Investment Firm",
  "Wellness Business",
  "Legal Services",
  "Education",
  "Consulting",
  "Health & Beauty",
  "Food & Beverage",
  "Technology",
  "Other"
] as const;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  }
  if (hour < 18) {
    return "Good Afternoon";
  }
  return "Good Evening";
}

function detectDialCode() {
  if (typeof navigator === "undefined") {
    return "+62";
  }

  const locale = (navigator.language || "en-ID").toUpperCase();
  const region = locale.split("-")[1] ?? "ID";
  const codes: Record<string, string> = {
    ID: "+62",
    SG: "+65",
    AU: "+61",
    GB: "+44",
    US: "+1",
    CA: "+1",
    FR: "+33",
    AE: "+971"
  };

  return codes[region] ?? "+62";
}

function isValidWebsite(value: string) {
  return /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:[/?#].*)?$/.test(value.trim());
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getPhoneCountry(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  const digits = normalized.startsWith("+") ? normalized.slice(1) : normalized;
  type PhoneCountry = { code: string; flag: string };
  const lookup: Array<[string, PhoneCountry]> = [
    ["998", { code: "UZ", flag: "https://flagcdn.com/w40/uz.png" }],
    ["995", { code: "GE", flag: "https://flagcdn.com/w40/ge.png" }],
    ["994", { code: "AZ", flag: "https://flagcdn.com/w40/az.png" }],
    ["993", { code: "TM", flag: "https://flagcdn.com/w40/tm.png" }],
    ["992", { code: "TJ", flag: "https://flagcdn.com/w40/tj.png" }],
    ["977", { code: "NP", flag: "https://flagcdn.com/w40/np.png" }],
    ["976", { code: "MN", flag: "https://flagcdn.com/w40/mn.png" }],
    ["975", { code: "BT", flag: "https://flagcdn.com/w40/bt.png" }],
    ["974", { code: "QA", flag: "https://flagcdn.com/w40/qa.png" }],
    ["973", { code: "BH", flag: "https://flagcdn.com/w40/bh.png" }],
    ["972", { code: "IL", flag: "https://flagcdn.com/w40/il.png" }],
    ["971", { code: "AE", flag: "https://flagcdn.com/w40/ae.png" }],
    ["966", { code: "SA", flag: "https://flagcdn.com/w40/sa.png" }],
    ["965", { code: "KW", flag: "https://flagcdn.com/w40/kw.png" }],
    ["964", { code: "IQ", flag: "https://flagcdn.com/w40/iq.png" }],
    ["963", { code: "SY", flag: "https://flagcdn.com/w40/sy.png" }],
    ["962", { code: "JO", flag: "https://flagcdn.com/w40/jo.png" }],
    ["961", { code: "LB", flag: "https://flagcdn.com/w40/lb.png" }],
    ["960", { code: "MV", flag: "https://flagcdn.com/w40/mv.png" }],
    ["886", { code: "TW", flag: "https://flagcdn.com/w40/tw.png" }],
    ["880", { code: "BD", flag: "https://flagcdn.com/w40/bd.png" }],
    ["856", { code: "LA", flag: "https://flagcdn.com/w40/la.png" }],
    ["855", { code: "KH", flag: "https://flagcdn.com/w40/kh.png" }],
    ["853", { code: "MO", flag: "https://flagcdn.com/w40/mo.png" }],
    ["852", { code: "HK", flag: "https://flagcdn.com/w40/hk.png" }],
    ["84", { code: "VN", flag: "https://flagcdn.com/w40/vn.png" }],
    ["82", { code: "KR", flag: "https://flagcdn.com/w40/kr.png" }],
    ["81", { code: "JP", flag: "https://flagcdn.com/w40/jp.png" }],
    ["66", { code: "TH", flag: "https://flagcdn.com/w40/th.png" }],
    ["65", { code: "SG", flag: "https://flagcdn.com/w40/sg.png" }],
    ["64", { code: "NZ", flag: "https://flagcdn.com/w40/nz.png" }],
    ["63", { code: "PH", flag: "https://flagcdn.com/w40/ph.png" }],
    ["62", { code: "ID", flag: "https://flagcdn.com/w40/id.png" }],
    ["61", { code: "AU", flag: "https://flagcdn.com/w40/au.png" }],
    ["60", { code: "MY", flag: "https://flagcdn.com/w40/my.png" }],
    ["58", { code: "VE", flag: "https://flagcdn.com/w40/ve.png" }],
    ["57", { code: "CO", flag: "https://flagcdn.com/w40/co.png" }],
    ["56", { code: "CL", flag: "https://flagcdn.com/w40/cl.png" }],
    ["55", { code: "BR", flag: "https://flagcdn.com/w40/br.png" }],
    ["54", { code: "AR", flag: "https://flagcdn.com/w40/ar.png" }],
    ["53", { code: "CU", flag: "https://flagcdn.com/w40/cu.png" }],
    ["52", { code: "MX", flag: "https://flagcdn.com/w40/mx.png" }],
    ["51", { code: "PE", flag: "https://flagcdn.com/w40/pe.png" }],
    ["49", { code: "DE", flag: "https://flagcdn.com/w40/de.png" }],
    ["48", { code: "PL", flag: "https://flagcdn.com/w40/pl.png" }],
    ["47", { code: "NO", flag: "https://flagcdn.com/w40/no.png" }],
    ["46", { code: "SE", flag: "https://flagcdn.com/w40/se.png" }],
    ["45", { code: "DK", flag: "https://flagcdn.com/w40/dk.png" }],
    ["44", { code: "GB", flag: "https://flagcdn.com/w40/gb.png" }],
    ["43", { code: "AT", flag: "https://flagcdn.com/w40/at.png" }],
    ["41", { code: "CH", flag: "https://flagcdn.com/w40/ch.png" }],
    ["40", { code: "RO", flag: "https://flagcdn.com/w40/ro.png" }],
    ["39", { code: "IT", flag: "https://flagcdn.com/w40/it.png" }],
    ["36", { code: "HU", flag: "https://flagcdn.com/w40/hu.png" }],
    ["34", { code: "ES", flag: "https://flagcdn.com/w40/es.png" }],
    ["33", { code: "FR", flag: "https://flagcdn.com/w40/fr.png" }],
    ["32", { code: "BE", flag: "https://flagcdn.com/w40/be.png" }],
    ["31", { code: "NL", flag: "https://flagcdn.com/w40/nl.png" }],
    ["30", { code: "GR", flag: "https://flagcdn.com/w40/gr.png" }],
    ["27", { code: "ZA", flag: "https://flagcdn.com/w40/za.png" }],
    ["20", { code: "EG", flag: "https://flagcdn.com/w40/eg.png" }],
    ["95", { code: "MM", flag: "https://flagcdn.com/w40/mm.png" }],
    ["94", { code: "LK", flag: "https://flagcdn.com/w40/lk.png" }],
    ["93", { code: "AF", flag: "https://flagcdn.com/w40/af.png" }],
    ["92", { code: "PK", flag: "https://flagcdn.com/w40/pk.png" }],
    ["91", { code: "IN", flag: "https://flagcdn.com/w40/in.png" }],
    ["90", { code: "TR", flag: "https://flagcdn.com/w40/tr.png" }],
    ["86", { code: "CN", flag: "https://flagcdn.com/w40/cn.png" }],
    ["7", { code: "KZ", flag: "https://flagcdn.com/w40/kz.png" }],
    ["1", { code: "US", flag: "https://flagcdn.com/w40/us.png" }]
  ];

  const sortedLookup = [...lookup].sort((a, b) => b[0].length - a[0].length);
  for (const [prefix, country] of sortedLookup) {
    if (digits.startsWith(prefix)) {
      return country;
    }
  }

  return { code: "ID", flag: "https://flagcdn.com/w40/id.png" };
}

function PhoneFlag({ phone }: { phone: string }) {
  const country = getPhoneCountry(phone);
  return (
    <span className="phone-flag">
      <img src={country.flag} alt={country.code} />
      <span>{country.code}</span>
    </span>
  );
}

function SocialLogo({ icon }: { icon: (typeof socials)[number]["icon"] }) {
  if (icon === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.5v-7L16 12l-6.4 3.5Z"
        />
      </svg>
    );
  }

  if (icon === "spotify") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 1.5a10.5 10.5 0 1 0 10.5 10.5A10.5 10.5 0 0 0 12 1.5Zm4.8 15.2a.9.9 0 0 1-1.2.3 10.2 10.2 0 0 0-8.2-.9.9.9 0 0 1-.5-1.7 12 12 0 0 1 9.7 1.1.9.9 0 0 1 .2 1.2Zm1.5-3.1a1.1 1.1 0 0 1-1.4.4 12.7 12.7 0 0 0-10.1-1.1 1.1 1.1 0 0 1-.7-2 14.9 14.9 0 0 1 11.8 1.3 1.1 1.1 0 0 1 .4 1.4Zm.1-3.2a1.3 1.3 0 0 1-1.6.5 15.7 15.7 0 0 0-11.7-1.3 1.3 1.3 0 1 1-.8-2.5 18.3 18.3 0 0 1 13.6 1.5 1.3 1.3 0 0 1 .5 1.8Z"
        />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7.4 2h9.2A5.4 5.4 0 0 1 22 7.4v9.2a5.4 5.4 0 0 1-5.4 5.4H7.4A5.4 5.4 0 0 1 2 16.6V7.4A5.4 5.4 0 0 1 7.4 2Zm-.2 1.8A3.4 3.4 0 0 0 3.8 7.2v9.6a3.4 3.4 0 0 0 3.4 3.4h9.6a3.4 3.4 0 0 0 3.4-3.4V7.2a3.4 3.4 0 0 0-3.4-3.4H7.2Zm10.2 1.4a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2ZM12 7a5 5 0 1 1-5 5 5 5 0 0 1 5-5Zm0 1.8A3.2 3.2 0 1 0 15.2 12 3.2 3.2 0 0 0 12 8.8Z"
        />
      </svg>
    );
  }

  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.7 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.2-1.6 1.6-1.6h1.7V4.1a22.6 22.6 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.4v2.2H7.5v3.2h2.8V22h3.4Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.6 5.1a4.8 4.8 0 0 1-3.2-1.6h-2.4v13.1a2.7 2.7 0 1 1-2-2.6V11a6 6 0 1 0 4.7 5.8V9.9a7.1 7.1 0 0 0 4.1 1.3V8.8a4.5 4.5 0 0 1-1.2-.2Z"
      />
    </svg>
  );
}

function InteractiveMarketGraph({
  values,
  activeIndex,
  onSelect,
  labels,
  unit,
  title
}: {
  values: readonly number[];
  activeIndex: number;
  onSelect: (index: number) => void;
  labels: readonly string[];
  unit: "percent" | "currency" | "change";
  title: string;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const width = 860;
  const height = 300;
  const paddingX = 42;
  const paddingTop = 28;
  const paddingBottom = 52;
  const usableHeight = height - paddingTop - paddingBottom;
  const usableWidth = width - paddingX * 2;
  const range = max - min || max || 1;

  const points = values.map((value, index) => {
    const x = paddingX + (usableWidth / Math.max(values.length - 1, 1)) * index;
    const normalized = (value - min) / range;
    const y = paddingTop + (1 - normalized) * usableHeight;
    return { x, y, value, label: labels[index] };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? paddingX} ${height - paddingBottom} L ${
    points[0]?.x ?? paddingX
  } ${height - paddingBottom} Z`;

  const yTicks = [0, 0.5, 1].map((step) => {
    const value = min + (1 - step) * range;
    const y = paddingTop + step * usableHeight;
    return { value, y };
  });

  return (
    <div className="market-graph-shell">
      <div className="market-graph-frame">
        <svg viewBox={`0 0 ${width} ${height}`} className="market-graph-svg" role="img" aria-label={title}>
          <defs>
            <linearGradient id="bbcMarketArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd800" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ffd800" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick.y}>
              <line
                x1={paddingX}
                x2={width - paddingX}
                y1={tick.y}
                y2={tick.y}
                className="market-grid-line"
              />
              <text x={12} y={tick.y + 4} className="market-axis-copy">
                {formatChartValue(Math.round(tick.value * 10) / 10, unit)}
              </text>
            </g>
          ))}

          <path d={areaPath} className="market-area-path" />
          <path d={linePath} className="market-line-path" />

          {points.map((point, index) => (
            <g key={point.label}>
              <circle
                cx={point.x}
                cy={point.y}
                r={activeIndex === index ? 7 : 5}
                className={activeIndex === index ? "market-point active" : "market-point"}
                onMouseEnter={() => onSelect(index)}
                onFocus={() => onSelect(index)}
              />
              <text x={point.x} y={height - 18} textAnchor="middle" className="market-axis-copy market-axis-label">
                {point.label}
              </text>
            </g>
          ))}

          {points[activeIndex] ? (
            <g transform={`translate(${Math.min(points[activeIndex].x + 12, width - 190)}, ${Math.max(points[activeIndex].y - 78, 18)})`}>
              <rect width="176" height="58" rx="14" className="market-tooltip-box" />
              <text x="14" y="22" className="market-tooltip-label">
                {points[activeIndex].label}
              </text>
              <text x="14" y="42" className="market-tooltip-value">
                {formatChartValue(points[activeIndex].value, unit)}
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      <div className="market-point-picker">
        {points.map((point, index) => (
          <button
            key={point.label}
            type="button"
            className={index === activeIndex ? "point-pill active" : "point-pill"}
            onClick={() => onSelect(index)}
          >
            {point.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileModal({
  user,
  onClose,
  onSave
}: {
  user: SessionUser;
  onClose: () => void;
  onSave: (updates: Partial<SessionUser>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [picture, setPicture] = useState(user.picture ?? "");

  return (
    <div className="modal-overlay open">
      <div className="modal-card">
        <div className="modal-head">
          <h2>Edit profile</h2>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="profile-upload">
          <div className="profile-avatar large">
            {picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={picture} alt={name} />
            ) : (
              <span>{name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <button type="button" className="table-link-button" onClick={() => fileInputRef.current?.click()}>
            Upload profile picture
          </button>
          <small>Recommended size: 800 x 800 px square PNG or JPG.</small>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setPicture(String(reader.result ?? ""));
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div className="form-grid clean">
          <label>
            Full name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button
            type="button"
            className="primary-button compact"
            onClick={() => {
              onSave({
                name,
                email,
                picture,
                role: email.toLowerCase() === "admin@balibusinessclub.com" ? "admin" : "member"
              });
              onClose();
            }}
          >
            <Save size={14} />
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell() {
  const router = useRouter();
  const { user, ready, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [marketFilter, setMarketFilter] = useState<MarketReport>(marketReports[0].report);
  const [marketMetric, setMarketMetric] = useState<string>(marketReports[0].metrics[0].id);
  const [chartSelection, setChartSelection] = useState<Record<string, number>>({});
  const [newsTopic, setNewsTopic] = useState<NewsTopic>("All");
  const [newsRegion, setNewsRegion] = useState<"All" | "Bali" | "Indonesia">("All");
  const [podcastTopic, setPodcastTopic] = useState<PodcastTopic>("All");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([...initialFavorites]);
  const [activeArticle, setActiveArticle] = useState<NewsArticleView | null>(null);
  const [eventTopic, setEventTopic] = useState<DashboardEvent["category"] | "All">("All");
  const [approvedEvents, setApprovedEvents] = useState<DashboardEvent[]>([]);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [eventView, setEventView] = useState<"list" | "month">("list");
  const [currentEventMonth, setCurrentEventMonth] = useState("2026-04");
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    signupUrl: "",
    whatsappUrl: "https://wa.link/zg5xw8",
    category: "Networking" as DashboardEvent["category"],
    customCategory: "",
    description: ""
  });
  const [partnerForm, setPartnerForm] = useState({
    company: "",
    businessType: "",
    customBusinessType: "",
    whatsapp: "",
    website: "",
    offer: "",
    logo: ""
  });
  const [partnerLogoInputKey, setPartnerLogoInputKey] = useState(0);
  const [suggestionForm, setSuggestionForm] = useState({
    name: user?.name ?? "",
    topic: "",
    details: ""
  });
  const [greeting, setGreeting] = useState(getGreeting());
  const [dailyQuote, setDailyQuote] = useState(getDailyQuote());
  const [dynamicPartners, setDynamicPartners] = useState(getApprovedPartners());
  const [partnerDialCode, setPartnerDialCode] = useState("+62");
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<{ title: string; copy: string } | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      router.replace("/");
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin");
    }
  }, [ready, router, user]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!profileMenuRef.current) {
        return;
      }

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    if (profileOpen) {
      window.addEventListener("mousedown", handleClick);
    }

    return () => window.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  useEffect(() => {
    const timer = window.setInterval(() => setGreeting(getGreeting()), 1000 * 60 * 15);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setDailyQuote(getDailyQuote());
  }, []);

  useEffect(() => {
    setPartnerDialCode(detectDialCode());
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!user?.name) {
      return;
    }
    setSuggestionForm((current) => ({
      ...current,
      name: current.name || user.name
    }));
  }, [user?.name]);

  useEffect(() => {
    setApprovedEvents([
      ...baliEvents,
      ...getReviewedEvents().filter((item) => item.status === "approved")
    ]);
    setDynamicPartners(getApprovedPartners());
  }, []);

  useEffect(() => {
    const scopedEvents = approvedEvents.filter((event) => eventTopic === "All" || event.category === eventTopic);
    if (!scopedEvents.length) {
      return;
    }
    const firstMonth = parseEventDateParts(scopedEvents[0].date).key.slice(0, 7);
    setCurrentEventMonth((current) => current || firstMonth);
  }, [approvedEvents, eventTopic]);

  const filteredCharts = useMemo(
    () => marketReports.find((item) => item.report === marketFilter) ?? marketReports[0],
    [marketFilter]
  );

  useEffect(() => {
    if (!filteredCharts.metrics.some((item) => item.id === marketMetric)) {
      setMarketMetric(filteredCharts.metrics[0].id);
    }
  }, [filteredCharts, marketMetric]);

  const selectedMarketSeries = filteredCharts.metrics.find((item) => item.id === marketMetric) ?? filteredCharts.metrics[0];

  const groupedResources = useMemo(
    () =>
      resourceDocuments
        .filter((item) => item.section === "Ebooks")
        .reduce<Record<string, Array<(typeof resourceDocuments)[number]>>>((groups, item) => {
        if (!groups[item.section]) {
          groups[item.section] = [];
        }
        groups[item.section].push(item);
        return groups;
      }, {}),
    []
  );

  const visiblePodcastFeed = useMemo(
    () => {
      const homepageTitleOverrides: Record<string, string> = {
        PG2TFBF0uY8: "Unlocking Winning Talent: Insights from a Top Bali Head Hunter",
        Ayb4THzSjE0: "Bali Real Estate Market in 2026: What the Data Really Shows",
        LkiYTQ1k0ss: "From marketing to brokering and development: Inside GEONETÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢s Real Estate Machine",
        "4jIi_bXuUSU": "Inside The Kedungu Fund: 2025 Growth, Strategy & Results",
        KScozjNYu9Q: "How Bali Business Founders Can Attract Investors from the Middle East",
        UNaQQiIjoCk: "Bali Property Made Simple: The 9-Step Process Explained",
        "0cMjvf1lb3g": "How to Sell Out Your Property Development in a Day: The Future of Off-Plan Sales",
        yxJwNl3n3t4: "The Kedungu FundÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢s $10M Milestone: A Look Ahead",
        bfHu20vi2g8: "Bali Property: Off-Plan Buyer Checklist (Avoid These Common Mistakes)",
        G1lT0E2nSGQ: "The Secret Growth Formula Content Creators Must Know!",
        "7bXHvn8Vksw": "BALI REAL ESTATE: HOW TO TRIPLE YOUR INVESTMENT RETURNS!",
        "9LNXudhoxO0": "The ROI Property Cycle in Bali No One Talks About!",
        fGuiCmtcOKo: "Short-Term Rentals in Crisis: Why You Should Opt For Long-Term",
        SPFp95YSETE: "Beware! Why We NEVER Invest in Uluwatu!",
        jh_Ejqlc40g: "The Kedungu Fund: All the Answers",
        qDP46lfSpaI: "HOW TO SELL MORE MARKETING FUNNELS: HOW AND WHY THEY WORK",
        CfgZ7lqMhS8: "BALI BEACH GLAMPING : THE JOURNEY TO SUCCESS",
        "DHIQD-7YkTo": "7 Key Tips to Know Before Buying a Bali Property",
        "oFFzcP9m-14": "The 3 Golden Rules",
        "A-8XYkc3hCA": "BALI LEASEHOLD VS FREEHOLD!",
        BhrlhfO1hz4: "A Fashion Success Story",
        E1FguH5Op68: "Leasehold Extensions in Bali",
        aiHuohwGnrU: "Building in Bali",
        nKp94xADWdM: "Bali Real Estate explained",
        _viN8MqKMcQ: "How to 9x your investment"
      };

      return podcastFeed
        .filter((episode) => !["x5iGqCEj1og", "vyL_5E7htbo"].includes(episode.id))
        .map((episode) => ({
          ...episode,
          title: homepageTitleOverrides[episode.id] ?? episode.title
        }))
        .filter((episode) => podcastTopic === "All" || episode.topic === podcastTopic);
    },
    [podcastTopic]
  );

  const allNewsArticles = useMemo(
    () =>
      newsSections.flatMap((section) =>
        section.articles.map((article) => ({
          ...article,
          title: sanitizeCopy(article.title),
          teaser: sanitizeCopy(article.teaser),
          content: sanitizeCopy(article.content),
          date: sanitizeCopy(article.date),
          topic: section.title,
          region:
            "region" in article && (article.region === "Bali" || article.region === "Indonesia")
              ? article.region
              : article.url.includes("/indonesia/")
                ? "Indonesia"
                : "Bali"
        }))
      ),
    []
  );

  const visibleNewsArticles = useMemo(
    () =>
      allNewsArticles.filter(
        (article) =>
          (newsTopic === "All" || article.topic === newsTopic) &&
          (newsRegion === "All" || article.region === newsRegion)
      ),
    [allNewsArticles, newsRegion, newsTopic]
  );

  const visibleEvents = useMemo(
    () => approvedEvents.filter((event) => eventTopic === "All" || event.category === eventTopic),
    [approvedEvents, eventTopic]
  );

  const eventCategories = useMemo(
    () => ["All", ...Array.from(new Set(approvedEvents.map((event) => event.category)))],
    [approvedEvents]
  );

  const monthCalendar = useMemo(() => {
    const anchor = new Date(`${currentEventMonth}-01T00:00:00`);
    if (Number.isNaN(anchor.getTime())) {
      return { label: "No events", cells: [] };
    }
    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const startOffset = monthStart.getDay();
    const cells = [];
    for (let index = 0; index < startOffset; index += 1) cells.push({ date: null, items: [] });
    for (let day = 1; day <= monthEnd.getDate(); day += 1) {
      const currentDate = new Date(year, month, day);
      const iso = formatDateKey(currentDate);
      const items = visibleEvents.filter((event) => parseEventDateParts(event.date).key === iso);
      cells.push({ date: currentDate, items });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, items: [] });
    return {
      label: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(anchor),
      cells
    };
  }, [currentEventMonth, visibleEvents]);

  function toggleFavorite(item: FavoriteItem) {
    setFavorites((current) =>
      current.some((favorite) => favorite.id === item.id)
        ? current.filter((favorite) => favorite.id !== item.id)
        : [...current, item]
    );
  }

  function isFavorite(id: string) {
    return favorites.some((favorite) => favorite.id === id);
  }

  function openFavorite(item: FavoriteItem) {
    if (item.type === "News") {
      const match = allNewsArticles.find((article) => article.id === item.sourceId);
      if (match) {
        setActiveArticle(match);
      }
      return;
    }

    if (item.type === "Podcast") {
      const match = podcastFeed.find((episode) => episode.id === item.sourceId);
      if (match) {
        window.open(match.url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (item.type === "Event") {
      const match = approvedEvents.find((event) => event.id === item.sourceId);
      if (match) {
        window.open(match.signupUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }

    const resourceMatch = resourceDocuments.find((resource) => resource.id === item.sourceId);
    if (resourceMatch) {
      window.open(resourceMatch.url, "_blank", "noopener,noreferrer");
      return;
    }

    const reportMatch = reidReports.find((report) => report.id === item.sourceId);
    if (reportMatch) {
      window.open(reportMatch.url, "_blank", "noopener,noreferrer");
    }
  }

  function getFavoriteCover(item: FavoriteItem) {
    if (item.type === "Podcast") {
      return podcastFeed.find((episode) => episode.id === item.sourceId)?.image ?? null;
    }

    if (item.type === "Ressource") {
      const resource = resourceDocuments.find((entry) => entry.id === item.sourceId);
      return resource ? (ebookCoverMap[resource.title] ?? null) : null;
    }

    return null;
  }

  function getFavoriteDetail(item: FavoriteItem) {
    if (item.type === "News") {
      const article = allNewsArticles.find((entry) => entry.id === item.sourceId);
      return article ? sanitizeCopy(`${article.topic} - ${article.date}`) : "";
    }

    if (item.type === "Podcast") {
      const episode = podcastFeed.find((entry) => entry.id === item.sourceId);
      return episode?.description ?? "";
    }

    if (item.type === "Ressource") {
      const resource = resourceDocuments.find((entry) => entry.id === item.sourceId);
      return resource?.source ?? "";
    }

    const event = approvedEvents.find((entry) => entry.id === item.sourceId);
    return event ? sanitizeCopy(`${event.location} - ${event.date}`) : "";
  }

  function normalizePhoneNumber(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }

    const hasPlus = trimmed.startsWith("+");
    const digits = trimmed.replace(/\D/g, "");
    return `${hasPlus ? "+" : ""}${digits}`;
  }

  function fillDialCodeIfNeeded() {
    setPartnerForm((current) => {
      if (current.whatsapp.trim()) {
        return current;
      }
      return {
        ...current,
        whatsapp: partnerDialCode
      };
    });
  }

  function isValidWhatsapp(value: string) {
    const normalized = normalizePhoneNumber(value);
    const digits = normalized.replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15;
  }

  function markMissing(keys: string[]) {
    setFormErrors(Object.fromEntries(keys.map((key) => [key, true])));
  }

  function handleEventSubmit() {
    const finalCategory = eventForm.category === "Other" ? eventForm.customCategory.trim() : eventForm.category;
    const normalizedSignup = normalizeWebsite(eventForm.signupUrl);
    const missing = [
      !eventForm.title && "event-title",
      !eventForm.date && "event-date",
      !eventForm.time && "event-time",
      !eventForm.location && "event-location",
      !eventForm.signupUrl && "event-signup",
      !eventForm.description && "event-description",
      !finalCategory && "event-category"
    ].filter(Boolean) as string[];

    if (missing.length) {
      markMissing(missing);
      return;
    }
    if (!isValidWebsite(eventForm.signupUrl)) {
      markMissing(["event-signup"]);
      return;
    }
    setFormErrors({});
    submitEvent({
      title: eventForm.title,
      category: finalCategory,
      date: `${eventForm.date} ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· ${eventForm.time}`,
      location: eventForm.location,
      description: eventForm.description,
      signupUrl: normalizedSignup,
      whatsappUrl: eventForm.whatsappUrl || undefined,
      source: "BBC community submission"
    });
    setToastMessage({
      title: "Event submitted",
      copy: "Your event has been received and will be reviewed shortly."
    });

    setEventForm({
      title: "",
      date: "",
      time: "",
      location: "",
      signupUrl: "",
      whatsappUrl: "",
      category: "Networking",
      customCategory: "",
      description: ""
    });
    setEventFormOpen(false);
  }

  function handlePartnerSubmit() {
    const normalizedWhatsapp = normalizePhoneNumber(partnerForm.whatsapp);
    const finalBusinessType =
      partnerForm.businessType === "Other" ? partnerForm.customBusinessType.trim() : partnerForm.businessType.trim();
    const missing = [
      !partnerForm.company && "partner-company",
      !finalBusinessType && "partner-business-type",
      !normalizedWhatsapp && "partner-whatsapp",
      !partnerForm.website && "partner-website",
      !partnerForm.offer && "partner-offer"
    ].filter(Boolean) as string[];
    if (missing.length) {
      markMissing(missing);
      return;
    }
    if (!isValidWhatsapp(normalizedWhatsapp)) {
      markMissing(["partner-whatsapp"]);
      return;
    }
    if (!isValidWebsite(partnerForm.website)) {
      markMissing(["partner-website"]);
      return;
    }
    setFormErrors({});
    submitPartnerApplication({
      name: partnerForm.company,
      category: finalBusinessType,
      whatsapp: normalizedWhatsapp,
      url: normalizeWebsite(partnerForm.website),
      offer: partnerForm.offer,
      logo: partnerForm.logo
    });
    submitMessage({
      type: "Partnerships",
      name: partnerForm.company,
      email: partnerForm.website,
      whatsapp: normalizedWhatsapp,
      subject: "Partner application",
      message: partnerForm.offer
    });
    setToastMessage({
      title: "Application sent",
      copy: "Your partner application has been sent and is now under review."
    });
    setPartnerForm({
      company: "",
      businessType: "",
      customBusinessType: "",
      whatsapp: "",
      website: "",
      offer: "",
      logo: ""
    });
    setPartnerLogoInputKey((current) => current + 1);
    setPartnerFormOpen(false);
  }

  function handleSuggestionSubmit() {
    const missing = [
      !suggestionForm.name && "suggestion-name",
      !suggestionForm.topic && "suggestion-topic",
      !suggestionForm.details && "suggestion-details"
    ].filter(Boolean) as string[];
    if (missing.length) {
      markMissing(missing);
      return;
    }
    setFormErrors({});
    submitMessage({
      type: "Recommendations",
      name: suggestionForm.name,
      email: user?.email ?? "member@balibusinessclub.com",
      subject: suggestionForm.topic,
      message: suggestionForm.details
    });
    setToastMessage({
      title: "Suggestion sent",
      copy: "Your suggestion has been sent to the BBC team for review."
    });
    setSuggestionForm({
      name: user?.name ?? "",
      topic: "",
      details: ""
    });
    setSuggestionOpen(false);
  }

  if (!ready || !user) {
    return <main className="bbc-shell" />;
  }

  return (
    <main className="bbc-shell">
      <header className="bbc-header">
        <div className="bbc-brand clean">
          <Image
            src="/bali-business-club-logo-white.png"
            alt="Bali Business Club"
            width={286}
            height={94}
            className="header-logo-image left"
          />
        </div>

        <nav className="bbc-tab-nav">
          {dashboardTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "bbc-tab active" : "bbc-tab"}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="bbc-header-right">
          <div className="bali-time-chip">
            <BaliTime />
          </div>
          <div className="profile-menu-wrap" ref={profileMenuRef}>
            <button type="button" className="profile-chip minimal" onClick={() => setProfileOpen((open) => !open)}>
              {user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.picture} alt={user.name} className="profile-chip-image" />
              ) : (
                <div className="profile-chip-fallback">{user.name.charAt(0).toUpperCase()}</div>
              )}
              <span>{user.name}</span>
              <ChevronDown size={14} />
            </button>
            {profileOpen ? (
              <div className="profile-menu">
                <div className="profile-menu-head">
                  <div className="profile-menu-copy">
                    <strong>{user.name}</strong>
                    <span>Member since {formatMemberSince(user.memberSince)}</span>
                  </div>
                </div>
                <button type="button" onClick={() => setEditOpen(true)}>
                  <PencilLine size={14} />
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="bbc-panel">
        {activeTab === "home" ? (
          <section className="panel-stack">
            <div className="home-intro">
              <div>
                <h1>
                  {`${greeting},`} <span className="home-name inline">{user.name}</span>
                </h1>
              </div>
              <p>Here is everything you need to know about what is happening in Bali.</p>
            </div>

            <div className="shortcut-grid clean large-home">
              {dashboardShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button key={shortcut.id} type="button" className="shortcut-card clean large" onClick={() => setActiveTab(shortcut.id)}>
                    <div className="shortcut-card-top">
                      <div className="shortcut-icon-wrap">
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="shortcut-copy">
                      <strong>{shortcut.title}</strong>
                      <span>{shortcut.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <article className="quote-card">
              <div className="quote-card-label">
                <Sparkles size={16} />
                <span>Quote of the day</span>
              </div>
              <blockquote>{dailyQuote.quote}</blockquote>
              <small>{dailyQuote.source}</small>
            </article>
          </section>
        ) : null}

        {activeTab === "market" ? (
          <section className="panel-stack">
            <article className="section-card clean page-plain">
              <div className="section-heading">
                <div>
                  <h2>What is happening in Bali real estate right now?</h2>
                  <p className="section-note compact">
                    Switch the report and metric filters to redraw the chart from the REID report data that could be extracted reliably.
                  </p>
                </div>
              </div>

              <div className="filter-bar market-filter-bar">
                {marketReports.map((filter) => (
                  <button
                    key={filter.report}
                    type="button"
                    className={marketFilter === filter.report ? "filter-btn active" : "filter-btn"}
                    onClick={() => setMarketFilter(filter.report)}
                  >
                    {filter.report}
                  </button>
                ))}
              </div>

              {selectedMarketSeries ? (
                <article className="chart-card clean chart-card-featured page-plain">
                  <div className="chart-card-head">
                    <div>
                      <div className="metric-label">{selectedMarketSeries.title}</div>
                      <div className="metric-value">{selectedMarketSeries.highlight}</div>
                    </div>
                    <div className="graph-focus-pill">{filteredCharts.report}</div>
                  </div>

                  <div className="filter-bar market-metric-bar">
                    {filteredCharts.metrics.map((metric) => (
                      <button
                        key={metric.id}
                        type="button"
                        className={marketMetric === metric.id ? "filter-btn active" : "filter-btn"}
                        onClick={() => setMarketMetric(metric.id)}
                      >
                        {metric.title}
                      </button>
                    ))}
                  </div>

                  <InteractiveMarketGraph
                    values={selectedMarketSeries.values}
                    activeIndex={chartSelection[selectedMarketSeries.title] ?? 0}
                    labels={selectedMarketSeries.labels}
                    unit={selectedMarketSeries.unit}
                    title={selectedMarketSeries.title}
                    onSelect={(index) =>
                      setChartSelection((current) => ({
                        ...current,
                        [selectedMarketSeries.title]: index
                      }))
                    }
                  />

                  <p>{selectedMarketSeries.context}</p>
                  <small>{selectedMarketSeries.source}</small>
                </article>
              ) : null}
            </article>

            <article className="section-card clean page-plain">
              <div className="section-heading">
                <div>
                  <h2>Interesting figures from the REID reports</h2>
                </div>
              </div>

              <div className="stat-rectangle-grid">
                {marketStatCards.map((card) => (
                  <article key={card.title} className="stat-rectangle">
                    <strong>{card.title}</strong>
                    <p>{card.detail}</p>
                    <small>{card.source}</small>
                  </article>
                ))}
              </div>
            </article>

            <article className="section-card clean page-plain">
              <div className="section-heading">
                <div>
                  <h2>Download the Market Reports of Bali</h2>
                  <p className="section-note compact single-line market-report-note">
                    Created by REID, a Bali real estate intelligence platform focused on market reports, pricing trends, and property data.
                  </p>
                </div>
                <a href="https://www.realinfo.id/" target="_blank" rel="noreferrer" className="ghost-button compact">
                  More details
                </a>
              </div>

              <div className="market-report-list">
                {reidReports.map((report) => (
                  <article key={report.id} className="market-report-row">
                    <div className="market-report-row-copy">
                      <strong>{report.title}</strong>
                      <small>{report.source}</small>
                    </div>
                    <div className="resource-actions market-report-actions">
                      <button
                        type="button"
                        className="mini-action"
                        onClick={() =>
                          toggleFavorite({
                            id: `fav-${report.id}`,
                            type: "Ressource",
                            title: report.title,
                            note: report.source,
                            sourceId: report.id
                          })
                        }
                      >
                        <Heart
                          size={14}
                          fill={isFavorite(`fav-${report.id}`) ? "currentColor" : "none"}
                        />
                        {isFavorite(`fav-${report.id}`) ? "Saved" : "Save"}
                      </button>
                      <a href={report.url} download className="table-link-button">
                        Download
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "news" ? (
          <section className="panel-stack news-panel-plain">
            <div className="news-toolbar">
              <div>
                <h2>Recent News in Indonesia</h2>
              </div>
              <div className="filter-bar region-filter-bar">
                {(["All", "Bali", "Indonesia"] as const).map((region) => (
                  <button
                    key={region}
                    type="button"
                    className={newsRegion === region ? "filter-btn active" : "filter-btn"}
                    onClick={() => setNewsRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
              <div className="filter-bar topic-filter-bar">
                <button
                  type="button"
                  className={newsTopic === "All" ? "filter-btn active" : "filter-btn"}
                  onClick={() => setNewsTopic("All")}
                >
                  All topics
                </button>
                {newsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.title}
                      type="button"
                      className={newsTopic === section.title ? "filter-btn active" : "filter-btn"}
                      onClick={() => setNewsTopic(section.title)}
                    >
                      <Icon size={14} />
                      {section.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="news-grid clean">
              {visibleNewsArticles.map((article) => {
                  const favorite: FavoriteItem = {
                    id: `fav-${article.id}`,
                    type: "News",
                    title: article.title,
                    note: article.teaser,
                    sourceId: article.id
                  };

                  return (
                    <article key={article.id} className="news-card clean">
                      <button
                        type="button"
                        className="news-toggle"
                        onClick={() => setActiveArticle(article)}
                      >
                        <div className="news-meta">
                          <span className="news-cat">{article.region}</span>
                          <span className="news-cat">{article.topic}</span>
                        </div>
                        <div className="news-title">{article.title}</div>
                        <div className="news-summary">{article.teaser}</div>
                      </button>

                      <div className="news-footer">
                        <small>{article.date}</small>
                        <div className="news-actions">
                          <button type="button" className="table-link-button" onClick={() => setActiveArticle(article)}>
                            Read more
                          </button>
                          <button type="button" className="mini-action" onClick={() => toggleFavorite(favorite)}>
                            <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                            {isFavorite(favorite.id) ? "Saved" : "Save"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        ) : null}

        {activeTab === "events" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Upcoming events in Bali</h2>
                  <p className="section-note compact">Discover upcoming Bali events by category and jump straight to registration.</p>
                </div>
                <button type="button" className="outline-yellow-button" onClick={() => setEventFormOpen(true)}>
                  Add an event
                </button>
              </div>

              <div className="filter-bar">
                {eventCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={eventTopic === category ? "filter-btn active" : "filter-btn"}
                    onClick={() => setEventTopic(category as DashboardEvent["category"] | "All")}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="view-toggle-bar">
                <button type="button" className={eventView === "list" ? "filter-btn active" : "filter-btn"} onClick={() => setEventView("list")}>
                  Event list
                </button>
                <button type="button" className={eventView === "month" ? "filter-btn active" : "filter-btn"} onClick={() => setEventView("month")}>
                  Month view
                </button>
              </div>

              {eventView === "list" ? (
                <div className="event-grid">
                  {visibleEvents.map((event) => {
                    const favorite: FavoriteItem = {
                      id: `fav-${event.id}`,
                      type: "Event",
                      title: event.title,
                      note: `${event.category} ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¿Ãƒâ€šÃ‚Â½ ${event.date}`,
                      sourceId: event.id
                    };

                    return (
                      <article key={event.id} className="event-card">
                        <div className="event-card-top">
                          <span className="news-cat">{event.category}</span>
                          <small>{event.source}</small>
                        </div>
                        <strong>{event.title}</strong>
                        <p>{event.description}</p>
                        <div className="event-meta clean">
                          <span>
                            <CalendarDays size={14} />
                            {event.date}
                          </span>
                          <span>
                            <MapPin size={14} />
                            {event.location}
                          </span>
                        </div>
                        <div className="event-actions">
                          <a href={event.signupUrl} target="_blank" rel="noreferrer" className="table-link-button">
                            Sign up
                          </a>
                          <button type="button" className="mini-action" onClick={() => toggleFavorite(favorite)}>
                            <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                            {isFavorite(favorite.id) ? "Saved" : "Save"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="calendar-panel">
                  <div className="calendar-head">
                    <button
                      type="button"
                      className="ghost-button compact"
                      onClick={() => {
                        const anchor = new Date(`${currentEventMonth}-01T00:00:00`);
                        anchor.setMonth(anchor.getMonth() - 1);
                        setCurrentEventMonth(formatMonthKey(anchor));
                      }}
                    >
                      Previous
                    </button>
                    <div className="calendar-head-copy">
                      <strong>{monthCalendar.label}</strong>
                      <small>{visibleEvents.length} upcoming events</small>
                    </div>
                    <button
                      type="button"
                      className="ghost-button compact"
                      onClick={() => {
                        const anchor = new Date(`${currentEventMonth}-01T00:00:00`);
                        anchor.setMonth(anchor.getMonth() + 1);
                        setCurrentEventMonth(formatMonthKey(anchor));
                      }}
                    >
                      Next
                    </button>
                  </div>
                  <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="calendar-weekday">
                        {day}
                      </div>
                    ))}
                    {monthCalendar.cells.map((cell, index) => (
                      <div key={`${cell.date?.toISOString() ?? "empty"}-${index}`} className={cell.items.length ? "calendar-cell active" : "calendar-cell"}>
                        {cell.date ? <span className="calendar-date">{cell.date.getDate()}</span> : null}
                        <div className="calendar-cell-events">
                          {cell.items.slice(0, 2).map((item) => (
                            <a key={item.id} href={item.signupUrl} target="_blank" rel="noreferrer" className="calendar-chip">
                              {item.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </section>
        ) : null}

        {activeTab === "podcasts" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Episodes</h2>
                </div>
              </div>

              <div className="filter-bar">
                {podcastTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={podcastTopic === topic ? "filter-btn active" : "filter-btn"}
                    onClick={() => setPodcastTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="episode-grid covers">
                {visiblePodcastFeed.map((episode) => {
                  const favorite: FavoriteItem = {
                    id: `fav-${episode.id}`,
                    type: "Podcast",
                    title: episode.title,
                    note: episode.topic,
                    sourceId: episode.id
                  };

                    return (
                      <article key={episode.id} className="episode-card cover-card">
                        <div className="episode-cover">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={episode.image} alt={episode.title} className="episode-cover-image" />
                        </div>
                        <strong>{episode.title}</strong>
                        <p>{episode.description}</p>
                        <div className="episode-actions">
                          <a href={episode.url} target="_blank" rel="noreferrer" className="watch-pill">
                            <Youtube size={14} />
                            Watch
                          </a>
                          <button
                            type="button"
                            className="mini-action"
                            onClick={() => {
                              toggleFavorite(favorite);
                            }}
                          >
                            <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                            {isFavorite(favorite.id) ? "Saved" : "Save"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "resources" ? (
          <section className="panel-stack">
            {Object.entries(groupedResources).map(([section, items]) => (
              <article key={section} className="section-card clean page-plain">
                <div className="section-heading">
                  <div>
                    <h2>{section === "Ebooks" ? "Our Ebooks" : section}</h2>
                  </div>
                </div>

                <div className="resource-visual-grid ebook-grid">
                  {items.map((resource) => {
                    const favorite: FavoriteItem = {
                      id: `fav-${resource.id}`,
                      type: "Ressource",
                      title: resource.title,
                      note: resource.source,
                      sourceId: resource.id
                    };

                    return (
                      <article key={resource.id} className="resource-card-visual">
                        <div className="resource-preview image-cover">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ebookCoverMap[resource.title] ?? "/bali-business-club-logo-white.png"} alt={resource.title} className="resource-cover-image" />
                        </div>
                        <div className="resource-copy visual">
                          <div className="table-main">{resource.title}</div>
                          <small>{resource.source}</small>
                        </div>
                        <div className="resource-actions visual">
                          <button type="button" className="mini-action" onClick={() => toggleFavorite(favorite)}>
                            <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                            {isFavorite(favorite.id) ? "Saved" : "Save"}
                          </button>
                          <a href={resource.url} download className="table-link-button">
                            Download
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {activeTab === "partners" ? (
          <section className="panel-stack">
            <article className="section-card clean page-plain">
              <div className="section-heading">
                <div>
                  <h2>Our Partners</h2>
                </div>
                <button type="button" className="outline-yellow-button" onClick={() => setPartnerFormOpen(true)}>
                  Become a partner
                </button>
              </div>

              <div className="partner-list clean">
                {[...partnerBenefits, ...dynamicPartners.map((partner) => ({
                  name: partner.name,
                  category: partner.category || (partner.name === "Grow in Kedungu" ? "International School" : "Partner"),
                  offer: partner.offer,
                  button: "CONTACT",
                  url: partner.url,
                  logo: partner.logo || "/bali-business-club-logo-white.png"
                }))].map((partner) => (
                  <article key={partner.name} className="partner-card clean">
                    <div className="partner-copy">
                      <div className="partner-logo-wrap">
                        <Image src={partner.logo} alt={partner.name} width={260} height={88} className="partner-logo" />
                      </div>
                      <strong>{partner.name}</strong>
                      <span className="partner-category">{partner.category}</span>
                      <p>{partner.offer}</p>
                    </div>
                    <a href={partner.url} target="_blank" rel="noreferrer" className="table-link-button">
                      {partner.button}
                    </a>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "favorites" ? (
          <section className="panel-stack">
            <article className="section-card clean page-plain">
              <div className="section-heading">
                <div>
                  <h2>Favorites</h2>
                </div>
              </div>

              <div className="favorites-groups">
                {(["News", "Podcast", "Ressource", "Event"] as const).map((type) => {
                  const items = favorites.filter((favorite) => favorite.type === type);
                  return (
                    <div key={type} className="favorites-group">
                      <h3>{type}</h3>
                      {items.length ? (
                        <div className="favorites-grid clean favorites-fixed">
                          {items.map((item) => (
                            <article key={item.id} className="favorite-card clean">
                              {item.type === "Podcast" || item.type === "Ressource" ? (
                                <div className={item.type === "Ressource" ? "favorite-cover-wrap resource" : "favorite-cover-wrap podcast"}>
                                  <img src={getFavoriteCover(item) ?? ""} alt={item.title} className="favorite-cover-image" />
                                </div>
                              ) : null}
                              <strong>{item.title}</strong>
                              <p>{getFavoriteDetail(item)}</p>
                              <div className="favorite-actions">
                                <button type="button" className="table-link-button" onClick={() => openFavorite(item)}>
                                  Open
                                </button>
                                <button
                                  type="button"
                                  className="mini-action danger"
                                  onClick={() => setFavorites((current) => current.filter((favorite) => favorite.id !== item.id))}
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-copy">No saved {type.toLowerCase()} items yet.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "connect" ? (
          <section className="panel-stack">
            <article className="section-card clean page-plain">
              <div className="section-heading">
                <div>
                  <h2>Follow Bali Business Club</h2>
                </div>
              </div>

              <div className="social-grid social-grid-inline">
                {socials.map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="social-row">
                    <div className="social-main">
                      <div className="social-badge">
                        <SocialLogo icon={social.icon} />
                      </div>
                      <strong>{social.name}</strong>
                      <span>{social.handle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Podcast suggestions</h2>
                </div>
                <button type="button" className="outline-yellow-button" onClick={() => setSuggestionOpen(true)}>
                  Make a suggestion
                </button>
              </div>
              <p className="section-note compact">Share podcast ideas, guest suggestions, or themes you want the BBC team to cover next.</p>
            </article>

            <div className="whatsapp-banner">
              <div className="whatsapp-banner-copy">
                <MessageCircleMore size={16} />
                <div>
                  <strong>Questions for the BBC team?</strong>
                  <span>Message us directly on WhatsApp.</span>
                </div>
              </div>
              <a href="https://wa.link/zg5xw8" target="_blank" rel="noreferrer" className="table-link-button">
                Open chat
              </a>
            </div>
          </section>
        ) : null}
      </section>

      {editOpen ? (
        <ProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={(updates) => {
            updateProfile(updates);
            setProfileOpen(false);
          }}
        />
      ) : null}

      {activeArticle ? (
        <div className="modal-overlay open">
          <div className="modal-card news-modal">
            <div className="modal-head">
              <div className="news-modal-headline">
                <span className="news-cat">{activeArticle.topic}</span>
                <h2>{activeArticle.title}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setActiveArticle(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="news-modal-body">
              <p className="news-expanded-copy">{activeArticle.content}</p>
              <div className="news-modal-footer">
                <small>{activeArticle.date}</small>
                <div className="news-actions">
                  <button type="button" className="ghost-button compact" onClick={() => setActiveArticle(null)}>
                    Back
                  </button>
                  <a href={activeArticle.url} target="_blank" rel="noreferrer" className="table-link-button">
                    Source
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {eventFormOpen ? (
        <div className="modal-overlay open" onClick={() => setEventFormOpen(false)}>
          <div className="modal-card wide-form" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Add an event</h2>
                <p className="section-note compact single-line">Submit an upcoming Bali event and we will review it before it appears on the dashboard.</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setEventFormOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form className="form-grid clean">
              <label>
                Event name
                <input className={formErrors["event-title"] ? "field-error" : ""} required value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <div className="two-col-grid">
                <label>
                  Date
                  <input
                    className={formErrors["event-date"] ? "field-error" : ""}
                    type="date"
                    required
                    value={eventForm.date}
                    onFocus={(event) => event.currentTarget.showPicker?.()}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))}
                  />
                </label>
                <label>
                  Time
                  <input
                    className={formErrors["event-time"] ? "field-error" : ""}
                    type="time"
                    required
                    value={eventForm.time}
                    onFocus={(event) => event.currentTarget.showPicker?.()}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) => setEventForm((current) => ({ ...current, time: event.target.value }))}
                  />
                </label>
              </div>
              <label>
                Location
                <input className={formErrors["event-location"] ? "field-error" : ""} required value={eventForm.location} onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))} placeholder="Venue in Bali" />
              </label>
              <label>
                Category
                <select className={formErrors["event-category"] ? "field-error" : ""} required value={eventForm.category} onChange={(event) => setEventForm((current) => ({ ...current, category: event.target.value as DashboardEvent["category"] }))}>
                  <option>Networking</option>
                  <option>Business</option>
                  <option>Wellness & Sport</option>
                  <option>Music & Culture</option>
                  <option>Other</option>
                </select>
              </label>
              {eventForm.category === "Other" ? (
                <label>
                  Custom category
                  <input className={formErrors["event-category"] ? "field-error" : ""} required value={eventForm.customCategory} onChange={(event) => setEventForm((current) => ({ ...current, customCategory: event.target.value }))} placeholder="Write the event category" />
                </label>
              ) : null}
              <label>
                Website to sign up
                <input className={formErrors["event-signup"] ? "field-error" : ""} required value={eventForm.signupUrl} onChange={(event) => setEventForm((current) => ({ ...current, signupUrl: event.target.value }))} placeholder="example.com/event" />
              </label>
              <label>
                WhatsApp link (optional)
                <input value={eventForm.whatsappUrl} onChange={(event) => setEventForm((current) => ({ ...current, whatsappUrl: event.target.value }))} placeholder="https://wa.me/..." />
              </label>
              <label>
                Description
                <textarea className={formErrors["event-description"] ? "field-error" : ""} required rows={5} value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))} placeholder="What is this event about?" />
              </label>
              <button type="button" className="primary-button compact" onClick={handleEventSubmit}>
                Create Event
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {partnerFormOpen ? (
        <div className="modal-overlay open" onClick={() => setPartnerFormOpen(false)}>
          <div className="modal-card wide-form" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Become a partner</h2>
                <p className="section-note compact single-line">Send your offer and the BBC team will review it before it is shared with members.</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setPartnerFormOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form className="form-grid clean">
              <label>
                Company name
                <input className={formErrors["partner-company"] ? "field-error" : ""} required placeholder="Your company name" value={partnerForm.company} onChange={(event) => setPartnerForm((current) => ({ ...current, company: event.target.value }))} />
              </label>
              <label>
                What does your business do?
                <select
                  className={formErrors["partner-business-type"] ? "field-error" : ""}
                  required
                  value={partnerForm.businessType}
                  onChange={(event) => setPartnerForm((current) => ({ ...current, businessType: event.target.value, customBusinessType: "" }))}
                >
                  <option value="">Select a business type</option>
                  {partnerBusinessOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {partnerForm.businessType === "Other" ? (
                <label>
                  Other business type
                  <input
                    className={formErrors["partner-business-type"] ? "field-error" : ""}
                    required
                    placeholder="Tell us what your business is"
                    value={partnerForm.customBusinessType}
                    onChange={(event) => setPartnerForm((current) => ({ ...current, customBusinessType: event.target.value }))}
                  />
                </label>
              ) : null}
              <label>
                WhatsApp number
                <div className="phone-input-wrap">
                  <PhoneFlag phone={partnerForm.whatsapp || partnerDialCode} />
                  <input
                    className={formErrors["partner-whatsapp"] ? "field-error" : ""}
                    type="tel"
                    inputMode="numeric"
                    required
                    placeholder={partnerDialCode}
                    value={partnerForm.whatsapp}
                    onFocus={fillDialCodeIfNeeded}
                    onChange={(event) =>
                      setPartnerForm((current) => ({ ...current, whatsapp: normalizePhoneNumber(event.target.value) }))
                    }
                  />
                </div>
              </label>
              <label>
                Website
                <input className={formErrors["partner-website"] ? "field-error" : ""} required placeholder="example.com" value={partnerForm.website} onChange={(event) => setPartnerForm((current) => ({ ...current, website: event.target.value }))} />
              </label>
              <label>
                Company logo
                <div className="file-upload-row">
                  <label className="blue-upload-button" htmlFor="partner-logo-upload">Choose file</label>
                  <span>{partnerForm.logo ? "Logo selected" : "PNG or JPG"}</span>
                </div>
                <input
                  id="partner-logo-upload"
                  key={partnerLogoInputKey}
                  type="file"
                  accept="image/*"
                  className="hidden-file-input"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () =>
                      setPartnerForm((current) => ({ ...current, logo: String(reader.result ?? "") }));
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <label>
                What would you like to offer?
                <textarea className={formErrors["partner-offer"] ? "field-error" : ""} required rows={5} placeholder="Describe the offer for BBC members." value={partnerForm.offer} onChange={(event) => setPartnerForm((current) => ({ ...current, offer: event.target.value }))} />
              </label>
              <button type="button" className="primary-button compact" onClick={handlePartnerSubmit}>
                Send application
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {suggestionOpen ? (
        <div className="modal-overlay open" onClick={() => setSuggestionOpen(false)}>
          <div className="modal-card wide-form" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Make a suggestion</h2>
                <p className="section-note compact single-line">Share a podcast idea, guest, or topic you want us to cover next.</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setSuggestionOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form className="form-grid clean">
              <label>
                Your name
                <input className={formErrors["suggestion-name"] ? "field-error" : ""} value={suggestionForm.name} onChange={(event) => setSuggestionForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label>
                Topic idea
                <input className={formErrors["suggestion-topic"] ? "field-error" : ""} value={suggestionForm.topic} onChange={(event) => setSuggestionForm((current) => ({ ...current, topic: event.target.value }))} placeholder="What should we cover next?" />
              </label>
              <label>
                Details
                <textarea className={formErrors["suggestion-details"] ? "field-error" : ""} rows={5} value={suggestionForm.details} onChange={(event) => setSuggestionForm((current) => ({ ...current, details: event.target.value }))} placeholder="Share guest ideas, angles, or questions." />
              </label>
              <button type="button" className="primary-button compact" onClick={handleSuggestionSubmit}>
                Send suggestion
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="modal-overlay open toast-overlay">
          <div className="toast-card">
            <div className="toast-check">?</div>
            <strong>{toastMessage.title}</strong>
            <p>{toastMessage.copy}</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
