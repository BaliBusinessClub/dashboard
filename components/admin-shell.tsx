"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BellRing,
  CalendarDays,
  CheckCircle2,
  CheckCheck,
  Copy,
  Database,
  Download,
  Inbox,
  LogOut,
  MessageSquareText,
  RefreshCw,
  RotateCcw,
  Settings,
  SlidersHorizontal,
  X,
  Users
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { adminAnalyticsCards, adminAnalyticsCharts, adminMessages, adminSettings, dashboardUsers } from "@/lib/mock-data";
import { DashboardEvent, getPendingEvents, reviewEvent } from "@/lib/event-store";
import { getStoredMessages, InboxMessage, updateMessageStatus } from "@/lib/message-store";
import { getPendingPartners, reviewPartnerApplication, PartnerApplication } from "@/lib/partner-store";

const adminTabs = [
  { id: "analytics", label: "Analytics", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquareText },
  { id: "reporting", label: "Reporting", icon: RefreshCw },
  { id: "database", label: "Database", icon: Database },
  { id: "settings", label: "Settings", icon: Settings }
] as const;

const reportingTargets = ["market-insights", "news", "events", "podcasts", "resources", "partners"] as const;
type AdminTab = (typeof adminTabs)[number]["id"];
type MessageItem = (typeof adminMessages)[number] | InboxMessage;
type MessageSection = "Events" | "Partnerships" | "Questions" | "Suggestions";

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
  const [partnerSubmissions, setPartnerSubmissions] = useState<PartnerApplication[]>([]);
  const [messageView, setMessageView] = useState<"inbox" | "replied" | "archived">("inbox");
  const [messageSection, setMessageSection] = useState<MessageSection>("Questions");
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [allMessages, setAllMessages] = useState<MessageItem[]>([...adminMessages]);
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [analyticsSection, setAnalyticsSection] = useState<"overview" | "audience" | "behavior">("overview");
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
    reportingEmail: "admin@balibusinessclub.com",
    newsPadding: "60",
    eventsPadding: "120",
    podcastsPadding: "240"
  });
  const [memberFilter, setMemberFilter] = useState("All");
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
    setPartnerSubmissions(getPendingPartners());
    setAllMessages([...adminMessages, ...getStoredMessages()]);
  }, []);

  useEffect(() => {
    if (!adminToast) {
      return;
    }
    const timer = window.setTimeout(() => setAdminToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [adminToast]);

  const visibleMessages = useMemo(() => {
    return allMessages.filter((message) => {
      const status = "status" in message ? message.status : "inbox";
      const matchesStatus = status === messageView;
      const matchesSection =
        (messageSection === "Questions" && message.type === "Contacting us") ||
        (messageSection === "Suggestions" && message.type === "Recommendations");
      return matchesStatus && matchesSection;
    });
  }, [allMessages, messageSection, messageView]);

  const activeAnalyticsData = analyticsView === "pages" ? adminAnalyticsCharts.pageVisits : adminAnalyticsCharts.ageRanges;
  const activeAnalyticsTitle = analyticsView === "pages" ? "Most visited pages" : "Member age ranges";
  const filteredMembers = useMemo(
    () => dashboardUsers.filter((member) => memberFilter === "All" || member.membership === memberFilter),
    [memberFilter]
  );

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

  function setMessageStatus(message: MessageItem, status: "inbox" | "replied" | "archived") {
    if ("status" in message) {
      updateMessageStatus(message.id, status);
    }
    setAllMessages((current) =>
      current.map((item) => (item.id === message.id ? { ...item, status } : item))
    );
    if (selectedMessage?.id === message.id) {
      setSelectedMessage({ ...message, status });
    }
    setAdminToast(
      status === "archived"
        ? "Message archived."
        : status === "replied"
          ? "Message moved to replied."
          : "Message restored."
    );
  }

  function handleEventReview(eventId: string, status: "approved" | "declined") {
    reviewEvent(eventId, status);
    setEventSubmissions((current) => current.filter((item) => item.id !== eventId));
    setAdminToast(status === "approved" ? "Event approved." : "Event rejected.");
  }

  function handlePartnerReview(partnerId: string, status: "approved" | "declined") {
    reviewPartnerApplication(partnerId, status);
    setPartnerSubmissions((current) => current.filter((item) => item.id !== partnerId));
    setAdminToast(status === "approved" ? "Partner approved." : "Partner rejected.");
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
                <button type="button" className={analyticsSection === "overview" ? "filter-btn active" : "filter-btn"} onClick={() => setAnalyticsSection("overview")}>
                  Overview
                </button>
                <button type="button" className={analyticsSection === "audience" ? "filter-btn active" : "filter-btn"} onClick={() => setAnalyticsSection("audience")}>
                  Audience
                </button>
                <button type="button" className={analyticsSection === "behavior" ? "filter-btn active" : "filter-btn"} onClick={() => setAnalyticsSection("behavior")}>
                  Behavior
                </button>
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

            {analyticsSection === "overview" ? (
              <div className="metric-grid compact admin-metric-grid">
                {adminAnalyticsCards.map((card) => (
                  <article key={card.label} className="metric-card">
                    <div className="metric-label">{card.label}</div>
                    <div className="metric-value">{card.value}</div>
                    <p>{card.detail}</p>
                  </article>
                ))}
              </div>
            ) : null}

            <div className="two-col-grid">
              <MiniBarChart title={activeAnalyticsTitle} data={activeAnalyticsData} />
              <article className="section-card clean">
                <div className="section-heading">
                  <div>
                    <h2>{analyticsSection === "audience" ? "Audience details" : analyticsSection === "behavior" ? "Behavior details" : "Clean readout"}</h2>
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
                  <h2>Message center</h2>
                  <p className="section-note compact">Review incoming submissions, archive resolved items, and approve what should appear on the member dashboard.</p>
                </div>
              </div>

              <div className="filter-bar">
                {(["Events", "Partnerships", "Questions", "Suggestions"] as const).map((section) => (
                  <button
                    key={section}
                    type="button"
                    className={messageSection === section ? "filter-btn active" : "filter-btn"}
                    onClick={() => setMessageSection(section)}
                  >
                    {section}
                  </button>
                ))}
              </div>

              {messageSection === "Questions" || messageSection === "Suggestions" ? (
                <div className="filter-bar">
                  <button type="button" className={messageView === "inbox" ? "filter-btn active" : "filter-btn"} onClick={() => setMessageView("inbox")}>
                    <Inbox size={14} />
                    Active messages
                  </button>
                  <button type="button" className={messageView === "replied" ? "filter-btn active" : "filter-btn"} onClick={() => setMessageView("replied")}>
                    <CheckCheck size={14} />
                    Replied
                  </button>
                  <button type="button" className={messageView === "archived" ? "filter-btn active" : "filter-btn"} onClick={() => setMessageView("archived")}>
                    <Archive size={14} />
                    Archived
                  </button>
                </div>
              ) : null}

              {messageSection === "Events" ? (
                <div className="admin-message-list">
                  {eventSubmissions.length ? (
                    eventSubmissions.map((event) => (
                      <article key={event.id} className="admin-message-card submission-card">
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
                          <button type="button" className="action-approve" onClick={() => handleEventReview(event.id, "approved")}>
                            Approve
                          </button>
                          <button type="button" className="action-reject" onClick={() => handleEventReview(event.id, "declined")}>
                            Reject
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="empty-copy">No pending event submissions right now.</p>
                  )}
                </div>
              ) : null}

              {messageSection === "Partnerships" ? (
                <div className="admin-message-list">
                  {partnerSubmissions.length ? (
                    partnerSubmissions.map((partner) => (
                      <article key={partner.id} className="admin-message-card submission-card">
                        <div className="admin-message-top">
                          <strong>{partner.name}</strong>
                          <small>{partner.source}</small>
                        </div>
                        <p>{partner.offer}</p>
                        <div className="admin-message-meta">
                          <span>{partner.url}</span>
                          <span>{partner.whatsapp}</span>
                        </div>
                        <div className="event-actions">
                          <button type="button" className="action-approve" onClick={() => handlePartnerReview(partner.id, "approved")}>
                            Approve
                          </button>
                          <button type="button" className="action-reject" onClick={() => handlePartnerReview(partner.id, "declined")}>
                            Reject
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="empty-copy">No pending partner applications right now.</p>
                  )}
                </div>
              ) : null}

              {messageSection === "Questions" || messageSection === "Suggestions" ? (
                <div className="admin-message-list">
                  {visibleMessages.map((message) => (
                    <article
                      key={message.id}
                      className="admin-message-card clickable"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="admin-message-top">
                        <strong>{message.subject}</strong>
                        <small>{message.date}</small>
                      </div>
                      <p>{message.message}</p>
                      <div className="admin-message-meta">
                        <span>{message.name}</span>
                        <span>{message.email}</span>
                        {"whatsapp" in message && message.whatsapp ? <span>{message.whatsapp}</span> : null}
                      </div>
                      <div className="event-actions">
                        <button
                          type="button"
                          className="ghost-button compact"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigator.clipboard.writeText(("whatsapp" in message && message.whatsapp) ? message.whatsapp : message.email);
                            setAdminToast("Contact copied.");
                          }}
                        >
                          <Copy size={14} />
                          Copy contact
                        </button>
                        {messageView === "inbox" ? (
                          <>
                            <button
                              type="button"
                              className="ghost-button compact"
                              onClick={(event) => {
                                event.stopPropagation();
                                setMessageStatus(message, "replied");
                              }}
                            >
                              <CheckCheck size={14} />
                              Mark replied
                            </button>
                            <button
                              type="button"
                              className="ghost-button compact"
                              onClick={(event) => {
                                event.stopPropagation();
                                setMessageStatus(message, "archived");
                              }}
                            >
                              <Archive size={14} />
                              Archive
                            </button>
                          </>
                        ) : messageView === "archived" ? (
                          <button
                            type="button"
                            className="ghost-button compact"
                            onClick={(event) => {
                              event.stopPropagation();
                              setMessageStatus(message, "inbox");
                            }}
                          >
                            <RotateCcw size={14} />
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="ghost-button compact"
                            onClick={(event) => {
                              event.stopPropagation();
                              setMessageStatus(message, "archived");
                            }}
                          >
                            <Archive size={14} />
                            Archive
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                  {!visibleMessages.length ? <p className="empty-copy">No messages in this section right now.</p> : null}
                </div>
              ) : null}
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
                  <article key={target} className="reporting-button reporting-row">
                    <div className="reporting-copy">
                      <strong>{target.replace(/(^|-)(\w)/g, (_, __, char) => ` ${char.toUpperCase()}`).trim()}</strong>
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

              <div className="filter-bar">
                {["All", ...Array.from(new Set(dashboardUsers.map((member) => member.membership)))].map((type) => (
                  <button key={type} type="button" className={memberFilter === type ? "filter-btn active" : "filter-btn"} onClick={() => setMemberFilter(type)}>
                    {type}
                  </button>
                ))}
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
                    {filteredMembers.map((member) => (
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
                <div className="two-col-grid">
                  <label>
                    News update padding (minutes)
                    <input value={preferenceState.newsPadding} onChange={(event) => setPreferenceState((current) => ({ ...current, newsPadding: event.target.value }))} />
                  </label>
                  <label>
                    Events update padding (minutes)
                    <input value={preferenceState.eventsPadding} onChange={(event) => setPreferenceState((current) => ({ ...current, eventsPadding: event.target.value }))} />
                  </label>
                </div>
                <label>
                  Podcast update padding (minutes)
                  <input value={preferenceState.podcastsPadding} onChange={(event) => setPreferenceState((current) => ({ ...current, podcastsPadding: event.target.value }))} />
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

      {selectedMessage ? (
        <div className="modal-overlay open">
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <h2>{selectedMessage.subject}</h2>
                <p className="section-note compact">{selectedMessage.name}</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setSelectedMessage(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="form-grid clean">
              <div className="admin-chart-copy"><strong>Email</strong><span>{selectedMessage.email}</span></div>
              {"whatsapp" in selectedMessage && selectedMessage.whatsapp ? (
                <div className="admin-chart-copy"><strong>WhatsApp</strong><span>{selectedMessage.whatsapp}</span></div>
              ) : null}
              <p>{selectedMessage.message}</p>
              <div className="event-actions">
                <button
                  type="button"
                  className="ghost-button compact"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMessage.email);
                    setAdminToast("Email copied.");
                  }}
                >
                  <Copy size={14} />
                  Copy email
                </button>
                {"whatsapp" in selectedMessage && selectedMessage.whatsapp ? (
                  <button
                    type="button"
                    className="ghost-button compact"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMessage.whatsapp ?? "");
                      setAdminToast("WhatsApp copied.");
                    }}
                  >
                    <Copy size={14} />
                    Copy WhatsApp
                  </button>
                ) : null}
                <button
                  type="button"
                  className="table-link-button"
                  onClick={() => {
                    setMessageStatus(selectedMessage, "replied");
                    setSelectedMessage(null);
                  }}
                >
                  <CheckCheck size={14} />
                  Mark replied
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {adminToast ? (
        <div className="modal-overlay open toast-overlay">
          <div className="toast-card">
            <div className="toast-check">OK</div>
            <strong>Updated</strong>
            <p>{adminToast}</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
