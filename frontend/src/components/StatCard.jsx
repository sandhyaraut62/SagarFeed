import lineIcon from "../assets/100-ton-home.png";

function StatCard({ value, label, icon }) {
  return (
    <article className="stat-card hover-card">
      <img className="line-icon" src={icon || lineIcon} alt="" aria-hidden="true" />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export default StatCard;
