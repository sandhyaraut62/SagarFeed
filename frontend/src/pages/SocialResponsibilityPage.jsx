import PageHero from "../components/PageHero.jsx";
import beyondBusinessIcon from "../assets/Social-Responsibility/BeyondBusiness-Social.png";
import bloodDonationProgramsIcon from "../assets/Social-Responsibility/BloodDonationPrograms.png";
import lionsClubActivitiesIcon from "../assets/Social-Responsibility/LionsClubActivities.png";
import regionalDepotEstablishmentIcon from "../assets/Social-Responsibility/RegionalDepotEstablishment.png";
import communityDevelopmentIcon from "../assets/Social-Responsibility/CommunityDevelopment.png";
import bloodDonationDrivesIcon from "../assets/Social-Responsibility/BloodDonationDrives.png";
import lionsClubPartnershipIcon from "../assets/Social-Responsibility/LionsClubPartnership.png";

const commitments = [
  ["Economic Development", "Creating jobs and supporting rural economies through our network."],
  ["Social Welfare", "Active participation in health and community development programs."],
  ["Sustainable Impact", "Long-term commitment to Nepal's agricultural and social development."],
];

const initiatives = [
  ["Blood Donation Programs", "Regularly organizing blood donation camps to support community health and save lives across Nepal.", "Multiple camps organized annually", bloodDonationProgramsIcon],
  ["Lions Club Activities", "Active participation in Lions Club initiatives focused on community development and social welfare.", "Ongoing partnership", lionsClubActivitiesIcon],
  ["Regional Depot Establishment", "Setting up regional depots to improve accessibility and support rural economic development.", "8+ strategic locations", regionalDepotEstablishmentIcon],
  ["Community Development", "Supporting local communities through various development programs and initiatives.", "Year-round engagement", communityDevelopmentIcon],
];

function SocialResponsibilityPage() {
  return (
    <>
      <PageHero
        title="Social Responsibility"
        subtitle="Making a positive impact beyond business, committed to community well-being and social development"
      />

      <section className="page-wrap section-pad centered compact-section">
        <div className="social-title-stack social-title-center">
          <img className="social-title-icon" src={beyondBusinessIcon} alt="" aria-hidden="true" />
          <h2>Beyond Business</h2>
        </div>
        <p>
          We are committed to giving back to the community and supporting social well-being.
          Our efforts go beyond business as we strive to make a positive social impact throughout Nepal.
        </p>
      </section>

      <section className="page-wrap section-pad">
        <div className="social-initiative-grid">
          {initiatives.map(([title, text, badge, icon]) => (
            <article className="hover-card initiative-card" key={title}>
              <div className="social-title-row">
                <img className="social-title-icon" src={icon} alt="" aria-hidden="true" />
                <h3>{title}</h3>
              </div>
              <p>{text}</p>
              <span className="initiative-tag">{badge}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="page-wrap section-pad social-impact-section">
        <div className="impact-grid">
          <article className="hover-card impact-card">
            <div className="social-title-row">
              <img className="social-title-icon" src={bloodDonationDrivesIcon} alt="" aria-hidden="true" />
              <h3>Blood Donation Drives</h3>
            </div>
            <p>We organize regular blood donation programs as part of our commitment to community health and emergency preparedness. These initiatives help ensure blood availability for hospitals and medical facilities across the region.</p>
          </article>
          <article className="hover-card impact-card impact-highlight">
            <h3>Program Impact</h3>
            <ul>
              <li>Regular blood donation camps organized</li>
              <li>Supporting local hospitals and health centers</li>
              <li>Active employee and community participation</li>
              <li>Contributing to emergency blood supply</li>
            </ul>
          </article>
          <article className="hover-card impact-card">
            <div className="social-title-row">
              <img className="social-title-icon" src={lionsClubPartnershipIcon} alt="" aria-hidden="true" />
              <h3>Lions Club Partnership</h3>
            </div>
            <p>Our active participation in Lions Club initiatives reflects our commitment to organized community service and social development. Through this partnership, we contribute to various humanitarian projects and community welfare programs.</p>
          </article>
          <article className="hover-card impact-card impact-highlight">
            <h3>Focus Areas</h3>
            <ul>
              <li>Community health and wellness programs</li>
              <li>Education and youth development</li>
              <li>Disaster relief and emergency support</li>
              <li>Environmental conservation initiatives</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="dark-band">
        <div className="page-wrap">
          <h2>Our Commitment to Communities</h2>
          <p>We believe in creating shared value - growing our business while contributing positively to society.</p>
          <div className="benefit-grid">
            {commitments.map(([title, text]) => (
              <article className="hover-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap section-pad centered compact-section">
        <h2>Building a Better Tomorrow</h2>
        <p>
          Our social responsibility initiatives are integral to who we are as a company. We continue to
          expand our community engagement efforts, working hand-in-hand with local communities to create
          lasting positive change across Nepal.
        </p>
      </section>
    </>
  );
}

export default SocialResponsibilityPage;
