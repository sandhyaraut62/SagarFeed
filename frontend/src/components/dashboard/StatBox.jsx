export function StatBox({ label, value, hint }) {
  return (
    <div className="stat-box">
      <span className="stat-box-label">{label}</span>
      <strong className="stat-box-value">{value}</strong>
      {hint && <span className="stat-box-hint">{hint}</span>}
    </div>
  );
}

export function StockBadge({ level }) {
  return <span className={`badge badge-stock-${level.toLowerCase()}`}>{level}</span>;
}

const ORDER_STATUS_LABELS = {
  placed: "Placed",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }) {
  return (
    <span className={`badge badge-order-${status}`}>{ORDER_STATUS_LABELS[status] || status}</span>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
