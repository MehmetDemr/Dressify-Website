// src/pages/CategoryPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Category.css";

/*  Product Card  */
function CategoryProductCard({ product, brand, category }) {
  const [liked, setLiked] = useState(false);

  const imageUrl =
    product.imageUrl || product.image || product.thumbnail || null;
  const productTitle = product.productName || product.name || "İsimsiz Ürün";

  const detailUrl =
    brand?.brandSlug && category?.categorySlug && product.productSlug
      ? `/dashboard/${brand.brandSlug}/${category.categorySlug}/${product.productSlug}`
      : null;

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 7
    : false;

  return (
    <div className="cp-card">
      <div className={`cp-card-img ${!imageUrl ? "no-image" : ""}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={productTitle} className="cp-card-img-tag" />
        ) : (
          <div className="cp-card-fallback">
            <span>{brand?.brandName || "DRESSIFY"}</span>
          </div>
        )}

        {isNew && <span className="cp-badge">Yeni</span>}

        <button
          type="button"
          className={`cp-like ${liked ? "liked" : ""}`}
          onClick={() => setLiked((p) => !p)}
          aria-label="Favoriye ekle"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button type="button" className="cp-add-cart">
          Sepete Ekle
        </button>
      </div>

      <div className="cp-card-info">
        <p className="cp-card-brand">{brand?.brandName || "Dressify"}</p>
        <p className="cp-card-name">{productTitle}</p>

        <div className="cp-card-bottom">
          <span className="cp-card-category">
            {category?.categoryName || "—"}
          </span>
          <span className="cp-card-price">
            {product.price != null
              ? `${Number(product.price).toLocaleString("tr-TR")}₺`
              : "—"}
          </span>
        </div>

        <button
          type="button"
          className="cp-detail-btn"
          onClick={() => {
            if (detailUrl) window.location.href = detailUrl;
          }}
          disabled={!detailUrl}
        >
          Detay
        </button>
      </div>
    </div>
  );
}

/*  Skeleton  */
function CategoryCardSkeleton() {
  return (
    <div className="cp-card cp-card--skeleton">
      <div className="cp-card-img skeleton-box" />
      <div className="cp-card-info">
        <div
          className="skeleton-line"
          style={{ width: "45%", marginBottom: 8 }}
        />
        <div
          className="skeleton-line"
          style={{ width: "75%", marginBottom: 12 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton-line" style={{ width: "28%" }} />
          <div className="skeleton-line" style={{ width: "22%" }} />
        </div>
      </div>
    </div>
  );
}

/*  Main Page  */
function CategoryPage() {
  const { brandSlug, categorySlug } = useParams();

  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [brandRes, categoryRes, productRes] = await Promise.all([
          fetch(`${API_BASE_URL}/brand`, { headers }),
          fetch(`${API_BASE_URL}/category`, { headers }),
          fetch(`${API_BASE_URL}/product`, { headers }),
        ]);

        const [brandJson, categoryJson, productJson] = await Promise.all([
          brandRes.json(),
          categoryRes.json(),
          productRes.json(),
        ]);

        if (!brandJson.success)
          throw new Error(brandJson.message || "Markalar alınamadı.");
        if (!categoryJson.success)
          throw new Error(categoryJson.message || "Kategoriler alınamadı.");
        if (!productJson.success)
          throw new Error(productJson.message || "Ürünler alınamadı.");

        const foundBrand = (brandJson.data || []).find(
          (b) => b.brandSlug === brandSlug,
        );
        if (!foundBrand) throw new Error("Marka bulunamadı.");
        setBrand(foundBrand);

        const foundCategory = (categoryJson.data || []).find(
          (c) =>
            c.categorySlug === categorySlug &&
            String(c.brand_id) === String(foundBrand.id),
        );
        if (!foundCategory) throw new Error("Kategori bulunamadı.");
        setCategory(foundCategory);

        const categoryProducts = (productJson.data || []).filter(
          (p) => String(p.category_id) === String(foundCategory.id),
        );
        setProducts(categoryProducts);
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [brandSlug, categorySlug]);

  return (
    <div className="cp-layout">
      <DashboardHeader />

      <main className="cp-main">
        {/*  Hero  */}
        <div className="cp-hero">
          {loading ? (
            <>
              <div
                className="skeleton-line"
                style={{ width: 120, height: 10, marginBottom: 12 }}
              />
              <div
                className="skeleton-line"
                style={{ width: 220, height: 36 }}
              />
            </>
          ) : error ? null : (
            <>
              <p className="cp-hero-eyebrow">{brand?.brandName} — Kategori</p>
              <h1 className="cp-hero-title">{category?.categoryName}</h1>
              <p className="cp-hero-sub">{products.length} ürün</p>
            </>
          )}
        </div>

        {/*  Content  */}
        {error && (
          <div className="cp-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Tekrar Dene
            </button>
          </div>
        )}

        {loading && (
          <div className="cp-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="cp-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  brand={brand}
                  category={category}
                />
              ))
            ) : (
              <p className="cp-empty">Bu kategoride ürün bulunamadı.</p>
            )}
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default CategoryPage;
