import { useFarmerSupportContent } from "../../context/FarmerSupportContentContext.jsx";

const contact = {
  phone: "025-582841",
  mobile: "9852025560, 9852048218",
  address: "Itahari, 56705, Koshi — Jobdi Marga Pakali",
};

function FarmerVetSupport() {
  const { vetServices } = useFarmerSupportContent();

  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Veterinary Support Services</h2>
        </div>
        <div className="dash-info-grid">
          {vetServices.map((service) => (
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
