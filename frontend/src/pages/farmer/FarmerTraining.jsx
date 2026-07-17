const programs = [
  {
    title: "Every 15 Days",
    text: "Orientation programs are conducted regularly across different regions to ensure continuous learning and support.",
  },
  {
    title: "Expert-Led Sessions",
    text: "All programs are led by experienced veterinarians and technical experts with deep industry knowledge.",
  },
  {
    title: "Practical Knowledge",
    text: "Focus on modern livestock management practices that can be immediately applied on farms.",
  },
];

const benefits = [
  ["Improved Productivity", "Learn techniques to maximize livestock output and farm efficiency."],
  ["Risk Reduction", "Understand how to minimize operational and health risks in livestock farming."],
  ["Modern Practices", "Adopt scientifically proven methods for sustainable farming."],
];

function FarmerTraining() {
  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Regular Training Programs</h2>
        </div>
        <div className="dash-info-grid">
          {programs.map((program) => (
            <article key={program.title} className="dash-info-card">
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Program Benefits</h2>
        </div>
        <div className="dash-info-grid">
          {benefits.map(([title, text]) => (
            <article key={title} className="dash-info-card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FarmerTraining;
