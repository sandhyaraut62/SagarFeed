const steps = [
  {
    title: "Check Eligibility",
    text: "Most livestock and poultry subsidy programs require proof of farm registration and a minimum herd/flock size. Our team can help confirm what applies to you.",
  },
  {
    title: "Gather Documentation",
    text: "Typical requirements include citizenship documents, farm registration certificate, and recent veterinary records.",
  },
  {
    title: "Submit Application",
    text: "Applications are usually submitted through your local Agriculture Knowledge Center (Krishi Gyan Kendra) or municipality livestock office.",
  },
  {
    title: "Follow Up",
    text: "Keep a copy of your submission receipt and follow up periodically — our support team can help you track the status.",
  },
];

function FarmerSubsidyGuide() {
  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Agricultural Subsidies Support</h2>
        </div>
        <p>
          We assist farmers in understanding and accessing available government subsidies and
          agricultural support programs, including guidance on application processes, eligibility
          criteria, and documentation requirements.
        </p>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>How to Apply</h2>
        </div>
        <div className="dash-steps">
          {steps.map((step, i) => (
            <article key={step.title} className="dash-step-card">
              <span className="dash-step-number">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Need help with your application?</h2>
        </div>
        <p>
          Contact our farmer support team at <strong>025-582841</strong> or{" "}
          <strong>9852025560 / 9852048218</strong> and we'll guide you through the process.
        </p>
      </section>
    </div>
  );
}

export default FarmerSubsidyGuide;
