// src/pages/ProductDetailsPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/ProductDetails.css";

function ProductDetailsPage() {
  const { brandSlug, categorySlug, productSlug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Slug'dan id bul
        const listRes = await fetch(`${API_BASE_URL}/product`, { headers });
        const listJson = await listRes.json();
        if (!listJson.success) throw new Error("Ürünler alınamadı.");

        const match = (listJson.data || []).find(
          (p) => p.productSlug === productSlug,
        );
        if (!match) throw new Error("Ürün bulunamadı.");

        // Detay çek
        const detailRes = await fetch(`${API_BASE_URL}/product/${match.id}`, {
          headers,
        });
        const detailJson = await detailRes.json();
        if (!detailJson.success)
          throw new Error(detailJson.message || "Ürün detayı alınamadı.");

        setProduct(detailJson.data);
        setLiked(detailJson.data.isFavourite ?? false);
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productSlug]);

  async function handleLike() {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (liked) {
        await fetch(`${API_BASE_URL}/favourite/${product.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(false);
      } else {
        await fetch(`${API_BASE_URL}/favourite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });
        setLiked(true);
      }
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleAddToCart() {
    if (cartLoading || addedToCart) return;
    setCartLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });
      const json = await res.json();
      if (json.success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
      }
    } finally {
      setCartLoading(false);
    }
  }

  const brand = product?.category?.brand;
  const category = product?.category;
  const imageUrl = product?.imageUrl || null;
  const isNew = product?.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 7
    : false;

  return (
    <div className="pdp-layout">
      <DashboardHeader />

      <main className="pdp-main">
        {/* Breadcrumb */}
        {!loading && !error && (
          <nav className="pdp-breadcrumb">
            <a href="/dashboard">Ana Sayfa</a>
            <span>/</span>
            {brand && (
              <>
                <a href={`/dashboard/${brand.brandSlug}`}>{brand.brandName}</a>
                <span>/</span>
              </>
            )}
            {category && (
              <>
                <a
                  href={`/dashboard/${brand?.brandSlug}/${category.categorySlug}`}
                >
                  {category.categoryName}
                </a>
                <span>/</span>
              </>
            )}
            <span className="pdp-breadcrumb-current">
              {product?.productName}
            </span>
          </nav>
        )}

        {/* Error */}
        {error && (
          <div className="pdp-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} type="button">
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="pdp-body">
            <div className="pdp-img-wrap skeleton-box" />
            <div className="pdp-info">
              <div
                className="skeleton-line"
                style={{ width: "30%", marginBottom: 12 }}
              />
              <div
                className="skeleton-line"
                style={{ width: "65%", height: 28, marginBottom: 16 }}
              />
              <div
                className="skeleton-line"
                style={{ width: "20%", height: 22, marginBottom: 24 }}
              />
              <div
                className="skeleton-line"
                style={{ width: "90%", marginBottom: 8 }}
              />
              <div
                className="skeleton-line"
                style={{ width: "75%", marginBottom: 8 }}
              />
              <div
                className="skeleton-line"
                style={{ width: "55%", marginBottom: 32 }}
              />
              <div
                className="skeleton-line"
                style={{ width: "100%", height: 48, borderRadius: 10 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && product && (
          <div className="pdp-body">
            {/* Left — Image */}
            <div className="pdp-img-wrap">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.productName}
                  className="pdp-img"
                />
              ) : (
                <div className="pdp-img-fallback">
                  <span>{brand?.brandName || "DRESSIFY"}</span>
                </div>
              )}

              {isNew && <span className="pdp-img-badge">Yeni</span>}

              <button
                type="button"
                className={`pdp-like-btn ${liked ? "liked" : ""} ${likeLoading ? "loading" : ""}`}
                onClick={handleLike}
                aria-label="Favoriye ekle"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Right — Info */}
            <div className="pdp-info">
              {/* Brand + Category */}
              <div className="pdp-info-top">
                <span className="pdp-brand-tag">{brand?.brandName}</span>
                {category && (
                  <span className="pdp-category-tag">
                    {category.categoryName}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="pdp-title">{product.productName}</h1>

              {/* Price */}
              <p className="pdp-price">
                {product.price != null
                  ? `${Number(product.price).toLocaleString("tr-TR")}₺`
                  : "—"}
              </p>

              {/* Divider */}
              <div className="pdp-divider" />

              {/* Description */}
              {product.description && (
                <div className="pdp-desc-wrap">
                  <p className="pdp-desc-label">Ürün Açıklaması</p>
                  <p className="pdp-desc">{product.description}</p>
                </div>
              )}

              {/* Stock */}
              <div className="pdp-stock">
                <span
                  className={`pdp-stock-dot ${product.stock > 0 ? "in" : "out"}`}
                />
                <span className="pdp-stock-label">
                  {product.stock > 0
                    ? `Stokta ${product.stock} adet`
                    : "Stok tükendi"}
                </span>
              </div>

              <div className="pdp-divider" />

              {/* Quantity + Cart */}
              <div className="pdp-actions">


                {/* Add to cart */}
                <button
                  type="button"
                  className={`pdp-cart-btn ${addedToCart ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                >
                  {addedToCart ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Sepete Eklendi
                    </>
                  ) : cartLoading ? (
                    "Ekleniyor..."
                  ) : product.stock === 0 ? (
                    "Stok Tükendi"
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Sepete Ekle
                    </>
                  )}
                </button>
              </div>

              {/* Meta */}
              <div className="pdp-meta">
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Ürün Kodu</span>
                  <span className="pdp-meta-val">
                    {product.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Kategori</span>
                  <span className="pdp-meta-val">
                    {category?.categoryName || "—"}
                  </span>
                </div>
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Marka</span>
                  <span className="pdp-meta-val">
                    {brand?.brandName || "—"}
                  </span>
                </div>
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Eklenme Tarihi</span>
                  <span className="pdp-meta-val">
                    {new Date(product.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default ProductDetailsPage;
