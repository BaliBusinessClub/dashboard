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
    setRefreshStatus(`Refreshing ${section}...`);

    const response = await fetch(`/api/refresh/${section}`, { method: "POST" });
    const result = (await response.json()) as { message?: string };
    setRefreshStatus(result.message ?? `Refresh completed for ${section}.`);
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">BBC BACKEND</p>
          <h1>ADMIN DASHBOARD</h1>
        </div>
      </header>

      <nav className="admin-tabs">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "admin-tab active" : "admin-tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === "analytics" ? (
        <section className="admin-grid">
          {[
            { value: "28", label: "PEOPLE ONLINE" },
            { value: "25-34", label: "TOP AGE RANGE" },
            { value: "MARKET INSIGHTS", label: "MOST VISITED PAGE" },
            { value: "14 MIN", label: "AVG SESSION TIME" }
          ].map((card) => (
            <article key={card.label} className="admin-card">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "reporting" ? (
        <section className="admin-stack">
          <article className="admin-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MANUAL CONTROLS</p>
                <h3>UPDATE MAIN DASHBOARD CONTENT</h3>
              </div>
            </div>

            <div className="reporting-grid">
              {reportingTargets.map((target) => (
                <button key={target} className="reporting-button" onClick={() => refreshSection(target)}>
                  <RefreshCw size={18} />
                  REFRESH {target.toUpperCase()}
                </button>
              ))}
            </div>

            {refreshStatus ? <p className="status-banner">{refreshStatus}</p> : null}
          </article>
        </section>
      ) : null}

      {activeTab === "database" ? (
        <section className="admin-stack">
          <article className="admin-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MEMBER DATABASE</p>
                <h3>USERS</h3>
              </div>
              <a href="/api/export/users" className="primary-link-button">
                <Download size={16} />
                EXPORT CSV
              </a>
            </div>

            <div className="table-wrap">
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
        <section className="admin-stack">
          <article className="admin-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SITE SETTINGS</p>
                <h3>CONFIGURATION</h3>
              </div>
            </div>

            <div className="settings-list">
              <div className="setting-row">
                <span>HOURLY NEWS REFRESH</span>
                <button className="toggle-button active">ACTIVE</button>
              </div>
              <div className="setting-row">
                <span>PODCAST AUTO-SYNC</span>
                <button className="toggle-button active">ACTIVE</button>
              </div>
              <div className="setting-row">
                <span>EMAIL VERIFICATION REQUIRED</span>
                <button className="toggle-button active">ACTIVE</button>
              </div>
              <div className="setting-row">
                <span>ADMIN ALERTS</span>
                <button className="toggle-button">
                  <BellRing size={14} />
                  CONFIGURE
                </button>
              </div>
            </div>
          </article>
        </section>
      ) : null}
    </main>
  );
}
