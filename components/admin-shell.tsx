"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Database,
  Download,
  Inbox,
  LogOut,
  MessageSquareText,
  RefreshCw,
  RotateCcw,
  Settings,
  SlidersHorizontal,
  Users
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { adminAnalyticsCards, adminAnalyticsCharts, adminMessages, adminSettings, dashboardUsers } from "@/lib/mock-data";
import { DashboardEvent, getPendingEvents, reviewEvent } from "@/lib/event-store";

const adminTabs = [
  { id: "analytics", label: "Analytics", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquareText },
  { id: "reporting", label: "Reporting", icon: RefreshCw },
  { id: "database", label: "Database", icon: Database },
  { id: "settings", label: "Settings", icon: Settings }
] as const;

const reportingTargets = ["market-insights", "news", "events", "podcasts", "resources", "partners"] as const;
type AdminTab = (typeof adminTabs)[number]["id"];
type MessageItem = (typeof adminMessages)[number];

function MiniBarChart({
  title,
  data
}: {
  title: string;
  data: readonly { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

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

function formatLastUpdated(value?: string | null) {
  if (!value) {
    return "Not updated yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function AdminShell() {
  const router = useRouter();
  const { user, ready, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [eventSubmissions, setEventSubmissions] = useState<DashboardEvent[]>([]);
  const [messageView, setMessageView] = useState<"inbox" | "archived">("inbox");
  const [inboxMessages, setInboxMessages] = useState<MessageItem[]>([...adminMessages]);
  const [archivedMessages, setArchivedMessages] = useState<MessageItem[]>([]);
  const [analyticsView, setAnalyticsView] = useState<"pages" | "ages">("pages");
  const [analyticsRange, setAnalyticsRange] = useState("7d");
  const [dateFrom, setDateFrom] = useState("2026-04-15");
  const [dateTo, setDateTo] = useState("2026-04-22");
  const [settingsState, setSettingsState] = useState(
    adminSettings.map((setting) => ({
      ...setting,
      enabled: setting.value === "Active" || setting.value === "Enabled"
    }))
  );
  const [preferenceState, setPreferenceState] = useState({
    defaultRole: "Member approval required",
    newsCadence: "Daily curated update",
    reportingEmail: "admin@balibusinessclub.com"
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [reportingState, setReportingState] = useState<Record<string, { status: "idle" | "loading" | "success"; message: string; updatedAt: string | null }>>(
    Object.fromEntries(
      reportingTargets.map((target) => [target, { status: "idle", message: "", updatedAt: null }])
    )
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

  useEffect(() => {
    setEventSubmissions(getPendingEvents());
  }, []);

  const groupedInbox = useMemo(
    () =>
      inboxMessages.reduce<Record<string, MessageItem[]>>((groups, message) => {
        if (!groups[message.type]) {
          groups[message.type] = [];
        }
        groups[message.type].push(message);
        return groups;
      }, {}),
    [inboxMessages]
  );

  const groupedArchived = useMemo(
    () =>
      archivedMessages.reduce<Record<string, MessageItem[]>>((groups, message) => {
        if (!groups[message.type]) {
          groups[message.type] = [];
        }
        groups[message.type].push(message);
        return groups;
      }, {}),
    [archivedMessages]
  );

  const activeAnalyticsData = analyticsView === "pages" ? adminAnalyticsCharts.pageVisits : adminAnalyticsCharts.ageRanges;
  const activeAnalyticsTitle = analyticsView === "pages" ? "Most visited pages" : "Member age ranges";

  async function refreshSection(section: string) {
    setReportingState((current) => ({
      ...current,
      [section]: {
        ...current[section],
        status: "loading",
        message: `Refreshing ${section.replace("-", " ")}...`
      }
    }));

    const response = await fetch(`/api/refresh/${section}`, { method: "POST" });
    const result = (await response.json()) as { message?: string };
    const updatedAt = new Date().toISOString();

    setReportingState((current) => ({
      ...current,
      [section]: {
        status: "success",
        message: result.message ?? `${section.replace("-", " ")} refreshed successfully.`,
        updatedAt
      }
    }));
  }

  function archiveMessage(message: MessageItem) {
    setInboxMessages((current) => current.filter((item) => item.id !== message.id));
    setArchivedMessages((current) => [message, ...current]);
  }

  function restoreMessage(message: MessageItem) {
    setArchivedMessages((current) => current.filter((item) => item.id !== message.id));
    setInboxMessages((current) => [message, ...current]);
  }

  function exportAnalytics() {
    const rows = activeAnalyticsData.map((item) => `${item.label},${item.value}`).join("\n");
    const csv = `View,${activeAnalyticsTitle}\nRange,${analyticsRange}\nFrom,${dateFrom}\nTo,${dateTo}\n\nLabel,Value\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bbc-analytics-${analyticsView}-${dateFrom}-to-${dateTo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Performance overview</h2>
                  <p className="section-note compact">Switch the view and date range to inspect how members are using the dashboard.</p>
                </div>
                <button type="button" className="table-link-button" onClick={exportAnalytics}>
                  <Download size={14} />
                  Export stats
                </button>
              </div>

              <div className="filter-bar">
                <button type="button" className={analyticsView === "pages" ? "filter-btn active" : "filter-btn"} onClick={() => setAnalyticsView("pages")}>
                  Page visits
                </button>
                <button type="button" className={analyticsView === "ages" ? "filter-btn active" : "filter-btn"} onClick={() => setAnalyticsView("ages")}>
                  Age ranges
                </button>
                {["1d", "7d", "30d"].map((range) => (
                  <button key={range} type="button" className={analyticsRange === range ? "filter-btn active" : "filter-btn"} onClick={() => setAnalyticsRange(range)}>
                    {range === "1d" ? "Today" : range === "7d" ? "Last 7 days" : "Last 30 days"}
                  </button>
                ))}
              </div>

              <div className="analytics-date-row">
                <label>
                  From
                  <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                </label>
                <label>
                  To
                  <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                </label>
              </div>
            </article>

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
              <MiniBarChart title={activeAnalyticsTitle} data={activeAnalyticsData} />
              <article className="section-card clean">
                <div className="section-heading">
                  <div>
                    <h2>Clean readout</h2>
                  </div>
                </div>
                <div className="admin-chart-list">
                  {activeAnalyticsData.map((item) => (
                    <div key={item.label} className="admin-chart-row">
                      <div className="admin-chart-copy">
                        <strong>{item.label}</strong>
                        <span>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        ) : null}

        {activeTab === "messages" ? (
          <section className="panel-stack">
            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Event submissions</h2>
                  <p className="section-note compact">Approve or refuse community-submitted events before they appear on the member dashboard.</p>
                </div>
              </div>

              <div className="admin-message-list">
                {eventSubmissions.length ? (
                  eventSubmissions.map((event) => (
                    <article key={event.id} className="admin-message-card">
                      <div className="admin-message-top">
                        <strong>{event.title}</strong>
                        <small>{event.date}</small>
                      </div>
                      <p>{event.description}</p>
                      <div className="admin-message-meta">
                        <span>{event.category}</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="event-actions">
                        <button
                          type="button"
                          className="table-link-button"
                          onClick={() => {
                            reviewEvent(event.id, "approved");
                            setEventSubmissions((current) => current.filter((item) => item.id !== event.id));
                          }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="ghost-button compact"
                          onClick={() => {
                            reviewEvent(event.id, "declined");
                            setEventSubmissions((current) => current.filter((item) => item.id !== event.id));
                          }}
                        >
                          Refuse
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="empty-copy">No pending event submissions right now.</p>
                )}
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Inbox</h2>
                </div>
              </div>

              <div className="filter-bar">
                <button type="button" className={messageView === "inbox" ? "filter-btn active" : "filter-btn"} onClick={() => setMessageView("inbox")}>
                  <Inbox size={14} />
                  Active messages
                </button>
                <button type="button" className={messageView === "archived" ? "filter-btn active" : "filter-btn"} onClick={() => setMessageView("archived")}>
                  <Archive size={14} />
                  Archived
                </button>
              </div>

              {Object.entries(messageView === "inbox" ? groupedInbox : groupedArchived).map(([group, items]) => (
                <div key={group} className="favorites-group">
                  <h3>{group}</h3>
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
                        <div className="event-actions">
                          {messageView === "inbox" ? (
                            <button type="button" className="ghost-button compact" onClick={() => archiveMessage(message)}>
                              <Archive size={14} />
                              Archive
                            </button>
                          ) : (
                            <button type="button" className="ghost-button compact" onClick={() => restoreMessage(message)}>
                              <RotateCcw size={14} />
                              Restore
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}

              {messageView === "inbox" && !inboxMessages.length ? <p className="empty-copy">No active messages right now.</p> : null}
              {messageView === "archived" && !archivedMessages.length ? <p className="empty-copy">No archived messages yet.</p> : null}
            </article>
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
                  <article key={target} className="reporting-button">
                    <div className="reporting-copy">
                      <strong>{target.replace("-", " ")}</strong>
                      <span>Last updated: {formatLastUpdated(reportingState[target].updatedAt)}</span>
                    </div>
                    <button type="button" className="table-link-button" onClick={() => refreshSection(target)}>
                      <RefreshCw size={14} />
                      Refresh
                    </button>
                    {reportingState[target].status === "success" ? (
                      <div className="status-banner success">
                        <CheckCircle2 size={14} />
                        {reportingState[target].message}
                      </div>
                    ) : null}
                    {reportingState[target].status === "loading" ? (
                      <div className="status-banner">{reportingState[target].message}</div>
                    ) : null}
                  </article>
                ))}
              </div>
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
                  <p className="section-note compact">Control refreshes, verification, notifications, and dashboard defaults from one place.</p>
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
              </div>
            </article>

            <article className="section-card clean">
              <div className="section-heading">
                <div>
                  <h2>Preferences</h2>
                </div>
              </div>

              <div className="form-grid clean">
                <label>
                  Default onboarding rule
                  <select value={preferenceState.defaultRole} onChange={(event) => setPreferenceState((current) => ({ ...current, defaultRole: event.target.value }))}>
                    <option>Member approval required</option>
                    <option>Automatic member access</option>
                    <option>Manual admin review</option>
                  </select>
                </label>
                <label>
                  News update cadence
                  <select value={preferenceState.newsCadence} onChange={(event) => setPreferenceState((current) => ({ ...current, newsCadence: event.target.value }))}>
                    <option>Daily curated update</option>
                    <option>Twice daily</option>
                    <option>Manual only</option>
                  </select>
                </label>
                <label>
                  Reporting email
                  <input value={preferenceState.reportingEmail} onChange={(event) => setPreferenceState((current) => ({ ...current, reportingEmail: event.target.value }))} />
                </label>
                <button
                  type="button"
                  className="table-link-button"
                  onClick={() => {
                    setSettingsSaved(true);
                    window.setTimeout(() => setSettingsSaved(false), 2500);
                  }}
                >
                  <SlidersHorizontal size={14} />
                  Save settings
                </button>
                {settingsSaved ? <div className="status-banner success">Settings updated successfully.</div> : null}
                <div className="setting-row clean">
                  <div>
                    <strong>Admin alerts</strong>
                    <p>Set notification behavior for dashboard activity and new submissions.</p>
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
