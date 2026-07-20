import { useMemo, useState } from "react";
import PageHero from "../components/PageHero.jsx";
import { productPortfolio } from "../content.js";

import layerStarter from "../assets/Product-Layer/product-layer-starter.JPG";
import layerGrower from "../assets/Product-Layer/product-layer-grower.JPG";
import layerPreLaying from "../assets/Product-Layer/product-layer-pre-laying-SL3.JPG";
import layerSuperLayingType1 from "../assets/Product-Layer/product-layer-super-laying-Type I.JPG";
import layerSuperLayingType2 from "../assets/Product-Layer/product-layer-super-laying-Type II.JPG";

import broilerPreStarter from "../assets/Product-Broiler/product-broiler-pre-starter.JPG";
import broilerStarter from "../assets/Product-Broiler/product-broiler-starter.JPG";
import broilerFinisher from "../assets/Product-Broiler/product-broiler-finisher.JPG";

import girirajStarter from "../assets/Product-Giriraj/product-giriraj-starter.JPG";
import girirajGrower from "../assets/Product-Giriraj/product-giriraj-grower.JPG";
import girirajFinisher from "../assets/Product-Giriraj/product-giriraj-finisher.JPG";

import cattleCalf from "../assets/Product-Cattle/product-cattle-calf.JPG";
import cattleHeifer from "../assets/Product-Cattle/product-cattle-heifer.JPG";
import cattleMilky from "../assets/Product-Cattle/product-cattle-milky.JPG";
import cattleDry from "../assets/Product-Cattle/product-cattle-dry.JPG";

import swineFattening from "../assets/Product-Swine/product-swine-fattening.JPG";
import swineLactation from "../assets/Product-Swine/product-swine-lactation.JPG";
import swineGestation from "../assets/Product-Swine/product-swine-gestation.JPG";

import aquaSinking from "../assets/Product-Aqua/product-aqua-sinking.JPG";
import aquaFloating from "../assets/Product-Aqua/product-aqua-floating.JPG";

function getProductImage(category, title) {
  const normalizedCategory = category?.toLowerCase() || "";
  const normalizedTitle = title?.toLowerCase() || "";

  if (normalizedCategory.includes("layer")) {
    if (normalizedTitle.includes("starter")) return layerStarter;
    if (normalizedTitle.includes("grower")) return layerGrower;
    if (normalizedTitle.includes("pre-laying") || normalizedTitle.includes("sl3")) return layerPreLaying;
    if (normalizedTitle.includes("type i") || normalizedTitle.includes("type i")) return layerSuperLayingType1;
    if (normalizedTitle.includes("type ii") || normalizedTitle.includes("type ii")) return layerSuperLayingType2;
    return layerStarter;
  }

  if (normalizedCategory.includes("broiler")) {
    if (normalizedTitle.includes("pre-starter")) return broilerPreStarter;
    if (normalizedTitle.includes("finisher")) return broilerFinisher;
    return broilerStarter;
  }

  if (normalizedCategory.includes("giriraj")) {
    if (normalizedTitle.includes("grower")) return girirajGrower;
    if (normalizedTitle.includes("finisher")) return girirajFinisher;
    return girirajStarter;
  }

  if (normalizedCategory.includes("cattle")) {
    if (normalizedTitle.includes("heifer")) return cattleHeifer;
    if (normalizedTitle.includes("milky") || normalizedTitle.includes("dairy")) return cattleMilky;
    if (normalizedTitle.includes("dry")) return cattleDry;
    return cattleCalf;
  }

  if (normalizedCategory.includes("swine")) {
    if (normalizedTitle.includes("lactation")) return swineLactation;
    if (normalizedTitle.includes("gestation")) return swineGestation;
    return swineFattening;
  }

  if (normalizedCategory.includes("aqua")) {
    if (normalizedTitle.includes("floating")) return aquaFloating;
    return aquaSinking;
  }

  return null;
}

function ProductsPage() {
  const [activeTab, setActiveTab] = useState("All Products");

  const grouped = useMemo(() => {
    const byCategory = {};
    productPortfolio.forEach((product) => {
      if (!byCategory[product.category]) byCategory[product.category] = [];
      byCategory[product.category].push(product);
    });
    return byCategory;
  }, []);

  const categories = ["All Products", ...Object.keys(grouped)];
  const visibleCategories =
    activeTab === "All Products" ? Object.keys(grouped) : [activeTab].filter((c) => grouped[c]);

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Explore our feed portfolio with detailed category-specific products and formulations."
      />

      <div className="page-wrap tab-row section-pad">
        {categories.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {visibleCategories.map((category) => (
        <section className="page-wrap section-pad" key={category}>
          <h2 style={{ marginBottom: 16 }}>{category}</h2>
          <div className="product-grid">
            {grouped[category].flatMap((product) =>
              product.items.map((item) => (
                <article className="product-card hover-card" key={`${product.category}-${item.title}`}>
                  <img src={getProductImage(product.category, item.title) || product.image} alt={item.title} />
                  <div>
                    <h2>{item.title}</h2>
                    <p className="product-stage">{product.brand}</p>
                    {item.subtitle && <p className="product-price-row">{item.subtitle}</p>}
                    <p>{item.description}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      ))}
    </>
  );
}

export default ProductsPage;
