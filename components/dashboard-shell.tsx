"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  ChartColumn,
  ChevronDown,
  CircleUserRound,
  ExternalLink,
  Heart,
  House,
  LineChart,
  LogOut,
  Newspaper,
  PencilLine,
  Podcast,
  Save,
  Trash2,
  X
} from "lucide-react";
import { SessionUser, useAuth } from "@/components/auth-provider";
import { BaliTime } from "@/components/bali-time";
import {
  dashboardShortcuts,
  initialFavorites,
  insightHighlights,
  marketChartSeries,
  marketFilters,
  marketStatCards,
  newsSections,
  partnerBenefits,
  podcastFeed,
  podcastTopics,
  resourceDocuments
} from "@/lib/mock-data";

const dashboardTabs = [
  { id: "home", label: "Home", icon: House },
  { id: "market", label: "Market Insights", icon: ChartColumn },
  { id: "news", label: "News", icon: Newspaper },
  { id: "podcasts", label: "Podcasts", icon: Podcast },
  { id: "resources", label: "Ressources", icon: BookOpen },
  { id: "partners", label: "Partners", icon: Building2 },
  { id: "favorites", label: "Favorites", icon: Heart }
] as const;

type DashboardTab = (typeof dashboardTabs)[number]["id"];
type MarketFilter = (typeof marketFilters)[number];
type NewsTopic = (typeof newsSections)[number]["title"];
type PodcastTopic = (typeof podcastTopics)[number];
type FavoriteItem = {
  id: string;
  type: "News" | "Podcast" | "Ressource";
  title: string;
  note: string;
  sourceId: string;
};

function InteractiveLineChart({
  values,
  activeIndex,
  onSelect,
  labels
}: {
  values: number[];
  activeIndex: number;
  onSelect: (index: number) => void;
  labels: string[];
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = max === min ? 50 : 100 - ((value - min) / (max - min)) * 76 - 10;
      return { x, y, value, index };
    });

  return (
    <div className="interactive-chart">
      <svg viewBox="0 0 100 100" className="sparkline">
        <polyline points={points.map((point) => `${point.x},${point.y}`).join(" ")} className="sparkline-line yellow" />
        {points.map((point) => (
          <circle
            key={point.index}
            cx={point.x}
            cy={point.y}
            r={point.index === activeIndex ? 3.4 : 2.2}
            className={point.index === activeIndex ? "chart-dot active" : "chart-dot"}
            onClick={() => onSelect(point.index)}
          />
        ))}
      </svg>
      <div className="chart-index-row">
        {values.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === activeIndex ? "chart-index-button active" : "chart-index-button"}
            onClick={() => onSelect(index)}
          >
            {labels[index] ?? index + 1}
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
  const [marketFilter, setMarketFilter] = useState<MarketFilter>("All");
  const [chartSelection, setChartSelection] = useState<Record<string, number>>({});
  const [newsTopic, setNewsTopic] = useState<NewsTopic>(newsSections[0].title);
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

  const filteredInsights = useMemo(
    () => insightHighlights.filter((item) => item.strategies.includes(marketFilter)),
    [marketFilter]
  );

  const filteredCharts = useMemo(
    () => marketChartSeries.filter((item) => item.strategies.includes(marketFilter)),
    [marketFilter]
  );

  const visiblePodcastFeed = useMemo(
    () => podcastFeed.filter((episode) => podcastTopic === "All" || episode.topic === podcastTopic),
    [podcastTopic]
  );

  const activeNewsSection = useMemo(
    () => newsSections.find((section) => section.title === newsTopic) ?? newsSections[0],
    [newsTopic]
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

  if (!ready || !user) {
    return <main className="bbc-shell" />;
  }

  return (
    <main className="bbc-shell">
      <header className="bbc-header">
        <div className="bbc-brand clean">
          <Image
            src="/bali-business-club-logo-white.svg"
            alt="Bali Business Club"
            width={164}
            height={34}
            className="header-logo-image left"
          />
        </div>

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
                <CircleUserRound size={18} />
              )}
              <span>{user.name}</span>
              <ChevronDown size={14} />
            </button>
            {profileOpen ? (
              <div className="profile-menu">
                <div className="profile-menu-head">
                  <div className="profile-avatar">
                    {user.picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.picture} alt={user.name} />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="profile-menu-copy">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
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
            <article className="hero-compact minimal-home premium-hero">
              <div>
                <span className="eyebrow">Welcome</span>
                <h2>Hello {user.name}</h2>
              </div>
              <p>Choose where you want to go.</p>
            </article>

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
                      <span>Open section</span>
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
                </div>
              </div>

              <div className="filter-bar">
                {marketFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={marketFilter === filter ? "filter-btn active" : "filter-btn"}
                    onClick={() => setMarketFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="dashboard-chart-grid">
                {filteredCharts.map((series) => {
                  const activeIndex = chartSelection[series.title] ?? series.values.length - 1;
                  return (
                    <article key={series.title} className="chart-card clean">
                      <div className="chart-card-head">
                        <div>
                          <div className="metric-label">{series.title}</div>
                          <div className="metric-value small">{series.values[activeIndex]}</div>
                        </div>
                        <LineChart size={18} />
                      </div>
                      <InteractiveLineChart
                        values={series.values}
                        activeIndex={activeIndex}
                        labels={["Jan", "Feb", "Mar", "Apr", "May", "Latest"]}
                        onSelect={(index) =>
                          setChartSelection((current) => ({
                            ...current,
                            [series.title]: index
                          }))
                        }
                      />
                      <div className="chart-caption">
                        <span>Selected point</span>
                        <strong>{series.values[activeIndex]}</strong>
                      </div>
                      <p>{series.context}</p>
                    </article>
                  );
                })}
              </div>

              <div className="insight-grid clean compact">
                {filteredInsights.map((item) => (
                  <article key={item.title} className="insight-card clean">
                    <span className="eyebrow small-pill">{item.label}</span>
                    <strong>{item.title}</strong>
                    <p>{item.summary}</p>
                    <small>{item.source}</small>
                  </article>
                ))}
              </div>
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
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Daily news</span>
                  <h2>Relevant news by topic</h2>
                </div>
              </div>

              <div className="filter-bar">
                {newsSections.map((section) => (
                  <button
                    key={section.title}
                    type="button"
                    className={newsTopic === section.title ? "filter-btn active" : "filter-btn"}
                    onClick={() => setNewsTopic(section.title)}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              <div className="news-grid clean">
                {activeNewsSection.articles.map((article) => {
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
                          <span className="news-cat">{activeNewsSection.title}</span>
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
            </article>
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
                        <Image src={episode.image} alt={episode.title} width={640} height={360} className="episode-cover-image" />
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
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Resource library</span>
                  <h2>PDF library</h2>
                </div>
              </div>

              <p className="section-note">
                The direct file-by-file PDF sync still needs the public Google Drive file list or Drive API wiring. The layout is ready for it, but I am not going to invent files that are not exposed yet.
              </p>

              <div className="resource-list">
                {resourceDocuments.map((resource) => {
                  const favorite: FavoriteItem = {
                    id: `fav-${resource.id}`,
                    type: "Ressource",
                    title: resource.title,
                    note: resource.source,
                    sourceId: resource.id
                  };

                  return (
                    <article key={resource.id} className="resource-row">
                      <div>
                        <div className="table-main">{resource.title}</div>
                        <div className="table-sub">{resource.note}</div>
                        <small>{resource.source}</small>
                      </div>
                      <div className="resource-actions">
                        <button type="button" className="mini-action" onClick={() => toggleFavorite(favorite)}>
                          <Heart size={14} fill={isFavorite(favorite.id) ? "currentColor" : "none"} />
                          {isFavorite(favorite.id) ? "Saved" : "Save"}
                        </button>
                        <a href={resource.url} target="_blank" rel="noreferrer" className="table-link-button">
                          Download
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </article>
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
