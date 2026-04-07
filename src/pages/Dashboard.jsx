import { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Dashboard.css";

function ProductCard({ product, categories, brands }) {
  const [liked, setLiked] = useState(false);

  const imageUrl =
    product.imageUrl || product.image || product.thumbnail || null;
  const productTitle = product.productName || product.name || "İsimsiz Ürün";
  const categoryName = product.category?.name || product.category || "Kategori";
  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 7
    : false;

  const matchedCategory = categories.find(
    (category) => String(category.id) === String(product.category_id),
  );

  const matchedBrand = brands.find(
    (brand) => String(brand.id) === String(matchedCategory?.brand_id),
  );

const detailUrl =
  matchedBrand?.brandSlug &&
  matchedCategory?.categorySlug &&
  product.productSlug
    ? `/dashboard/${matchedBrand.brandSlug}/${matchedCategory.categorySlug}/${product.productSlug}`
    : null;

  return (
    <div className="product-card">
      <div className={`product-img ${!imageUrl ? "no-image" : ""}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productTitle}
            className="product-image-tag"
          />
        ) : (
          <div className="product-img-fallback">
            <span>DRESSIFY</span>
          </div>
        )}

        {isNew && <span className="product-badge">Yeni</span>}

        <button
          type="button"
          className={`product-like ${liked ? "liked" : ""}`}
          onClick={() => setLiked((prev) => !prev)}
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

        <button type="button" className="product-add-cart">
          Sepete Ekle
        </button>
      </div>

      <div className="product-info">
        <p className="product-brand">Dressify</p>
        <p className="product-name">{productTitle}</p>

        <div className="product-bottom">
          <span className="product-category">{categoryName}</span>
          <span className="product-price">
            {product.price != null
              ? `${Number(product.price).toLocaleString("tr-TR")}₺`
              : "—"}
          </span>
        </div>

        <button
          type="button"
          className="product-detail-btn product-detail-btn--static"
          onClick={() => {
            if (!detailUrl) return;
            window.location.href = detailUrl;
          }}
          disabled={!detailUrl}
        >
          Detay
        </button>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton">
      <div className="product-img skeleton-box" />
      <div className="product-info">
        <div
          className="skeleton-line"
          style={{ width: "50%", marginBottom: 8 }}
        />
        <div
          className="skeleton-line"
          style={{ width: "80%", marginBottom: 12 }}
        />
        <div className="product-bottom">
          <div className="skeleton-line" style={{ width: "30%" }} />
          <div className="skeleton-line" style={{ width: "25%" }} />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Tümü");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const [productRes, brandRes, categoryRes] = await Promise.all([
          fetch(`${API_BASE_URL}/product`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/brand`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/category`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const [productJson, brandJson, categoryJson] = await Promise.all([
          productRes.json(),
          brandRes.json(),
          categoryRes.json(),
        ]);

        if (!productRes.ok || !productJson.success) {
          throw new Error(productJson.message || "Ürünler alınamadı.");
        }

        if (!brandRes.ok || !brandJson.success) {
          throw new Error(brandJson.message || "Markalar alınamadı.");
        }

        if (!categoryRes.ok || !categoryJson.success) {
          throw new Error(categoryJson.message || "Kategoriler alınamadı.");
        }

        const sortedProducts = [...(productJson.data || [])]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 51);

        setProducts(sortedProducts);
        setBrands(brandJson.data || []);
        setCategories(categoryJson.data || []);
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filters = ["Tümü", "Yeni"];

  const filteredProducts =
    activeFilter === "Tümü"
      ? products
      : products.filter((product) => {
          if (!product.createdAt) return false;
          return (
            Date.now() - new Date(product.createdAt).getTime() <
            1000 * 60 * 60 * 24 * 7
          );
        });

  return (
    <div className="dash-layout">
      <DashboardHeader />

      <main className="dash-main">
        <div className="dash-hero">
          <div className="dash-hero-text">
            <p className="dash-hero-eyebrow">Yeni Sezon — 2026</p>
            <h1 className="dash-hero-title">En Yeni Ürünler</h1>
          </div>

          {!loading && !error && (
            <div className="dash-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`dash-filter-btn ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="dash-error">
            <p>Ürünler yüklenemedi: {error}</p>
            <button onClick={() => window.location.reload()}>
              Tekrar Dene
            </button>
          </div>
        )}

        {loading && (
          <div className="dash-product-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="dash-product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={categories}
                  brands={brands}
                />
              ))
            ) : (
              <p className="dash-empty">Gösterilecek ürün bulunamadı.</p>
            )}
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default Dashboard;
