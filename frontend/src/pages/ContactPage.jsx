import api from "../api.js";
import PageHero from "../components/PageHero.jsx";
import { useState } from "react";
import whatsappLogo from "../assets/whatsapp-logo.png";

const contactItems = [
  ["Head Office", "Jabdi Marga, Pakali", "Itahari 56705, Koshi, Nepal"],
  ["Phone", "025 582841", "9852025560", "9852048218"],
  ["WhatsApp", "9852025560"],
  ["Business Hours", "Sunday - Friday", "9:00 AM - 5:00 PM"],
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
  });

  const categoryOptions = ["Farmer", "Dealer/Distributor", "Institutional Buyer", "Other"];
  const subjectOptions = ["Product Inquiry", "Dealer Partnership", "Farmer Support", "General Inquiry", "Feedback"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.category.trim() !== "" &&
      formData.subject.trim() !== "" &&
      formData.message.trim() !== ""
    );
  };

 const handleSubmit = async (event) => {
  event.preventDefault();
  if (!isFormValid()) return;

  try {
    await api.post("/contact", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", phone: "", category: "", subject: "", message: "" });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Something went wrong. Please try again.");
  }
};

  const renderIcon = (title) => {
    if (title.toLowerCase().includes("head")) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#145fe8" />
          <circle cx="12" cy="9" r="2.5" fill="#fff" />
        </svg>
      );
    }
    if (title.toLowerCase().includes("phone")) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M6.6 10.8a15.05 15.05 0 006.6 6.6l2.2-2.2a1 1 0 01.9-.27c1 .25 2.1.39 3.27.39a1 1 0 011 1V20a1 1 0 01-1 1C9.42 21 3 14.58 3 6a1 1 0 011-1h2.03a1 1 0 011 1c0 1.17.14 2.27.39 3.27a1 1 0 01-.27.9l-2.55 2.63z" fill="#145fe8" />
        </svg>
      );
    }
    if (title.toLowerCase().includes("whatsapp")) {
      return (
        <img src={whatsappLogo} alt="WhatsApp" width="20" height="20" />
      );
    }
    if (title.toLowerCase().includes("business") || title.toLowerCase().includes("hour")) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="#145fe8" strokeWidth="2" />
          <path d="M12 8.5V12.5L15.5 14.5" stroke="#145fe8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="6.5" stroke="#145fe8" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with us for inquiries, support, or partnership opportunities"
      />

      <section className="page-wrap contact-grid section-pad">
        {contactItems.map(([title, ...lines]) => (
          <article className="hover-card" key={title}>
            <span aria-hidden>{renderIcon(title)}</span>
            <h2>{title}</h2>
            <p>{lines.map((line) => (
              <span key={line}>{line}</span>
            ))}</p>
          </article>
        ))}
      </section>

      <section className="page-wrap contact-form-section section-pad">
        <div className="contact-left">
          <form className="contact-form hover-card" onSubmit={handleSubmit}>
            <div className="contact-form-heading">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and our team will get back to you as soon as possible.</p>
            </div>
            <label style={{ gridColumn: "1 / -1" }}>
              Full Name
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  placeholder="+977 98..."
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <label style={{ gridColumn: "1 / -1" }}>
              I am a...
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Subject
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="full-field">
              Your Message
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>
            <button
              className="button form-button"
              type="submit"
              disabled={!isFormValid()}
            >
              Send Message
            </button>
          </form>
        </div>

        <aside className="contact-aside">
          <article className="hover-card" style={{ padding: 28 }}>
            <h3 style={{ color: "#1E5171", marginBottom: 12 }}>Visit Our Locations</h3>
            <p style={{ marginTop: 12, color: "#6B6363" }}><span style={{ fontWeight: 400 }}>Regional Depots</span></p>
            <ul className="depot-list" style={{ marginTop: 12 }}>
              <li style={{color: "#6B6363"}}>Hile</li>
              <li style={{color: "#6B6363"}}>Bardibas</li>
              <li style={{color: "#6B6363"}}>Duhabi</li>
              <li style={{color: "#6B6363"}}>Lahan</li>
              <li style={{color: "#6B6363"}}>Janakpur</li>
              <li style={{color: "#6B6363"}}>Katari</li>
              <li style={{color: "#6B6363"}}>Beltar</li>
              <li style={{color: "#6B6363"}}>Sankhuwasabha</li>
            </ul>
          </article>

          <article className="hover-card" style={{ padding: 28, marginTop: 18 }}>
            <h3 style={{ color: "#1E5171", marginBottom: 12 }}>Why Contact Us?</h3>
            <ul style={{ marginTop: 12, color: "#6B6363" }}>
              <li style={{ marginBottom: 8 }}>Product information and pricing</li>
              <li style={{ marginBottom: 8 }}>Dealer and partnership opportunities</li>
              <li style={{ marginBottom: 8 }}>Technical support and farmer training</li>
              <li>General inquiries and feedback</li>
            </ul>
          </article>
        </aside>
      </section>

      <section className="page-wrap map-section section-pad">
        <div className="map-container hover-card" style={{ width: "100%", height: 400 }}>
          <iframe
            title="Sagar Feeds Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4229.214899799769!2d87.2344005759655!3d26.669174370513133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ca3f80ca979%3A0x1d4bced68cc7a697!2sSagar%20Feeds%20Pvt.%20Ltd.!5e1!3m2!1sen!2snp!4v1782006471606!5m2!1sen!2snp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

export default ContactPage;
