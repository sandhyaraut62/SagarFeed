import { NavLink } from "react-router-dom";
import { assets, quickLinks } from "../content.js";

const footerProducts = ["Broiler Feed", "Premium Feed", "Pig Feed", "Fish Feed", "Duck Feed", "Cattle Feed"];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <section className="footer-brand">
          <img src={assets.logo} alt="Sagar Feeds" />
          <p>Nourishing Livestock. Empowering Farmers. Building Nepal.</p>
          <div className="footer-social">
            
              <a href="https://www.facebook.com/sagarfeedsnp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sagar Feeds on Facebook">

              <i className="fa-brands fa-facebook"></i>
            </a>
            
              <a href="https://www.tiktok.com/@sagarfeeds"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sagar Feeds on TikTok">

              <i className="fa-brands fa-tiktok"></i>
            </a>
            
              <a href="mailto:sagarfeeds.noreply@gmail.com"
              aria-label="Email Sagar Feeds">

              <i className="fa-solid fa-envelope"></i>
            </a>
            
              <a href="https://wa.me/9779852025560"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Sagar Feeds on WhatsApp">
                
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </section>

        <section>
          <h2>Quick Link</h2>
          <nav className="quick-links" aria-label="Footer quick links">
            {quickLinks.map(([label, path]) => (
              <NavLink key={path} to={path}>
                {label}
              </NavLink>
            ))}
          </nav>
        </section>

        <section>
          <h2>Products</h2>
          <nav className="quick-links" aria-label="Footer product links">
            {footerProducts.map((product) => (
              <NavLink key={product} to="/products">
                {product}
              </NavLink>
            ))}
          </nav>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Jabdi Marga, Pakali</p>
          <p>Itahari 56705, Koshi, Nepal</p>
          <p>025 582841</p>
          <p>9852025560</p>
          <p>Sunday - Friday</p>
          <p>9:00 AM - 5:00 PM</p>
        </section>
      </div>
      <div className="footer-bottom">
        <p>Copyright 2026 Sagar Feed Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;