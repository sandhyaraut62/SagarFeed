const services = [
  {
    title: "Field Visits",
    text: "Our veterinary team conducts scheduled farm visits to monitor livestock health and catch issues early.",
  },
  {
    title: "Disease Prevention",
    text: "Guidance on vaccination schedules, biosecurity, and hygiene practices to keep your animals healthy.",
  },
  {
    title: "Emergency Consultation",
    text: "Reach out to our support team for urgent livestock health concerns and get guidance on next steps.",
  },
];

const contact = {
  phone: "025-582841",
  mobile: "9852025560, 9852048218",
  address: "Itahari, 56705, Koshi — Jobdi Marga Pakali",
};

function FarmerVetSupport() {
  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Veterinary Support Services</h2>
        </div>
        <div className="dash-info-grid">
          {services.map((service) => (
            <article key={service.title} className="dash-info-card">
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Need to speak with a vet?</h2>
        </div>
        <p>
          Call our technical team directly for guidance on animal health, feeding schedules, or
          disease symptoms.
        </p>
        <div className="dash-contact-box">
          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>Mobile:</strong> {contact.mobile}</p>
          <p><strong>Office:</strong> {contact.address}</p>
        </div>
      </section>
    </div>
  );
}

export default FarmerVetSupport;
