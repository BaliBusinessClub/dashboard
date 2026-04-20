"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  ChartColumn,
  ChevronDown,
  CircleUserRound,
  ExternalLink,
  Heart,
  House,
  Newspaper,
  Podcast,
  Settings,
  Sparkles,
  UsersRound
} from "lucide-react";
import { BaliTime } from "@/components/bali-time";
import {
  connectPanels,
  dashboardShortcuts,
  favorites,
  insightHighlights,
  marketStatCards,
  newsSections,
  partnerBenefits,
  podcastFeed,
  resourceFolders,
  socials
} from "@/lib/mock-data";

const dashboardTabs = [
  { id: "home", label: "HOME", icon: House },
  { id: "market", label: "MARKET INSIGHTS", icon: ChartColumn },
  { id: "news", label: "NEWS", icon: Newspaper },
  { id: "podcasts", label: "PODCASTS", icon: Podcast },
  { id: "resources", label: "RESSOURCES", icon: BookOpen },
  { id: "partners", label: "PARTNERS", icon: Building2 },
  { id: "favorites", label: "FAVORITES", icon: Heart },
  { id: "connect", label: "CONNECT WITH US", icon: UsersRound }
] as const;

type DashboardTab = (typeof dashboardTabs)[number]["id"];

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeTitle = useMemo(
    () => dashboardTabs.find((tab) => tab.id === activeTab)?.label ?? "HOME",
    [activeTab]
  );

  function toggleArticle(articleId: string) {
    setExpandedArticles((current) =>
      current.includes(articleId) ? current.filter((item) => item !== articleId) : [...current, articleId]
    );
  }

  return (
    <main className="bbc-shell">
      <header className="bbc-header">
        <div className="bbc-brand">
          <div className="bbc-brand-mark">
            <Image
              src="/bali-business-club-logo-white.svg"
              alt="Bali Business Club"
              width={40}
              height={40}
              className="brand-mark-image"
            />
          </div>
          <div>
            <div className="bbc-brand-name">BALI BUSINESS CLUB</div>
            <div className="bbc-brand-sub">MEMBER DASHBOARD</div>
          </div>
        </div>

        <div className="bbc-header-right">
          <div className="bali-time-chip">
            <BaliTime />
          </div>
          <div className="profile-menu-wrap">
            <button type="button" className="profile-chip minimal" onClick={() => setProfileOpen((open) => !open)}>
              <CircleUserRound size={18} />
              <span>MADE</span>
              <ChevronDown size={14} />
            </button>
            {profileOpen ? (
              <div className="profile-menu">
                <div className="profile-avatar">M</div>
                <div>
                  <strong>Made Prasetya</strong>
                  <span>made@balibusinessclub.com</span>
                </div>
                <button type="button">
                  <Sparkles size={14} />
                  UPDATE PHOTO
                </button>
                <button type="button">
                  <Settings size={14} />
                  EDIT PROFILE
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
            <p className="eyebrow">BALI BUSINESS CLUB</p>
            <h1>{activeTitle}</h1>
          </div>
        </div>

        {activeTab === "home" ? (
          <section className="panel-stack">
            <article className="hero-compact">
              <div>
                <p className="eyebrow">WELCOME</p>
                <h2>HELLO MADE</h2>
              </div>
              <p>
                Keep this homepage minimal and fast. Use the shortcuts below to jump straight into the dashboard
                section you need, without charts or extra noise.
              </p>
            </article>

            <div className="shortcut-grid clean">
              {dashboardShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button key={shortcut.id} type="button" className="shortcut-card clean" onClick={() => setActiveTab(shortcut.id)}>
                    <div className="shortcut-top">
                      <Icon size={18} />
                      <span>SHORTCUT</span>
                    </div>
                    <strong>{shortcut.title}</strong>
                    <p>{shortcut.copy}</p>
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
                  <p className="eyebrow">POWERED BY REID</p>
                  <h2>WHAT IS HAPPENING IN BALI REAL ESTATE RIGHT NOW?</h2>
                </div>
                <span className="inline-tag">REID REPORTS ONLY</span>
              </div>

              <div className="filter-bar">
                <button type="button" className="filter-btn active">ALL STRATEGIES</button>
                <button type="button" className="filter-btn">BUY</button>
                <button type="button" className="filter-btn">BUILD</button>
                <button type="button" className="filter-btn">SELL</button>
                <button type="button" className="filter-btn">OPERATE</button>
              </div>

              <div className="insight-grid clean">
                {insightHighlights.map((item) => (
                  <article key={item.title} className="insight-card clean">
                    <span>{item.label}</span>
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
                  <p className="eyebrow">MARKET SNAPSHOT</p>
                  <h2>KEY REID SIGNALS</h2>
                </div>
              </div>

              <div className="metric-grid">
                {marketStatCards.map((card) => (
                  <article key={card.title} className="metric-card">
                    <div className="metric-label">{card.title}</div>
                    <div className="metric-value">{card.figure}</div>
                    <div className="metric-bar">
                      <div className="metric-bar-fill" style={{ width: `${card.bar}%` }} />
                    </div>
                    <p>{card.context}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TOP 6</p>
                  <h2>INTERESTING MARKET STATS</h2>
                </div>
              </div>

              <div className="table-shell">
                <table>
                  <thead>
                    <tr>
                      <th>STAT</th>
                      <th>DETAIL</th>
                      <th>SOURCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>70,000+</td>
                      <td>Records in REID&apos;s database</td>
                      <td>REID Our Data</td>
                    </tr>
                    <tr>
                      <td>7,000+</td>
                      <td>Leasehold properties in REID market overview</td>
                      <td>REID Home Updated</td>
                    </tr>
                    <tr>
                      <td>3,000+</td>
                      <td>Freehold properties in REID market overview</td>
                      <td>REID Home Updated</td>
                    </tr>
                    <tr>
                      <td>60,000+</td>
                      <td>Rental properties in REID market overview</td>
                      <td>REID Home Updated</td>
                    </tr>
                    <tr>
                      <td>$389M</td>
                      <td>Total Bali rental revenue in Q3 2023</td>
                      <td>REID Q3 2023 Buyers Report</td>
                    </tr>
                    <tr>
                      <td>64.9%</td>
                      <td>Average market occupancy in Q3 2023</td>
                      <td>REID Q3 2023 Buyers Report</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "news" ? (
          <section className="panel-stack">
            {newsSections.map((section) => {
              const Icon = section.icon;
              return (
                <article key={section.title} className="section-card clean">
                  <div className="section-heading">
                    <div className="section-heading-inline">
                      <Icon size={16} />
                      <div>
                        <p className="eyebrow">UPDATED HOURLY</p>
                        <h2>{section.title}</h2>
                      </div>
                    </div>
                    <span className="inline-tag">MINIMUM 3 ARTICLES</span>
                  </div>

                  <div className="news-grid clean">
                    {section.articles.map((article) => {
                      const expanded = expandedArticles.includes(article.id);
                      return (
                        <article key={article.id} className={expanded ? "news-card clean expanded" : "news-card clean"}>
                          <button type="button" className="news-toggle" onClick={() => toggleArticle(article.id)}>
                            <div className="news-meta">
                              <span className="news-cat">{section.title}</span>
                            </div>
                            <div className="news-title">{article.title}</div>
                            <div className="news-summary">{article.teaser}</div>
                          </button>
                          {expanded ? <div className="news-expanded-copy">{article.summary}</div> : null}
                          <div className="news-footer">
                            <small>{article.date}</small>
                            {expanded ? (
                              <a href={article.url} target="_blank" rel="noreferrer" className="news-source-link">
                                SOURCE: {article.source}
                                <ExternalLink size={13} />
                              </a>
                            ) : <span className="news-source-link muted">CLICK TO EXPAND</span>}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}

        {activeTab === "podcasts" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">YOUTUBE CHANNEL</p>
                  <h2>BALI BUSINESS CLUB PODCASTS</h2>
                </div>
                <a href="https://www.youtube.com/@BaliBusinessClub" target="_blank" rel="noreferrer" className="action-link">
                  OPEN CHANNEL
                </a>
              </div>

              <div className="episode-grid">
                {podcastFeed.map((episode) => (
                  <article key={episode.title} className="episode-card">
                    <div className="episode-tag">YOUTUBE</div>
                    <strong>{episode.title}</strong>
                    <p>{episode.description}</p>
                    <div className="episode-meta">
                      <span>{episode.published}</span>
                      <a href={episode.url} target="_blank" rel="noreferrer">
                        WATCH
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "resources" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">RESOURCE LIBRARY</p>
                  <h2>EBOOKS AND REPORTS</h2>
                </div>
              </div>

              <div className="table-shell">
                <table>
                  <thead>
                    <tr>
                      <th>TITLE</th>
                      <th>SOURCE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceFolders.map((resource) => (
                      <tr key={resource.title}>
                        <td>
                          <div className="table-main">{resource.title}</div>
                          <div className="table-sub">{resource.copy}</div>
                        </td>
                        <td>{resource.source}</td>
                        <td>
                          <a href={resource.url} target="_blank" rel="noreferrer" className="table-link-button">
                            DOWNLOAD
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "partners" ? (
          <section className="two-col-grid">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">MEMBER BENEFITS</p>
                  <h2>PARTNERS</h2>
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
                  <p className="eyebrow">PARTNERSHIP</p>
                  <h2>BECOME A PARTNER</h2>
                </div>
              </div>

              <form className="form-grid clean">
                <label>
                  COMPANY NAME
                  <input placeholder="Your company name" />
                </label>
                <label>
                  WHATSAPP NUMBER
                  <input placeholder="+62..." />
                </label>
                <label>
                  WEBSITE
                  <input placeholder="https://..." />
                </label>
                <label>
                  WHAT WOULD YOU LIKE TO OFFER?
                  <textarea rows={5} placeholder="Describe the offer for BBC members." />
                </label>
                <button type="button" className="primary-button compact">
                  SEND APPLICATION
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
                  <p className="eyebrow">SAVED CONTENT</p>
                  <h2>FAVORITES</h2>
                </div>
              </div>

              <div className="favorites-grid clean">
                {favorites.map((item) => (
                  <article key={item.title} className="favorite-card clean">
                    <div className="favorite-label">{item.type}</div>
                    <strong>{item.title}</strong>
                    <p>{item.note}</p>
                    <small>{item.savedAt}</small>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "connect" ? (
          <section className="panel-stack">
            <div className="two-col-grid">
              <article className="section-card clean">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">ABOUT BBC</p>
                    <h2>CONNECT WITH US</h2>
                  </div>
                </div>
                <p className="section-copy">
                  Bali Business Club brings together entrepreneurs, investors, operators, and media around the
                  business opportunities shaping Bali. Use the links below to stay close to our content and team.
                </p>
                <div className="social-list">
                  {socials.map((social) => (
                    <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="social-row">
                      <strong>{social.name}</strong>
                      <span>{social.handle}</span>
                    </a>
                  ))}
                </div>
                <a href="https://wa.link/zg5xw8" target="_blank" rel="noreferrer" className="primary-button link-button compact">
                  CONTACT BBC ON WHATSAPP
                </a>
              </article>

              <article className="section-card clean">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">FUTURE EPISODES</p>
                    <h2>RECOMMEND A TOPIC</h2>
                  </div>
                </div>
                <form className="form-grid clean">
                  <label>
                    YOUR NAME
                    <input placeholder="Name" />
                  </label>
                  <label>
                    TOPIC IDEA
                    <input placeholder="Podcast topic" />
                  </label>
                  <label>
                    WHY SHOULD WE COVER IT?
                    <textarea rows={5} placeholder="Share context for the BBC team." />
                  </label>
                  <button type="button" className="primary-button compact">
                    SEND RECOMMENDATION
                  </button>
                </form>
              </article>
            </div>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">INSTAGRAM</p>
                  <h2>RECENT POSTS</h2>
                </div>
              </div>

              <div className="carousel-row clean">
                {connectPanels.map((panel) => (
                  <a key={panel.title} href={panel.url} target="_blank" rel="noreferrer" className="carousel-card clean">
                    <span>{panel.meta}</span>
                    <strong>{panel.title}</strong>
                    <p>{panel.copy}</p>
                  </a>
                ))}
              </div>
            </article>
          </section>
        ) : null}
      </section>
    </main>
  );
}
