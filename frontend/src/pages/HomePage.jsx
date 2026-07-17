import { Link } from "react-router-dom";
import StatCard from "../components/StatCard.jsx";
import { assets, stats, whyChoose } from "../content.js";

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-image" aria-hidden="true">
          <img src={assets.heroPoultry} alt="" />
        </div>
        <div className="hero-content page-wrap">
          <h1>Sagar Feed Pvt. Ltd.</h1>
          <h2>Nourishing Livestock. Empowering Farmers. Building Nepal.</h2>
          <p>
            Established in 2065 B.S., we are a leading Nepal-based animal nutrition company
            dedicated to delivering high-quality feed solutions for the livestock and poultry industry.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/products">View Products →</Link>
            <Link className="button button-secondary" to="/contact">Contact Us →</Link>
          </div>
        </div>
      </section>

      <section className="page-wrap stats-row section-pad">
        {stats.map(([value, label, icon]) => <StatCard key={label} value={value} label={label} icon={icon} />)}
      </section>

      <section className="page-wrap split section-pad">
        <div>
          <h2>About Sagar Feed</h2>
          <p>
            With years of experience and deep industry insight, Sagar Feed has grown into a trusted
            name across Nepal. Our commitment to quality, consistency, and innovation has enabled us
            to build long-term relationships with farmers, dealers, and stakeholders throughout the country.
          </p>
          <p>
            We believe that strong agriculture is the backbone of a strong nation and we are proud
            to contribute to Nepal's agricultural growth and rural development.
          </p>
          <Link className="text-link" to="/about">Learn More About Us →</Link>
        </div>
        <img className="image-grid" src={assets.aboutCollage} alt="Livestock and poultry collage" />
      </section>

      <section className="page-wrap section-pad centered">
        <h2>Why Choose Sagar Feed</h2>
        <p>We combine quality production, technical expertise, and a deep understanding of Nepal's agricultural landscape.</p>
        <div className="feature-grid">
          {whyChoose.map(([title, text, icon]) => (
            <article className="feature-card hover-card" key={title}>
              <img className="line-icon" src={icon || assets.lineIcon} alt="" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="page-wrap">
          <h2>Ready to Grow Your Livestock Business?</h2>
          <p>Join thousands of farmers who trust Sagar Feed for quality nutrition solutions.</p>
          <div className="hero-actions centered-actions">
            <Link className="button button-primary" to="/products">Explore Our Products →</Link>
            <Link className="button button-secondary" to="/contact">Get in Touch →</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
