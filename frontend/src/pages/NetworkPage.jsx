import PageHero from "../components/PageHero.jsx";
import StatCard from "../components/StatCard.jsx";
import { locations, assets } from "../content.js";

function NetworkPage() {
  return (
    <>
      <PageHero
        title="Distribution Network"
        subtitle="One of the most extensive distribution networks in Nepal, ensuring accessibility across all regions"
      />

      <section className="page-wrap section-pad centered">
        <h2>Our Reach</h2>
        <p>Sagar Feed has developed an extensive distribution network across Nepal.</p>
        <div className="achievement-grid reach-grid">
          <StatCard value="320+" label="Dealers" icon={assets.dealerAbout} />
          <StatCard value="1500+" label="Sub-dealers" icon={assets.dealerAbout} />
          <StatCard value="2200+" label="Farmer Networks" icon={assets.dealerAbout} />
        </div>
      </section>

      <section className="page-wrap section-pad centered">
        <h2>Service Locations</h2>
        <p>Regional depot system ensuring easy and reliable access to our products.</p>
        <div className="location-grid">
          {locations.map((location) => (
            <article className="hover-card" key={location}>
              <img className="location-icon" src={assets.locationIcon} alt="" aria-hidden="true" />
              {location}
            </article>
          ))}
        </div>
      </section>

      <section className="info-band network-band">
        <div className="page-wrap">
          <h2>Region-wise Depot System</h2>
          <div className="network-copy">
            <p>Our strategic depot locations ensure that farmers, whether in urban centers or remote villages, have easy and reliable access to our products.</p>
            <article>
              <h3>Key Highlights</h3>
              <ul>
                <li>10+ Transportation Services</li>
                <li>12+ Transport Vehicles</li>
                <li>100 Tons Daily Production Capacity</li>
                <li>Timely Delivery Guarantee</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="page-wrap section-pad centered">
        <h2>Reliable Supply Chain</h2>
        <p>Our logistics and transportation network ensures timely delivery and consistent product availability for farmers and dealers.</p>
      </section>
    </>
  );
}

export default NetworkPage;
