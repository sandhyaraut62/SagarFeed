import logo from "./assets/sagar-logo.png";
import heroPoultry from "./assets/hero-poultry.png";
import aboutCollage from "./assets/about-collage.png";
import farmStory from "./assets/farm-story.png";
import broilerFeed from "./assets/product-broiler.jpg";
import premiumFeed from "./assets/product-premium.png";
import pigFeed from "./assets/product-pig.jpg";
import fishFeed from "./assets/product-fish.webp";
import duckFeed from "./assets/product-duck.jpg";
import calfFeed from "./assets/product-calf.jpg";
import heiferFeed from "./assets/product-heifer.jpg";
import milkyFeed from "./assets/product-milky.webp";
import dryFeed from "./assets/product-dry.jpg";
import girirajFeed from "./assets/product-giriraj.jpg";
import layerFeed from "./assets/product-layer.png";
import quailFeed from "./assets/product-quail.jpg";
import goatFeed from "./assets/product-goat.jpg";
import horseFeed from "./assets/product-horse.jpg";
import lineIcon from "./assets/100-ton-home.png";
import dealerHomeIcon from "./assets/320+dealer-home.png";
import locationIcon from "./assets/location-icon.png";
import farmerNetworkHome from "./assets/farmer-network-home.png";
import socialResponsibilityHome from "./assets/Social-Responsibility-home.png";
import hundredTonAbout from "./assets/About-Us/100-ton-About.png";
import dealerAbout from "./assets/About-Us/320+dealer-About.png";
import thirtyAbout from "./assets/About-Us/30+About.png";
import oneFiftyFiveAbout from "./assets/About-Us/155+About.png";

export const assets = {
  logo,
  heroPoultry,
  aboutCollage,
  farmStory,
  lineIcon,
  dealerHomeIcon,
  locationIcon,
  farmerNetworkHome,
  socialResponsibilityHome,
  dealerAbout,
};

export const navLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Network", "/network"],
  ["Contact", "/contact"],
  ["Sign In", "/login"],
  ["Register", "/register"],
];

export const quickLinks = [
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Distribution Network", "/network"],
  ["Farmer Support", "/farmer-support"],
  ["Collaborations", "/collaborations"],
  ["Social Responsibility", "/social-responsibility"],
  ["Contact", "/contact"],
];

export const stats = [
  ["100 Tons", "Daily Production"],
  ["320 +", "Dealers", dealerHomeIcon],
  ["1500 +", "Sub-dealers", locationIcon],
  ["2200 +", "Farmer Networks", farmerNetworkHome],
];

export const achievements = [
  ["100 Tons", "Daily Production", hundredTonAbout],
  ["320 +", "Dealers", dealerAbout],
  ["1500 +", "Sub-dealers", dealerAbout],
  ["2200 +", "Farmer Networks", dealerAbout],
  ["30+", "Direct Staff", thirtyAbout],
  ["155 +", "Employment Opportunities", oneFiftyFiveAbout],
];

export const whyChoose = [
  ["Quality-Focused Production", "Scientifically balanced formulations using carefully selected raw materials for optimal nutrition."],
  ["Nationwide Distribution", "Extensive network of dealers and regional depots ensuring accessibility across Nepal.", locationIcon],
  ["Technical Support", "Regular training and field visits by veterinarians and technical experts.", dealerHomeIcon],
  ["Social Responsibility", "Active participation in community development and agricultural support programs.", socialResponsibilityHome],
];

export const productImages = {
  "product-broiler.jpg": broilerFeed,
  "product-broiler.png": broilerFeed,
  "product-premium.jpg": premiumFeed,
  "product-pig.jpg": pigFeed,
  "product-pig.png": pigFeed,
  "product-fish.webp": fishFeed,
  "product-duck.jpg": duckFeed,
  "product-duck.png": duckFeed,
  "product-calf.jpg": calfFeed,
  "product-heifer.jpg": heiferFeed,
  "product-milky.webp": milkyFeed,
  "product-dry.jpg": dryFeed,
  "product-giriraj.jpg": girirajFeed,
  "product-layer.png": layerFeed,
  "product-quail.jpg": quailFeed,
  "product-goat.jpg": goatFeed,
  "product-horse.jpg": horseFeed,
};

export const products = [
  {
    title: "Broiler Feed",
    image: broilerFeed,
    text: "High-performance feed formulated to ensure rapid growth, strong immunity, and better feed conversion ratios.",
    points: ["Rapid growth support", "Strong immunity boost", "Better feed conversion ratio", "Optimal nutrition balance"],
  },
  {
    title: "Premium Feed",
    image: premiumFeed,
    text: "Advanced feed solutions enriched with essential nutrients to maximize productivity and overall animal health.",
    points: ["Enhanced nutritional value", "Maximum productivity", "Improved animal health", "Premium quality ingredients"],
  },
  {
    title: "Pig Feed",
    image: pigFeed,
    text: "Carefully balanced nutrition to support healthy growth, reproduction, and efficient weight gain.",
    points: ["Healthy growth support", "Improved reproduction", "Efficient weight gain", "Balanced nutrition"],
  },
  {
    title: "Fish Feed",
    image: fishFeed,
    text: "Floating and sinking feed varieties designed for optimal aquatic growth and sustainability.",
    points: ["Optimal aquatic growth", "Sustainable formulation", "Multiple feed varieties", "Water quality friendly"],
  },
  {
    title: "Duck Feed",
    image: duckFeed,
    text: "Specially formulated feed to support egg production, growth, and disease resistance in ducks.",
    points: ["Enhanced egg production", "Growth support", "Disease resistance", "Complete nutrition"],
  },
  {
    title: "Cattle Feed (Cow & Buffalo)",
    image: milkyFeed,
    text: "Nutritious feed that enhances milk production, improves digestion, and ensures overall livestock wellness.",
    points: ["Enhanced milk production", "Improved digestion", "Overall wellness", "High-quality ingredients"],
  },
];

export const locations = ["Hile", "Janakpur", "Duhabi", "Lahan", "Katari", "Bardibas", "Beltar", "Sankhuwasabha"];
