"use client";

import Image from "next/image";
import Link from "next/link";
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
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="eyebrow">BBC MEMBER AREA</span>
          <h1>BALI BUSINESS CLUB</h1>
        </div>

        <nav className="sidebar-nav">
          {dashboardTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "nav-item active" : "nav-item"}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">POWERED BY BBC</p>
          <p>
            Clean member shortcuts, curated business intelligence, and one place to keep your favorite reports,
            episodes, and updates.
          </p>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">HELLO MADE</p>
            <h2>{activeTitle}</h2>
          </div>

          <div className="topbar-right">
            <BaliTime />
            <div className="brand-lockup">
              <Image
                src="/bali-business-club-logo-white.svg"
                alt="Bali Business Club"
                width={154}
                height={48}
                className="brand-image"
              />
            </div>
            <div className="profile-menu-wrap">
              <button type="button" className="profile-chip" onClick={() => setProfileOpen((current) => !current)}>
                <CircleUserRound size={18} />
                <span>PROFILE</span>
                <ChevronDown size={16} />
              </button>
              {profileOpen ? (
                <div className="profile-menu">
                          <div className="profile-avatar">M</div>
                  <div>
                    <strong>Made Prasetya</strong>
                    <span>Member since January 2026</span>
                  </div>
                  <button type="button">
                    <Sparkles size={14} />
                    UPDATE PHOTO
                  </button>
                  <button type="button">
                    <Settings size={14} />
                    EDIT DETAILS
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {activeTab === "home" ? (
          <section className="page-grid">
            <article className="hero-card">
              <p className="eyebrow">HOME</p>
              <h3>HELLO MADE</h3>
              <p>
                Choose a shortcut and jump straight into the part of the dashboard you need today. This homepage
                stays intentionally clean with no charts and no clutter.
              </p>
            </article>

            <div className="shortcut-grid">
              {dashboardShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button key={shortcut.id} className="shortcut-card" onClick={() => setActiveTab(shortcut.id)}>
                    <Icon size={22} />
                    <strong>{shortcut.title}</strong>
                    <span>{shortcut.copy}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {activeTab === "market" ? (
          <section className="page-stack">
            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">POWERED BY REID</p>
                  <h3>WHAT IS HAPPENING IN BALI REAL ESTATE RIGHT NOW?</h3>
                </div>
                <span className="pill">REID-SOURCED SNAPSHOT</span>
              </div>

              <div className="filter-row">
                <button className="filter-chip active">ALL STRATEGIES</button>
                <button className="filter-chip">BUY</button>
                <button className="filter-chip">BUILD</button>
                <button className="filter-chip">SELL</button>
                <button className="filter-chip">OPERATE</button>
              </div>

              <div className="insight-grid">
                {insightHighlights.map((item) => (
                  <article key={item.title} className="insight-card">
                    <span>{item.label}</span>
                    <strong>{item.title}</strong>
                    <p>{item.summary}</p>
                    <small>{item.source}</small>
                  </article>
                ))}
              </div>

              <div className="mini-chart-grid">
                {marketStatCards.map((card) => (
                  <article key={card.title} className="mini-chart-card">
                    <div className="mini-chart-header">
                      <span>{card.title}</span>
                      <strong>{card.figure}</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${card.bar}%` }} />
                    </div>
                    <p>{card.context}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TOP 6</p>
                  <h3>INTERESTING MARKET STATS</h3>
                </div>
              </div>

              <div className="stat-grid">
                {[
                  { stat: "70,000+", label: "Records in REID's database", source: "REID Our Data" },
                  { stat: "7,000+", label: "Leasehold properties in REID market overview", source: "REID Home Updated" },
                  { stat: "3,000+", label: "Freehold properties in REID market overview", source: "REID Home Updated" },
                  { stat: "60,000+", label: "Rental properties in REID market overview", source: "REID Home Updated" },
                  { stat: "$389M", label: "Total Bali rental revenue in Q3 2023", source: "REID Q3 2023 Buyers Report" },
                  { stat: "64.9%", label: "Average market occupancy in Q3 2023", source: "REID Q3 2023 Buyers Report" }
                ].map((item) => (
                  <article key={item.label} className="stat-card">
                    <strong>{item.stat}</strong>
                    <p>{item.label}</p>
                    <small>{item.source}</small>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "news" ? (
          <section className="page-stack">
            {newsSections.map((section) => {
              const Icon = section.icon;
              return (
                <article key={section.title} className="section-card">
                  <div className="section-heading">
                    <div className="section-heading-inline">
                      <Icon size={18} />
                      <div>
                        <p className="eyebrow">UPDATED HOURLY</p>
                        <h3>{section.title}</h3>
                      </div>
                    </div>
                    <span className="pill">MINIMUM 3 ARTICLES PER SECTION</span>
                  </div>

                  <div className="news-list">
                    {section.articles.map((article) => {
                      const expanded = expandedArticles.includes(article.id);
                      return (
                        <article key={article.id} className={expanded ? "news-card expanded" : "news-card"}>
                          <button type="button" className="news-toggle" onClick={() => toggleArticle(article.id)}>
                            <div className="news-head">
                              <div>
                                <strong>{article.title}</strong>
                                <p>{article.teaser}</p>
                              </div>
                              <ChevronDown size={18} />
                            </div>
                          </button>
                          {expanded ? <div className="news-summary">{article.summary}</div> : null}
                          {expanded ? (
                            <div className="news-source-row">
                              <span>SOURCE: {article.source}</span>
                              <Link href={article.url} target="_blank">
                                READ SOURCE
                                <ExternalLink size={14} />
                              </Link>
                            </div>
                          ) : null}
                          <small>{article.date}</small>
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
          <section className="page-stack">
            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">YOUTUBE SYNC</p>
                  <h3>BALI BUSINESS CLUB PODCASTS</h3>
                </div>
                <Link className="pill-link" href="https://www.youtube.com/@BaliBusinessClub" target="_blank">
                  OPEN CHANNEL
                </Link>
              </div>

              <div className="podcast-grid">
                {podcastFeed.map((episode) => (
                  <article key={episode.title} className="podcast-card">
                    <span>{episode.published}</span>
                    <strong>{episode.title}</strong>
                    <p>{episode.description}</p>
                    <Link href={episode.url} target="_blank">
                      WATCH EPISODE
                      <ExternalLink size={14} />
                    </Link>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "resources" ? (
          <section className="page-stack">
            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">CURATED LIBRARY</p>
                  <h3>REPORTS AND EBOOKS</h3>
                </div>
              </div>

              <div className="resource-list">
                {resourceFolders.map((resource) => (
                  <article key={resource.title} className="resource-card">
                    <div>
                      <strong>{resource.title}</strong>
                      <p>{resource.copy}</p>
                      <small>SOURCE: {resource.source}</small>
                    </div>
                    <Link href={resource.url} target="_blank" className="primary-link-button">
                      DOWNLOAD
                    </Link>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "partners" ? (
          <section className="page-grid two-columns">
            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PARTNER BENEFITS</p>
                  <h3>MEMBER OFFERS</h3>
                </div>
              </div>

              <div className="partner-list">
                {partnerBenefits.map((partner) => (
                  <article key={partner.name} className="partner-card">
                    <strong>{partner.name}</strong>
                    <p>{partner.offer}</p>
                    <Link href={partner.url} target="_blank" className="primary-link-button">
                      {partner.button}
                    </Link>
                  </article>
                ))}
              </div>
            </article>

            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">BECOME A PARTNER</p>
                  <h3>PARTNERSHIP FORM</h3>
                </div>
              </div>

              <form className="form-grid">
                <label>
                  COMPANY NAME
                  <input placeholder="Your company" />
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
                  <textarea placeholder="Tell BBC about your member offer." rows={5} />
                </label>
                <button className="primary-button" type="button">
                  SEND APPLICATION
                </button>
              </form>
            </article>
          </section>
        ) : null}

        {activeTab === "favorites" ? (
          <section className="page-stack">
            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">SAVED ITEMS</p>
                  <h3>FAVORITES</h3>
                </div>
              </div>

              <div className="favorites-list">
                {favorites.map((item) => (
                  <article key={item.title} className="favorite-card">
                    <span>{item.type}</span>
                    <strong>{item.title}</strong>
                    <p>{item.note}</p>
                    <small>LAST SAVED: {item.savedAt}</small>
                  </article>
                ))}
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "connect" ? (
          <section className="page-grid two-columns">
            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">ABOUT BBC</p>
                  <h3>CONNECT WITH US</h3>
                </div>
              </div>

              <p className="section-copy">
                Bali Business Club brings together conversations, tools, and relationships for people building,
                investing, and operating in Bali. Use the links below to keep in touch across every platform.
              </p>

              <div className="social-grid">
                {socials.map((social) => (
                  <Link key={social.name} href={social.url} target="_blank" className="social-card">
                    <strong>{social.name}</strong>
                    <span>{social.handle}</span>
                  </Link>
                ))}
              </div>

              <Link href="https://wa.link/zg5xw8" target="_blank" className="primary-link-button wide">
                CONTACT BBC ON WHATSAPP
              </Link>
            </article>

            <article className="section-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TOPICS</p>
                  <h3>PODCAST RECOMMENDATION FORM</h3>
                </div>
              </div>

              <form className="form-grid">
                <label>
                  YOUR NAME
                  <input placeholder="Name" />
                </label>
                <label>
                  TOPIC IDEA
                  <input placeholder="Suggested topic" />
                </label>
                <label>
                  WHY SHOULD WE COVER IT?
                  <textarea placeholder="Give BBC some context." rows={4} />
                </label>
                <button className="primary-button" type="button">
                  SEND RECOMMENDATION
                </button>
              </form>
            </article>

            <article className="section-card full-span">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">INSTAGRAM</p>
                  <h3>RECENT POSTS</h3>
                </div>
              </div>

              <div className="carousel-row">
                {connectPanels.map((panel) => (
                  <Link key={panel.title} href={panel.url} target="_blank" className="carousel-card">
                    <span>{panel.meta}</span>
                    <strong>{panel.title}</strong>
                    <p>{panel.copy}</p>
                  </Link>
                ))}
              </div>
            </article>
          </section>
        ) : null}
      </section>
    </main>
  );
}
