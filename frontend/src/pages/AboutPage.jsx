import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import StatCard from "../components/StatCard.jsx";
import { achievements, assets } from "../content.js";
import missionAbout from "../assets/About-Us/Mission-About.png";
import visionAbout from "../assets/About-Us/Vision-About.png";

function AboutPage() {
  const founders = [
    {
      name: "Mr. Gyanendra Parajuli",
      role: "Director | Sagar Feeds",
      title: "Message from Mr. Gyanendra Parajuli",
      message: [
        "Welcome to Sagar Feeds.",
        "At Sagar Feeds, we are dedicated to empowering farmers and livestock entrepreneurs with feed solutions that combine scientific precision, superior quality, and practical effectiveness. We understand that modern livestock farming is more than feeding animals — it is about trust, consistent performance, and enabling farmers to achieve sustainable growth.",
        "With years of experience in animal nutrition, our approach blends research-based expertise with a deep understanding of farmers’ needs. Every product is designed to meet specific nutritional requirements, enhance animal health, improve growth, and boost overall farm productivity. Each bag of feed we deliver represents our commitment to supporting livelihoods, strengthening agricultural businesses, and contributing to the development of Nepal’s livestock sector.",
        "Quality drives everything we do. From sourcing premium ingredients to rigorous quality control, precise formulation, and timely delivery, we ensure that our products meet the highest standards. Beyond providing feed, we aim to offer guidance, training, and solutions that help farmers optimize performance, reduce costs, and achieve long-term success.",
        "We take pride in being part of Nepal’s agricultural progress. The trust of our farmers, distributors, and partners motivates us to innovate continuously, maintain excellence, and drive sustainable livestock development. Together, we are building a healthier, stronger, and more prosperous agricultural future — one farm, one animal, and one solution at a time."
      ]
    },
    {
      name: "Mr. Laxman Humagain",
      role: "Director | Sagar Feeds",
      title: "Message from Mr. Laxman Humagain",
      message: [
        "Greetings from Sagar Feeds.",
        "Our vision is to be a trusted and innovative partner for livestock farming across Nepal. We recognize that farmers today need more than feed — they need solutions that deliver measurable results, support animal well-being, and enhance farm efficiency. At Sagar Feeds, every product is designed to meet these needs while fostering long-term agricultural growth.",
        "Guided by innovation, quality, and service excellence, we craft feed solutions using research-backed methods that promote animal health, increase productivity, and maximize farm output. Our commitment goes beyond products — it extends to building strong relationships, providing practical guidance, and supporting farming communities to thrive sustainably.",
        "We are proud to contribute to the livelihoods of farmers and the broader agricultural economy. By delivering consistent quality, safe nutrition, and performance-driven solutions, we help farmers achieve higher productivity while promoting sustainable livestock development. Our efforts also focus on partnerships, knowledge sharing, and initiatives that strengthen rural economies and drive national growth.",
        "We are grateful for the trust of our farmers, distributors, and partners. Your confidence inspires us to keep innovating, improving, and delivering excellence. Together, we aim to create a vibrant, sustainable, and future-ready livestock sector that benefits every farmer, every animal, and the nation as a whole."
      ]
    }
  ];

  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (name) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

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
        <h2>Founders Messages</h2>
        <div className="founder-messages-grid">
          {founders.map((founder) => {
            const isExpanded = Boolean(expanded[founder.name]);

            return (
              <article className="founder-message-card" key={founder.name}>
                <div className="founder-text-block">
                  <h3>{founder.title}</h3>
                  <p className="founder-role">{founder.role}</p>
                  <div className="founder-preview">
                    {isExpanded ? (
                      founder.message.map((paragraph, index) => (
                        <p key={`${founder.name}-${index}`}>{paragraph}</p>
                      ))
                    ) : (
                      <>
                        <p>{founder.message[0]}</p>
                        <p>{founder.message[1]}</p>
                      </>
                    )}
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => toggleExpanded(founder.name)}
                    >
                      {isExpanded ? "Read less" : "Read more →"}
                    </button>
                  </div>
                  <strong>{founder.name}</strong>
                </div>
                <div className="founder-image-slot" aria-label={`${founder.name} photo placeholder`}>
                  <span>Founder Photo</span>
                </div>
              </article>
            );
          })}
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
