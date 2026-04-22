"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  CalendarRange,
  ChartColumn,
  ChevronDown,
  ExternalLink,
  Heart,
  House,
  LogOut,
  MessageCircleMore,
  MessagesSquare,
  Newspaper,
  PencilLine,
  Podcast,
  Save,
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
  type: "News" | "Podcast" | "Ressource";
  title: string;
  note: string;
  sourceId: string;
};

type NewsArticleView = (typeof newsSections)[number]["articles"][number] & {
  topic: string;
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
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
  const [podcastTopic, setPodcastTopic] = useState<PodcastTopic>("All");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([...initialFavorites]);
  const [activeArticle, setActiveArticle] = useState<NewsArticleView | null>(null);
  const [eventTopic, setEventTopic] = useState<DashboardEvent["category"] | "All">("All");
  const [approvedEvents, setApprovedEvents] = useState<DashboardEvent[]>([]);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    location: "",
    signupUrl: "",
    whatsappUrl: "https://wa.link/zg5xw8",
    category: "Networking" as DashboardEvent["category"],
    description: ""
  });
  const [greeting, setGreeting] = useState(getGreeting());
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
    setApprovedEvents([
      ...baliEvents,
      ...getReviewedEvents().filter((item) => item.status === "approved")
    ]);
  }, []);

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
      resourceDocuments.reduce<Record<string, Array<(typeof resourceDocuments)[number]>>>((groups, item) => {
        if (!groups[item.section]) {
          groups[item.section] = [];
        }
        groups[item.section].push(item);
        return groups;
      }, {}),
    []
  );

  const visiblePodcastFeed = useMemo(
    () => podcastFeed.filter((episode) => podcastTopic === "All" || episode.topic === podcastTopic),
    [podcastTopic]
  );

  const allNewsArticles = useMemo(
    () =>
      newsSections.flatMap((section) =>
        section.articles.map((article) => ({
          ...article,
          topic: section.title
        }))
      ),
    []
  );

  const visibleNewsArticles = useMemo(
    () => allNewsArticles.filter((article) => newsTopic === "All" || article.topic === newsTopic),
    [allNewsArticles, newsTopic]
  );

  const visibleEvents = useMemo(
    () => approvedEvents.filter((event) => eventTopic === "All" || event.category === eventTopic),
    [approvedEvents, eventTopic]
  );

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
        setActiveTab("news");
        setActiveArticle(match);
      }
      return;
    }

    if (item.type === "Podcast") {
      const match = podcastFeed.find((episode) => episode.id === item.sourceId);
      if (match) {
        setActiveTab("podcasts");
        window.open(match.url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    const match = resourceDocuments.find((resource) => resource.id === item.sourceId);
    if (match) {
      setActiveTab("resources");
      window.open(match.url, "_blank", "noopener,noreferrer");
    }
  }

  function handleEventSubmit() {
    const submission = submitEvent({
      title: eventForm.title,
      category: eventForm.category,
      date: eventForm.date,
      location: eventForm.location,
      description: eventForm.description,
      signupUrl: eventForm.signupUrl,
      whatsappUrl: eventForm.whatsappUrl,
      source: "BBC community submission"
    });

    setEventForm({
      title: "",
      date: "",
      location: "",
      signupUrl: "",
      whatsappUrl: "https://wa.link/zg5xw8",
      category: "Networking",
      description: ""
    });
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
                <h2>
                  {greeting} {user.name}
                </h2>
              </div>
              <p>Everything you need for Bali Business Club in one place.</p>
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
          </section>
        ) : null}

        {activeTab === "market" ? (
          <section className="panel-stack">
            <article className="section-card clean">
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
                <article className="chart-card clean chart-card-featured">
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

            <article className="section-card clean">
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

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Download the REID reports</h2>
                  <p className="section-note compact">All attached REID reports are available here for direct download.</p>
                </div>
              </div>

              <div className="resource-list">
                {reidReports.map((report) => (
                  <article key={report.id} className="resource-row">
                    <div className="resource-copy">
                      <div className="table-main">{report.title}</div>
                      <small>{report.source}</small>
                    </div>
                    <div className="resource-actions">
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
                <h2>Relevant news by topic</h2>
              </div>
              <div className="filter-bar">
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
                          <span className="news-cat">{article.topic}</span>
                        </div>
                        <div className="news-title">{article.title}</div>
                        <div className="news-summary">{article.teaser}</div>
                      </button>

                      <div className="news-footer">
                        <small>{article.date}</small>
                        <div className="news-actions">
                          <button type="button" className="table-link-button" onClick={() => setActiveArticle(article)}>
                            Open article
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
                  <h2>Events happening in Bali now</h2>
                  <p className="section-note compact">Discover upcoming Bali events by category and jump straight to registration.</p>
                </div>
              </div>

              <div className="filter-bar">
                {(["All", "Networking", "Business", "Wellness & Sport", "Music & Culture"] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={eventTopic === category ? "filter-btn active" : "filter-btn"}
                    onClick={() => setEventTopic(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="event-grid">
                {visibleEvents.map((event) => (
                  <article key={event.id} className="event-card">
                    <div className="event-card-top">
                      <span className="news-cat">{event.category}</span>
                      <small>{event.source}</small>
                    </div>
                    <strong>{event.title}</strong>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="event-actions">
                      <a href={event.signupUrl} target="_blank" rel="noreferrer" className="table-link-button">
                        Sign up
                      </a>
                      {event.whatsappUrl ? (
                        <a href={event.whatsappUrl} target="_blank" rel="noreferrer" className="ghost-button compact">
                          WhatsApp
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Add an event</h2>
                  <p className="section-note compact">Submit a Bali event and the BBC admin team can review it before it appears on the dashboard.</p>
                </div>
              </div>

              <form className="form-grid clean">
                <label>
                  Event name
                  <input value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} />
                </label>
                <label>
                  Date and time
                  <input value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} placeholder="April 28, 2026 · 8:30 AM" />
                </label>
                <label>
                  Location
                  <input value={eventForm.location} onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))} placeholder="Venue in Bali" />
                </label>
                <label>
                  Category
                  <select value={eventForm.category} onChange={(event) => setEventForm((current) => ({ ...current, category: event.target.value as DashboardEvent["category"] }))}>
                    <option>Networking</option>
                    <option>Business</option>
                    <option>Wellness & Sport</option>
                    <option>Music & Culture</option>
                  </select>
                </label>
                <label>
                  Website to sign up
                  <input value={eventForm.signupUrl} onChange={(event) => setEventForm((current) => ({ ...current, signupUrl: event.target.value }))} placeholder="https://..." />
                </label>
                <label>
                  WhatsApp link
                  <input value={eventForm.whatsappUrl} onChange={(event) => setEventForm((current) => ({ ...current, whatsappUrl: event.target.value }))} />
                </label>
                <label>
                  Description
                  <textarea rows={5} value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))} placeholder="What is this event about?" />
                </label>
                <button type="button" className="primary-button compact" onClick={handleEventSubmit}>
                  Send event
                </button>
              </form>
            </article>
          </section>
        ) : null}

        {activeTab === "podcasts" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Episodes by topic</h2>
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
                        <div className="episode-tag">{episode.topic}</div>
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
              <article key={section} className="section-card clean">
                <div className="section-heading">
                  <div>
                    <h2>{section}</h2>
                  </div>
                </div>

                <div className="resource-visual-grid">
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
                        <div className="resource-preview">
                          <iframe title={resource.title} src={`${resource.url}#toolbar=0&navpanes=0&scrollbar=0&page=1`} />
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
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Partner benefits</h2>
                </div>
              </div>

              <div className="partner-list clean">
                {partnerBenefits.map((partner) => (
                  <article key={partner.name} className="partner-card clean">
                    <div className="partner-copy">
                      <div className="partner-logo-wrap">
                        <Image src={partner.logo} alt={partner.name} width={260} height={88} className="partner-logo" />
                      </div>
                      <strong>{partner.name}</strong>
                      <p>{partner.offer}</p>
                    </div>
                    <a href={partner.url} target="_blank" rel="noreferrer" className="table-link-button">
                      {partner.button}
                    </a>
                  </article>
                ))}
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Become a partner</h2>
                </div>
              </div>

              <form className="form-grid clean">
                <label>
                  Company name
                  <input placeholder="Your company name" />
                </label>
                <label>
                  WhatsApp number
                  <input placeholder="+62..." />
                </label>
                <label>
                  Website
                  <input placeholder="https://..." />
                </label>
                <label>
                  What would you like to offer?
                  <textarea rows={5} placeholder="Describe the offer for BBC members." />
                </label>
                <button type="button" className="primary-button compact">
                  Send application
                </button>
              </form>
            </article>
          </section>
        ) : null}

        {activeTab === "favorites" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Favorites</h2>
                </div>
              </div>

              <div className="favorites-groups">
                {(["News", "Podcast", "Ressource"] as const).map((type) => {
                  const items = favorites.filter((favorite) => favorite.type === type);
                  return (
                    <div key={type} className="favorites-group">
                      <h3>{type}</h3>
                      {items.length ? (
                        <div className="favorites-grid clean">
                          {items.map((item) => (
                            <article key={item.id} className="favorite-card clean">
                              <div className="favorite-label">{item.type}</div>
                              <strong>{item.title}</strong>
                              <p>{item.note}</p>
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
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Follow Bali Business Club</h2>
                </div>
              </div>

              <div className="social-list">
                {socials.map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="social-row">
                    <div className="social-main">
                      <div className="social-badge">
                        <SocialLogo icon={social.icon} />
                      </div>
                      <strong>{social.name}</strong>
                    </div>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
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
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
