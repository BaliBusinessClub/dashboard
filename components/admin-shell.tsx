"use client";

import { useState } from "react";
import { BellRing, Database, Download, RefreshCw, Settings, Users } from "lucide-react";
import { dashboardUsers } from "@/lib/mock-data";

const adminTabs = [
  { id: "analytics", label: "ANALYTICS", icon: Users },
  { id: "reporting", label: "REPORTING", icon: RefreshCw },
  { id: "database", label: "DATABASE", icon: Database },
  { id: "settings", label: "SETTINGS", icon: Settings }
] as const;

type AdminTab = (typeof adminTabs)[number]["id"];

const reportingTargets = ["market-insights", "news", "podcasts", "resources"];

export function AdminShell() {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  async function refreshSection(section: string) {
    setRefreshStatus(`REFRESHING ${section.toUpperCase()}...`);

    const response = await fetch(`/api/refresh/${section}`, { method: "POST" });
    const result = (await response.json()) as { message?: string };
    setRefreshStatus(result.message?.toUpperCase() ?? `REFRESH COMPLETED FOR ${section.toUpperCase()}.`);
  }

  return (
    <main className="bbc-shell admin-mode">
      <header className="bbc-header">
        <div className="bbc-brand">
          <div className="bbc-brand-mark admin-mark">BBC</div>
          <div>
            <div className="bbc-brand-name">BALI BUSINESS CLUB</div>
            <div className="bbc-brand-sub">ADMIN DASHBOARD</div>
          </div>
        </div>
      </header>

      <nav className="bbc-tab-nav">
        {adminTabs.map((tab) => {
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
            <p className="eyebrow">BBC BACKEND</p>
            <h1>{activeTab}</h1>
          </div>
        </div>

        {activeTab === "analytics" ? (
          <section className="panel-stack">
            <div className="metric-grid compact">
              {[
                { value: "28", label: "PEOPLE ONLINE", detail: "LIVE MEMBERS IN DASHBOARD" },
                { value: "25-34", label: "TOP AGE RANGE", detail: "MOST ACTIVE MEMBER GROUP" },
                { value: "MARKET INSIGHTS", label: "MOST VISITED PAGE", detail: "TOP PAGE THIS WEEK" },
                { value: "14 MIN", label: "AVG SESSION TIME", detail: "AVERAGE MEMBER ENGAGEMENT" }
              ].map((card) => (
                <article key={card.label} className="metric-card">
                  <div className="metric-label">{card.label}</div>
                  <div className="metric-value">{card.value}</div>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "reporting" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">MANUAL CONTROLS</p>
                  <h2>UPDATE DASHBOARD CONTENT</h2>
                </div>
              </div>

              <div className="reporting-grid">
                {reportingTargets.map((target) => (
                  <button key={target} type="button" className="reporting-button" onClick={() => refreshSection(target)}>
                    <RefreshCw size={16} />
                    REFRESH {target.toUpperCase()}
                  </button>
                ))}
              </div>

              {refreshStatus ? <p className="status-banner">{refreshStatus}</p> : null}
            </article>
          </section>
        ) : null}

        {activeTab === "database" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">MEMBER DATABASE</p>
                  <h2>USERS</h2>
                </div>
                <a href="/api/export/users" className="table-link-button">
                  <Download size={14} />
                  EXPORT CSV
                </a>
              </div>

              <div className="table-shell">
                <table>
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>MEMBERSHIP</th>
                      <th>JOINED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardUsers.map((user) => (
                      <tr key={user.email}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.membership}</td>
                        <td>{user.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        ) : null}

        {activeTab === "settings" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">SYSTEM SETTINGS</p>
                  <h2>CONFIGURATION</h2>
                </div>
              </div>

              <div className="settings-list clean">
                <div className="setting-row clean">
                  <span>HOURLY NEWS REFRESH</span>
                  <button type="button" className="filter-btn active">ACTIVE</button>
                </div>
                <div className="setting-row clean">
                  <span>PODCAST AUTO-SYNC</span>
                  <button type="button" className="filter-btn active">ACTIVE</button>
                </div>
                <div className="setting-row clean">
                  <span>EMAIL VERIFICATION REQUIRED</span>
                  <button type="button" className="filter-btn active">ACTIVE</button>
                </div>
                <div className="setting-row clean">
                  <span>ADMIN ALERTS</span>
                  <button type="button" className="filter-btn">
                    <BellRing size={14} />
                    CONFIGURE
                  </button>
                </div>
              </div>
            </article>
          </section>
        ) : null}
      </section>
    </main>
  );
}
