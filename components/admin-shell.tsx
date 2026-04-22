"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BellRing, Database, Download, LogOut, MessageSquareText, RefreshCw, Settings, Users } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { adminAnalyticsCards, adminAnalyticsCharts, adminMessages, adminSettings, dashboardUsers } from "@/lib/mock-data";

const adminTabs = [
  { id: "analytics", label: "Analytics", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquareText },
  { id: "reporting", label: "Reporting", icon: RefreshCw },
  { id: "database", label: "Database", icon: Database },
  { id: "settings", label: "Settings", icon: Settings }
] as const;

type AdminTab = (typeof adminTabs)[number]["id"];
const reportingTargets = ["market-insights", "news", "podcasts", "resources", "partners"];

function MiniBarChart({
  title,
  data
}: {
  title: string;
  data: readonly { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((item) => item.value));

  return (
    <article className="section-card clean">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="admin-chart-list">
        {data.map((item) => (
          <div key={item.label} className="admin-chart-row">
            <div className="admin-chart-copy">
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
            <div className="admin-chart-track">
              <div className="admin-chart-fill" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export function AdminShell() {
  const router = useRouter();
  const { user, ready, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);
  const [settingsState, setSettingsState] = useState(
    adminSettings.map((setting) => ({
      ...setting,
      enabled: setting.value === "Active" || setting.value === "Enabled"
    }))
  );
  const groupedMessages = useMemo(
    () =>
      adminMessages.reduce<Record<string, Array<(typeof adminMessages)[number]>>>((groups, message) => {
        if (!groups[message.type]) {
          groups[message.type] = [];
        }
        groups[message.type].push(message);
        return groups;
      }, {}),
    []
  );

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user) {
      router.replace("/");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [ready, router, user]);

  async function refreshSection(section: string) {
    setRefreshStatus(`Refreshing ${section}...`);
    const response = await fetch(`/api/refresh/${section}`, { method: "POST" });
    const result = (await response.json()) as { message?: string };
    setRefreshStatus(result.message ?? `Refresh completed for ${section}.`);
  }

  if (!ready || !user) {
    return <main className="bbc-shell admin-mode" />;
  }

  return (
    <main className="bbc-shell admin-mode">
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

        <button
          type="button"
          className="profile-chip minimal"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          <LogOut size={14} />
          <span>{user.name}</span>
        </button>
      </header>

      <section className="bbc-panel">
        {activeTab === "analytics" ? (
          <section className="panel-stack">
            <div className="metric-grid compact admin-metric-grid">
              {adminAnalyticsCards.map((card) => (
                <article key={card.label} className="metric-card">
                  <div className="metric-label">{card.label}</div>
                  <div className="metric-value">{card.value}</div>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>

            <div className="two-col-grid">
              <MiniBarChart title="Most visited pages" data={adminAnalyticsCharts.pageVisits} />
              <MiniBarChart title="Member age ranges" data={adminAnalyticsCharts.ageRanges} />
            </div>
          </section>
        ) : null}

        {activeTab === "messages" ? (
          <section className="panel-stack">
            {Object.entries(groupedMessages).map(([group, items]) => (
              <article key={group} className="section-card clean">
                <div className="section-heading">
                  <div>
                    <h2>{group}</h2>
                    <p className="section-note compact">{items.length} incoming message{items.length > 1 ? "s" : ""} in this category.</p>
                  </div>
                </div>

                <div className="admin-message-list">
                  {items.map((message) => (
                    <article key={message.id} className="admin-message-card">
                      <div className="admin-message-top">
                        <strong>{message.subject}</strong>
                        <small>{message.date}</small>
                      </div>
                      <p>{message.message}</p>
                      <div className="admin-message-meta">
                        <span>{message.name}</span>
                        <span>{message.email}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {activeTab === "reporting" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Manual refresh controls</h2>
                  <p className="section-note compact">Pull a section manually before the scheduled auto-update runs.</p>
                </div>
              </div>

              <div className="reporting-grid">
                {reportingTargets.map((target) => (
                  <button key={target} type="button" className="reporting-button" onClick={() => refreshSection(target)}>
                    <RefreshCw size={16} />
                    Refresh {target.replace("-", " ")}
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
                  <h2>Member database</h2>
                  <p className="section-note compact">Export the current user list to CSV or review key member information here.</p>
                </div>
                <a href="/api/export/users" className="table-link-button">
                  <Download size={14} />
                  Export CSV
                </a>
              </div>

              <div className="table-shell">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Membership</th>
                      <th>Age range</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardUsers.map((member) => (
                      <tr key={member.email}>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.phone}</td>
                        <td>{member.membership}</td>
                        <td>{member.ageRange}</td>
                        <td>{member.joined}</td>
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
                  <h2>Platform settings</h2>
                  <p className="section-note compact">Control refreshes, verification, routing, and admin notifications from one place.</p>
                </div>
              </div>

              <div className="settings-list clean">
                {settingsState.map((setting, index) => (
                  <div key={setting.label} className="setting-row clean">
                    <div>
                      <strong>{setting.label}</strong>
                      <p>{setting.enabled ? "Enabled and running" : "Currently switched off"}</p>
                    </div>
                    <button
                      type="button"
                      className={setting.enabled ? "filter-btn active" : "filter-btn"}
                      onClick={() =>
                        setSettingsState((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, enabled: !item.enabled } : item
                          )
                        )
                      }
                    >
                      {setting.enabled ? "Active" : "Paused"}
                    </button>
                  </div>
                ))}
                <div className="setting-row clean">
                  <div>
                    <strong>Admin alerts</strong>
                    <p>Set notification behavior for dashboard and inbox activity.</p>
                  </div>
                  <button type="button" className="filter-btn">
                    <BellRing size={14} />
                    Configure
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
