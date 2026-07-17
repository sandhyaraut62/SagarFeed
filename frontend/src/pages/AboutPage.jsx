import PageHero from "../components/PageHero.jsx";
import StatCard from "../components/StatCard.jsx";
import { achievements, assets } from "../content.js";
import missionAbout from "../assets/About-Us/Mission-About.png";
import visionAbout from "../assets/About-Us/Vision-About.png";

function AboutPage() {
  return (
    <>
      <PageHero
        title="About Sagar Feed"
        subtitle="A leading Nepal-based animal nutrition company dedicated to delivering high-quality feed solutions for the livestock and poultry industry."
      />

      <section className="page-wrap split section-pad">
        <div>
          <h2>Our Story</h2>
          <p>
            Established in 2065 B.S., Sagar Feed Pvt. Ltd. has consistently focused on improving
            farm productivity through scientifically balanced nutrition, advanced production systems,
            and farmer-centric support services.
          </p>
          <p>
            With years of experience and deep industry insight, Sagar Feed has grown into a trusted name
            across Nepal through quality, consistency, and innovation.
          </p>
        </div>
        <img className="rounded-image hover-image" src={assets.farmStory} alt="Farmer working with livestock" />
      </section>

      <section className="page-wrap mission-grid section-pad">
        <article className="hover-card">
          <img className="mission-icon" src={missionAbout} alt="Our Mission icon" aria-hidden="true" />
          <h3>Our Mission</h3>
          <p>To deliver high-quality, scientifically formulated animal nutrition solutions that enhance livestock productivity and improve farmer livelihoods.</p>
        </article>
        <article className="hover-card">
          <img className="mission-icon" src={visionAbout} alt="Our Vision icon" aria-hidden="true" />
          <h3>Our Vision</h3>
          <p>To become one of Nepal's leading and most trusted animal feed companies, recognized for quality, reliability, and meaningful contribution.</p>
        </article>
      </section>

      <section className="page-wrap section-pad">
        <div className="founder-message-card">
          <h3>Founder Message</h3>
          <p>
            “At Sagar Feed, our foundation is built on the unwavering belief that the prosperity of our nation is directly linked to the success of our farmers. Since 2065 B.S., we have dedicated ourselves to not just manufacturing feed, but delivering complete nutritional solutions that guarantee health, yield, and profitability. Our journey is fueled by innovation, driven by quality, and dedicated to the hardworking agricultural community of Nepal.”
          </p>
          <strong>Gyanendra Parajuli</strong>
        </div>
      </section>

      <section className="page-wrap section-pad centered">
        <h2>Our Achievements</h2>
        <p>Building a strong foundation for Nepal's agricultural future</p>
        <div className="achievement-grid">
          {achievements.map(([value, label, icon]) => <StatCard key={label} value={value} label={label} icon={icon} />)}
        </div>
      </section>

      <section className="info-band">
        <div className="page-wrap">
          <h2>Advanced Production Infrastructure</h2>
          <p>Our robust manufacturing and logistics system ensures consistent quality and timely delivery across all regions.</p>
          <div className="band-stats">
            <span><strong>100 Tons</strong> Daily Production Capacity</span>
            <span><strong>10 +</strong> Transportation Services</span>
            <span><strong>12 +</strong> Transport Vehicles</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
