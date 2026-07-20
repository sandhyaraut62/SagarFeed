import { useFarmerSupportContent } from "../../context/FarmerSupportContentContext.jsx";

function FarmerTraining() {
  const { trainingPrograms, programBenefits } = useFarmerSupportContent();

  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Regular Training Programs</h2>
        </div>
        <div className="dash-info-grid">
          {trainingPrograms.map((program) => (
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
          {programBenefits.map(([title, text]) => (
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
