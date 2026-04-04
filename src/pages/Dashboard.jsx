import { useState } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import "../styles/Dashboard.css";

const products = [
  {
    id: 1,
    name: "Silk Midi Dress",
    brand: "Zimmermann",
    category: "Elbise",
    price: "4.290₺",
    badge: "Yeni",
    color: "#d4c5b0",
  },
  {
    id: 2,
    name: "Linen Blazer",
    brand: "Toteme",
    category: "Ceket",
    price: "6.850₺",
    badge: "Yeni",
    color: "#b8bfb0",
  },
  {
    id: 3,
    name: "Wide-Leg Trousers",
    brand: "Arket",
    category: "Pantolon",
    price: "2.990₺",
    badge: null,
    color: "#c2bab5",
  },
  {
    id: 4,
    name: "Merino Knit Top",
    brand: "COS",
    category: "Üst",
    price: "1.890₺",
    badge: "Popüler",
    color: "#c9b89a",
  },
  {
    id: 5,
    name: "Leather Loafer",
    brand: "A.P.C.",
    category: "Ayakkabı",
    price: "8.400₺",
    badge: "Yeni",
    color: "#a89880",
  },
  {
    id: 6,
    name: "Cotton Midi Skirt",
    brand: "& Other Stories",
    category: "Etek",
    price: "2.450₺",
    badge: null,
    color: "#cac0d0",
  },
  {
    id: 7,
    name: "Cashmere Scarf",
    brand: "Loro Piana",
    category: "Aksesuar",
    price: "12.000₺",
    badge: "Özel",
    color: "#b5c4c0",
  },
  {
    id: 8,
    name: "Wool Coat",
    brand: "Max Mara",
    category: "Mont",
    price: "18.500₺",
    badge: "Yeni",
    color: "#c8b8a8",
  },
];

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="product-card">
      <div className="product-img" style={{ background: product.color }}>
        {product.badge && (
          <span
            className={`product-badge ${product.badge === "Özel" ? "badge--special" : ""}`}
          >
            {product.badge}
          </span>
        )}
        <button
          className={`product-like ${liked ? "liked" : ""}`}
          onClick={() => setLiked((v) => !v)}
          aria-label="Favoriye ekle"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button className="product-add-cart">Sepete Ekle</button>
      </div>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <p className="product-name">{product.name}</p>
        <div className="product-bottom">
          <span className="product-category">{product.category}</span>
          <span className="product-price">{product.price}</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const filters = [
    "Tümü",
    "Yeni",
    "Elbise",
    "Üst",
    "Pantolon",
    "Ceket",
    "Aksesuar",
  ];

  const filtered =
    activeFilter === "Tümü"
      ? products
      : products.filter(
          (p) => p.badge === activeFilter || p.category === activeFilter,
        );

  return (
    <div className="dash-layout">
      <DashboardHeader />

      <main className="dash-main">
        {/* Hero heading */}
        <div className="dash-hero">
          <div className="dash-hero-text">
            <p className="dash-hero-eyebrow">Yeni Sezon — 2026</p>
            <h1 className="dash-hero-title">En Yeni Ürünler</h1>
          </div>

          {/* Filters */}
          <div className="dash-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`dash-filter-btn ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="dash-product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

export default Dashboard;
