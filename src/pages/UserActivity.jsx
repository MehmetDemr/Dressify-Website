import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import "../styles/UserActivity.css";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";

const TYPE_META = {
  shopping: {
    label: "Shopping",
    badgeCls: "ua-badge ua-badge--shopping",
    iconColor: "#C9A96E",
    iconBg: "rgba(201,169,110,0.12)",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A96E"
        strokeWidth="1.5"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  addingFavourite: {
    label: "Favourited",
    badgeCls: "ua-badge ua-badge--fav",
    iconColor: "#D97070",
    iconBg: "rgba(201,90,90,0.1)",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D97070"
        strokeWidth="1.5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  click: {
    label: "Click",
    badgeCls: "ua-badge ua-badge--click",
    iconColor: "#5C9FE8",
    iconBg: "rgba(52,130,246,0.1)",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5C9FE8"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "shopping", label: "Shopping" },
  { key: "click", label: "Clicks" },
  { key: "addingFavourite", label: "Favourites" },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MetricCard({ label, value, sub, badge, badgeType }) {
  return (
    <div className="ua-metric-card">
      <div className="ua-metric-label">{label}</div>
      <div className="ua-metric-value">{value}</div>
      <div className="ua-metric-sub">{sub}</div>
      {badge && (
        <div
          className={`ua-metric-badge ${badgeType === "up" ? "ua-metric-badge--up" : "ua-metric-badge--down"}`}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

function BarRow({ label, count, max, variant }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="ua-bar-row">
      <div className="ua-bar-label">{label}</div>
      <div className="ua-bar-track">
        <div
          className={`ua-bar-fill ${variant ? `ua-bar-fill--${variant}` : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="ua-bar-count">{count}</div>
    </div>
  );
}

function ActivityRow({ activity }) {
  const meta = TYPE_META[activity.activityType] || TYPE_META.click;
  return (
    <div className="ua-activity-row">
      <div className="ua-act-icon" style={{ background: meta.iconBg }}>
        {meta.icon}
      </div>
      <div className="ua-act-info">
        <div className="ua-act-name">{activity.product_id || "Product"}</div>
        <div className="ua-act-meta">
          {activity.brand_id} · {activity.category_id}
        </div>
      </div>
      <span className={meta.badgeCls}>{meta.label}</span>
      <span className="ua-act-time">{formatDate(activity.createdAt)}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="ua-empty">
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(201,169,110,0.4)"
        strokeWidth="1.2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <p>No activity found for this filter.</p>
    </div>
  );
}

function UserActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchActivities() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/user/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setActivities(Array.isArray(json.data) ? json.data : [json.data]);
        }
      } catch (err) {
        console.error("Failed to fetch activity data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const filtered =
    filter === "all"
      ? activities
      : activities.filter((a) => a.activityType === filter);

  const counts = {
    total: activities.length,
    shopping: activities.filter((a) => a.activityType === "shopping").length,
    addingFavourite: activities.filter(
      (a) => a.activityType === "addingFavourite",
    ).length,
    click: activities.filter((a) => a.activityType === "click").length,
  };

  // Brand bar chart data
  const brandCounts = activities.reduce((acc, a) => {
    acc[a.brand_id] = (acc[a.brand_id] || 0) + 1;
    return acc;
  }, {});
  const brandSorted = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const brandMax = brandSorted[0]?.[1] || 1;

  // Category bar chart data
  const catCounts = activities.reduce((acc, a) => {
    acc[a.category_id] = (acc[a.category_id] || 0) + 1;
    return acc;
  }, {});
  const catSorted = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const catMax = catSorted[0]?.[1] || 1;

  return (
    <>
      <DashboardHeader />

      <main className="ua-page">
        <div className="ua-content">
          {/* Page title */}
          <p className="ua-page-label">My Account</p>
          <h1 className="ua-page-heading">Activity History</h1>

          {/* Metric cards */}
          <div className="ua-metrics">
            <MetricCard
              label="Total Activity"
              value={counts.total}
              sub="All time"
              badge="+12%"
              badgeType="up"
            />
            <MetricCard
              label="Shopping"
              value={counts.shopping}
              sub="Products purchased"
              badge="+8%"
              badgeType="up"
            />
            <MetricCard
              label="Favourited"
              value={counts.addingFavourite}
              sub="Added to list"
              badge="+24%"
              badgeType="up"
            />
            <MetricCard
              label="Clicks"
              value={counts.click}
              sub="Product views"
              badge="-3%"
              badgeType="down"
            />
          </div>

          {/* Brand & Category bars */}
          <div className="ua-grid-equal">
            <div className="ua-card">
              <div className="ua-card-title">Most Engaged — Brand</div>
              {brandSorted.length === 0 ? (
                <p className="ua-empty-inline">No data yet</p>
              ) : (
                brandSorted.map(([name, count], i) => (
                  <BarRow
                    key={name}
                    label={name}
                    count={count}
                    max={brandMax}
                    variant={i === 1 ? "blue" : i === 2 ? "red" : ""}
                  />
                ))
              )}
            </div>
            <div className="ua-card">
              <div className="ua-card-title">Most Browsed Categories</div>
              {catSorted.length === 0 ? (
                <p className="ua-empty-inline">No data yet</p>
              ) : (
                catSorted.map(([name, count]) => (
                  <BarRow key={name} label={name} count={count} max={catMax} />
                ))
              )}
            </div>
          </div>

          {/* Activity list */}
          <div className="ua-card">
            {/* Filters */}
            <div className="ua-filters">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`ua-filter-btn ${filter === f.key ? "ua-filter-btn--active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="ua-card-title">Recent Activity</div>

            {loading ? (
              <div className="ua-loading">
                <div className="ua-spinner" />
                <span>Loading...</span>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="ua-activity-list">
                {filtered.map((a) => (
                  <ActivityRow key={a.id} activity={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </>
  );
}

export default UserActivityPage;
