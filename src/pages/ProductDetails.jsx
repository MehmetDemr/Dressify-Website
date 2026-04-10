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
  const [favouriteId, setFavouriteId] = useState(null);
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

        const listRes = await fetch(`${API_BASE_URL}/product`, { headers });
        const listJson = await listRes.json();
        if (!listJson.success) throw new Error("The products could not be received.");

        const match = (listJson.data || []).find(
          (p) => p.productSlug === productSlug,
        );
        if (!match) throw new Error("Product not found.");

        const detailRes = await fetch(`${API_BASE_URL}/product/${match.id}`, {
          headers,
        });
        const detailJson = await detailRes.json();
        if (!detailJson.success) {
          throw new Error(detailJson.message || "Product details could not be retrieved.");
        }

        setProduct(detailJson.data);
        setLiked(!!detailJson.data.isFavourite);
        setFavouriteId(detailJson.data.favouriteId || null);
      } catch (err) {
        setError(err.message || "An error occured.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productSlug]);

  async function handleLike() {
    if (likeLoading || !product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in to add to favorites.");
      return;
    }

    try {
      setLikeLoading(true);
      let response;

      if (liked && favouriteId) {
        response = await fetch(`${API_BASE_URL}/favourite/${favouriteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (!liked) {
        response = await fetch(`${API_BASE_URL}/favourite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });
      } else {
        const listRes = await fetch(`${API_BASE_URL}/favourite`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const listData = await listRes.json();
        const match = listData.data?.find(
          (f) => String(f.product_id) === String(product.id),
        );

        if (match) {
          setFavouriteId(match.id);

          response = await fetch(`${API_BASE_URL}/favourite/${match.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      if (!response) return;

      const data = await response.json();

      if (response.ok && data.success) {
        const newLiked = data.isFavourite ?? !liked;
        const newFavouriteId = newLiked
          ? data.favouriteId || favouriteId
          : null;

        setLiked(newLiked);
        setFavouriteId(newFavouriteId);

        setProduct((prev) =>
          prev
            ? {
                ...prev,
                isFavourite: newLiked,
                favouriteId: newFavouriteId,
              }
            : prev,
        );
      } else {
        alert(data.message || "Favorite operation failed.");
      }
    } catch (error) {
      console.error("Favorite function error:", error);
      alert("An error occured.");
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
        {!loading && !error && (
          <nav className="pdp-breadcrumb">
            <a href="/dashboard">Main Page</a>
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

        {error && (
          <div className="pdp-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} type="button">
              Try Again
            </button>
          </div>
        )}

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

        {!loading && !error && product && (
          <div className="pdp-body">
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

              {isNew && <span className="pdp-img-badge">New</span>}

              <button
                type="button"
                className={`pdp-like-btn ${liked ? "liked" : ""} ${likeLoading ? "loading" : ""}`}
                onClick={handleLike}
                aria-label={liked ? "Favorilerden çıkar" : "Favoriye ekle"}
                disabled={likeLoading}
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

            <div className="pdp-info">
              <div className="pdp-info-top">
                <span className="pdp-brand-tag">{brand?.brandName}</span>
                {category && (
                  <span className="pdp-category-tag">
                    {category.categoryName}
                  </span>
                )}
              </div>

              <h1 className="pdp-title">{product.productName}</h1>

              <p className="pdp-price">
                {product.price != null
                  ? `${Number(product.price).toLocaleString("tr-TR")}₺`
                  : "—"}
              </p>

              <div className="pdp-divider" />

              {product.description && (
                <div className="pdp-desc-wrap">
                  <p className="pdp-desc-label">Product Description</p>
                  <p className="pdp-desc">{product.description}</p>
                </div>
              )}

              <div className="pdp-stock">
                <span
                  className={`pdp-stock-dot ${product.stock > 0 ? "in" : "out"}`}
                />
                <span className="pdp-stock-label">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              <div className="pdp-divider" />

              <div className="pdp-actions">
                <button
                  type="button"
                  className={`pdp-cart-btn ${addedToCart ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                >
                  {addedToCart
                    ? "Added to Card"
                    : cartLoading
                      ? "Adding..."
                      : product.stock === 0
                        ? "Out of stock"
                        : "Add to Card"}
                </button>
              </div>

              <div className="pdp-meta">
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Product code</span>
                  <span className="pdp-meta-val">
                    {product.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Category</span>
                  <span className="pdp-meta-val">
                    {category?.categoryName || "—"}
                  </span>
                </div>
                <div className="pdp-meta-row">
                  <span className="pdp-meta-key">Brand</span>
                  <span className="pdp-meta-val">
                    {brand?.brandName || "—"}
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
