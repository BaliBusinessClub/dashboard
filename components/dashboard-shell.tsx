"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  ChartColumn,
  ChevronDown,
  ExternalLink,
  Facebook,
  Heart,
  House,
  Instagram,
  LogOut,
  MessageCircleMore,
  MessagesSquare,
  Music2,
  Newspaper,
  PencilLine,
  Podcast,
  Save,
  SlidersHorizontal,
  Trash2,
  Youtube,
  X
} from "lucide-react";
import { SessionUser, useAuth } from "@/components/auth-provider";
import { BaliTime } from "@/components/bali-time";
import {
  dashboardShortcuts,
  initialFavorites,
  instagramPanels,
  marketReports,
  marketStatCards,
  newsSections,
  partnerBenefits,
  podcastFeed,
  podcastTopics,
  resourceDocuments,
  socials
} from "@/lib/mock-data";

const dashboardTabs = [
  { id: "home", label: "Home", icon: House },
  { id: "market", label: "Market Insights", icon: ChartColumn },
  { id: "news", label: "News", icon: Newspaper },
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
              />
              <text x={point.x} y={height - 18} textAnchor="middle" className="market-axis-copy market-axis-label">
                {point.label}
              </text>
            </g>
          ))}
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
                role: email.toLowerCase().includes("admin") ? "admin" : "member"
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
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);
  const [podcastTopic, setPodcastTopic] = useState<PodcastTopic>("All");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([...initialFavorites]);
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

  const activeTitle = useMemo(
    () => dashboardTabs.find((tab) => tab.id === activeTab)?.label ?? "Home",
    [activeTab]
  );

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

  function toggleArticle(articleId: string) {
    setExpandedArticles((current) =>
      current.includes(articleId) ? current.filter((item) => item !== articleId) : [...current, articleId]
    );
  }

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

  function renderSocialIcon(icon: (typeof socials)[number]["icon"]) {
    if (icon === "youtube") {
      return <Youtube size={18} />;
    }
    if (icon === "spotify") {
      return <Music2 size={18} />;
    }
    if (icon === "instagram") {
      return <Instagram size={18} />;
    }
    if (icon === "facebook") {
      return <Facebook size={18} />;
    }
    return <MessagesSquare size={18} />;
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

        <div className="bbc-header-right">
          <div className="bali-time-chip">
            <BaliTime />
          </div>
          <div className="profile-menu-wrap" ref={profileMenuRef}>
            <button type="button" className="profile-chip minimal" onClick={() => setProfileOpen((open) => !open)}>
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

      <section className="bbc-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">BBC section</span>
            <h1>{activeTitle}</h1>
          </div>
        </div>

        {activeTab === "home" ? (
          <section className="panel-stack">
            <div className="home-intro">
              <div>
                <span className="eyebrow">Welcome</span>
                <h2>Hello {user.name}</h2>
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
                  <span className="eyebrow">Powered by REID</span>
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
                      <span className="eyebrow small-pill">
                        <SlidersHorizontal size={12} />
                        Active view
                      </span>
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

                  <div className="chart-caption">
                    <span>Selected point</span>
                    <strong>
                      {selectedMarketSeries.labels[chartSelection[selectedMarketSeries.title] ?? 0]}:{" "}
                      {formatChartValue(
                        selectedMarketSeries.values[chartSelection[selectedMarketSeries.title] ?? 0],
                        selectedMarketSeries.unit
                      )}
                    </strong>
                  </div>

                  <p>{selectedMarketSeries.context}</p>
                  <small>{selectedMarketSeries.source}</small>
                </article>
              ) : null}
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Top report stats</span>
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
          </section>
        ) : null}

        {activeTab === "news" ? (
          <section className="panel-stack news-panel-plain">
            <div className="news-toolbar">
              <div>
                <span className="eyebrow">Daily news</span>
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
                  const expanded = expandedArticles.includes(article.id);
                  const favorite: FavoriteItem = {
                    id: `fav-${article.id}`,
                    type: "News",
                    title: article.title,
                    note: article.teaser,
                    sourceId: article.id
                  };

                  return (
                    <article key={article.id} className={expanded ? "news-card clean expanded" : "news-card clean"}>
                      <button type="button" className="news-toggle" onClick={() => toggleArticle(article.id)}>
                        <div className="news-meta">
                          <span className="news-cat">{article.topic}</span>
                        </div>
                        <div className="news-title">{article.title}</div>
                        <div className="news-summary">{article.teaser}</div>
                      </button>

                      {expanded ? <div className="news-expanded-copy">{article.content}</div> : null}

                      <div className="news-footer">
                        <small>{article.date}</small>
                        <div className="news-actions">
                          <button type="button" className="mini-action" onClick={() => toggleFavorite(favorite)}>
                            <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                            {isFavorite(favorite.id) ? "Saved" : "Save"}
                          </button>
                          {expanded ? (
                            <a href={article.url} target="_blank" rel="noreferrer" className="news-source-link">
                              Source
                              <ExternalLink size={13} />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        ) : null}

        {activeTab === "podcasts" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">BBC podcast library</span>
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
                    <a key={episode.id} href={episode.url} target="_blank" rel="noreferrer" className="episode-card cover-card">
                      <div className="episode-cover">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={episode.image} alt={episode.title} className="episode-cover-image" />
                      </div>
                      <div className="episode-tag">{episode.topic}</div>
                      <strong>{episode.title}</strong>
                      <p>{episode.description}</p>
                      <div className="episode-meta">
                        <span>{episode.published}</span>
                        <button
                          type="button"
                          className="mini-action"
                          onClick={(event) => {
                            event.preventDefault();
                            toggleFavorite(favorite);
                          }}
                        >
                          <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                          {isFavorite(favorite.id) ? "Saved" : "Save"}
                        </button>
                      </div>
                    </a>
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
                    <span className="eyebrow">{section === "Ebooks" ? "BBC library" : "External reports"}</span>
                    <h2>{section}</h2>
                  </div>
                </div>

                <div className="resource-list">
                  {items.map((resource) => {
                    const favorite: FavoriteItem = {
                      id: `fav-${resource.id}`,
                      type: "Ressource",
                      title: resource.title,
                      note: resource.source,
                      sourceId: resource.id
                    };

                    return (
                      <article key={resource.id} className="resource-row">
                        <div className="resource-copy">
                          <div className="table-main">{resource.title}</div>
                          <div className="table-sub">{resource.note}</div>
                          <small>{resource.source}</small>
                        </div>
                        <div className="resource-actions">
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
                  <span className="eyebrow">Member discounts</span>
                  <h2>Partner benefits</h2>
                </div>
              </div>

              <div className="partner-list clean">
                {partnerBenefits.map((partner) => (
                  <article key={partner.name} className="partner-card clean">
                    <div>
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
                  <span className="eyebrow">Partnership form</span>
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
                  <span className="eyebrow">Saved items</span>
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
                  <span className="eyebrow">Stay connected</span>
                  <h2>Follow Bali Business Club</h2>
                </div>
              </div>

              <p className="section-note">
                Stay close to the BBC ecosystem through our social channels, podcast links, and direct WhatsApp contact.
              </p>

              <div className="connect-shell">
                <div className="social-list">
                  {socials.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="social-row">
                      <div className="social-main">
                        <div className="social-badge">{renderSocialIcon(social.icon)}</div>
                        <div>
                          <strong>{social.name}</strong>
                          <p>{social.handle}</p>
                        </div>
                      </div>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>

                <div className="connect-feed">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">Instagram</span>
                      <h2>Recent content</h2>
                    </div>
                  </div>

                  <div className="carousel-row clean">
                    {instagramPanels.map((panel) => (
                      <a key={panel.title} href={panel.url} target="_blank" rel="noreferrer" className="carousel-card clean">
                        <span className="eyebrow small-pill">Instagram</span>
                        <strong>{panel.title}</strong>
                        <p>{panel.copy}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Recommend a topic</span>
                  <h2>Suggest future podcast ideas</h2>
                </div>
              </div>

              <form className="form-grid clean">
                <label>
                  Name
                  <input placeholder="Your name" />
                </label>
                <label>
                  Email
                  <input placeholder="you@example.com" />
                </label>
                <label>
                  Topic suggestion
                  <input placeholder="What should we cover next?" />
                </label>
                <label>
                  Details
                  <textarea rows={5} placeholder="Share the angle, guest idea, or question you want BBC to explore." />
                </label>
                <button type="button" className="primary-button compact">
                  Send suggestion
                </button>
              </form>
            </article>

            <a href="https://wa.link/zg5xw8" target="_blank" rel="noreferrer" className="whatsapp-banner">
              <div className="whatsapp-banner-copy">
                <MessageCircleMore size={16} />
                <div>
                  <strong>Questions for the BBC team?</strong>
                  <span>Message us directly on WhatsApp.</span>
                </div>
              </div>
              <span className="whatsapp-banner-link">
                Open chat
                <ExternalLink size={14} />
              </span>
            </a>
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
    </main>
  );
}
