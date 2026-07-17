import PageHero from "../components/PageHero.jsx";
import fourCollabIcon from "../assets/Collaboration-Page/4+collaboration.png";
import researchCollabIcon from "../assets/Collaboration-Page/research-collaboration.png";
import qualityCollabIcon from "../assets/Collaboration-Page/quality-collaboration.png";
import govtCollabIcon from "../assets/Collaboration-Page/govt-collaboration.png";

const partnershipStats = [
  ["4+", "Key Partnerships", fourCollabIcon],
  ["Research", "Innovation Focus", researchCollabIcon],
  ["Quality", "Commitment", qualityCollabIcon],
  ["Govt.", "Support", govtCollabIcon],
];

const impact = [
  ["Innovation", "Cutting-edge research for better feed solutions"],
  ["Sustainability", "Eco-friendly practices for long-term growth"],
  ["Excellence", "Industry-leading standards and quality"],
];

function CollaborationPage() {
  return (
    <div className="collab-page">
      <PageHero
        title="Institutional Collaborations"
        subtitle="Partnering with leading institutions to drive innovation and sustainability in agriculture"
      />

      <section className="page-wrap split section-pad">
        <div>
          <h2>Research-Driven Development</h2>
          <p>
            Sagar Feed actively collaborates with leading government and research institutions to ensure
            innovation and sustainability in the livestock and poultry sector.
          </p>
          <p>
            Through these strategic partnerships, we promote research-driven development and industry
            advancement, contributing to Nepal's agricultural excellence.
          </p>
        </div>
        <div className="mini-grid">
          {partnershipStats.map(([value, label, icon]) => (
            <article className="hover-card" key={label}>
              <img className="soft-icon" src={icon} alt="" aria-hidden="true" />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-band">
        <div className="page-wrap">
          <h2>Collaborative Impact</h2>
          <p>
            Our institutional partnerships enable us to stay at the forefront of agricultural innovation,
            ensuring that our products and services meet the highest standards of quality and effectiveness.
          </p>
          <div className="benefit-grid">
            {impact.map(([title, text]) => (
              <article className="hover-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap section-pad centered compact-section">
        <h2>Committed to Advancement</h2>
        <p>
          Through our collaborative efforts with research institutions and government bodies, we continue
          to promote research-driven development and industry advancement.
        </p>
        <p>
          These partnerships reflect our commitment to contributing meaningfully to Nepal's agricultural
          sector and supporting the nation's food security goals.
        </p>
      </section>
    </div>
  );
}

export default CollaborationPage;
