import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Brand.css";

function BrandProductCard({ product, brand, categories }) {
  const [liked, setLiked] = useState(!!product.isFavourite);
  const [favouriteId, setFavouriteId] = useState(product.favouriteId || null);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setLiked(!!product.isFavourite);
    setFavouriteId(product.favouriteId || null);
  }, [product.isFavourite, product.favouriteId]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (isLiking) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in to add to favorites.");
      return;
    }

    try {
      setIsLiking(true);
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
          headers: { Authorization: `Bearer ${token}` },
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
        setLiked(data.isFavourite ?? !liked);
        setFavouriteId(data.isFavourite ? data.favouriteId || null : null);
      } else {
        console.error("Favorite operation failed:", data.message);
      }
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const imageUrl =
    product.imageUrl || product.image || product.thumbnail || null;
  const productTitle = product.productName || product.name || "Unnamed Product";

  const matchedCategory = categories.find(
    (c) => String(c.id) === String(product.category_id),
  );
  const categoryName = matchedCategory?.categoryName || "Category";

  const detailUrl =
    brand?.brandSlug && matchedCategory?.categorySlug && product.productSlug
      ? `/dashboard/${brand.brandSlug}/${matchedCategory.categorySlug}/${product.productSlug}`
      : null;

  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 7
    : false;

  return (
    <div className="bp-card">
      <div className={`bp-card-img ${!imageUrl ? "no-image" : ""}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={productTitle} className="bp-card-img-tag" />
        ) : (
          <div className="bp-card-fallback">
            <span>{brand?.brandName || "DRESSIFY"}</span>
          </div>
        )}

        {isNew && <span className="bp-badge">Yeni</span>}

        <button
          type="button"
          className={`bp-like ${liked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={isLiking}
          aria-label="Favoriye ekle"
          style={{
            color: liked ? "#ff4d4f" : "inherit",
            cursor: isLiking ? "not-allowed" : "pointer",
          }}
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

        <button type="button" className="bp-add-cart bp-add-cart--desktop">
          Add to Card
        </button>
      </div>

      <div className="bp-card-info">
        <p className="bp-card-brand">{brand?.brandName || "Dressify"}</p>
        <p className="bp-card-name">{productTitle}</p>

        <div className="bp-card-bottom">
          <span className="bp-card-category">{categoryName}</span>
          <span className="bp-card-price">
            {product.price != null
              ? `${Number(product.price).toLocaleString("tr-TR")}₺`
              : "—"}
          </span>
        </div>

        <button type="button" className="bp-add-cart bp-add-cart--mobile">
          Add to Card
        </button>

        <button
          type="button"
          className="bp-detail-btn"
          onClick={() => {
            if (detailUrl) window.location.href = detailUrl;
          }}
          disabled={!detailUrl}
        >
          Details
        </button>
      </div>
    </div>
  );
}

/*  Skeleton  */
function BrandCardSkeleton() {
  return (
    <div className="bp-card bp-card--skeleton">
      <div className="bp-card-img skeleton-box" />
      <div className="bp-card-info">
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
function BrandPage() {
  const { brandSlug } = useParams();

  const [brand, setBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

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
          throw new Error(brandJson.message || "The brands could not be acquired.");
        if (!categoryJson.success)
          throw new Error(
            categoryJson.message || "The categories could not be acquired.",
          );
        if (!productJson.success)
          throw new Error(productJson.message || "The products could not be received.");

        const foundBrand = (brandJson.data || []).find(
          (b) => b.brandSlug === brandSlug,
        );
        if (!foundBrand) throw new Error("Brand not found.");
        setBrand(foundBrand);

        const brandCategories = (categoryJson.data || []).filter(
          (c) => String(c.brand_id) === String(foundBrand.id),
        );
        setCategories(brandCategories);

        const brandCategoryIds = new Set(brandCategories.map((c) => c.id));
        const brandProducts = (productJson.data || []).filter((p) =>
          brandCategoryIds.has(p.category_id),
        );
        setProducts(brandProducts);
      } catch (err) {
        setError(err.message || "An error occured.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [brandSlug]);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) => String(p.category_id) === String(activeCategory),
        );

  return (
    <div className="bp-layout">
      <DashboardHeader />

      <main className="bp-main">
        {/*  Brand Hero  */}
        <div className="bp-hero">
          {loading ? (
            <div className="skeleton-line" style={{ width: 180, height: 36 }} />
          ) : error ? null : (
            <>
              <p className="bp-hero-eyebrow">Brand  Collection</p>
              <h1 className="bp-hero-title">{brand?.brandName}</h1>
              <p className="bp-hero-sub">
                {filteredProducts.length} product
                {activeCategory !== "all" &&
                categories.find((c) => c.id === activeCategory)
                  ? ` — ${categories.find((c) => c.id === activeCategory).categoryName}`
                  : ""}
              </p>
            </>
          )}
        </div>

        <div className="bp-body">
          {/*  Sidebar Filters  */}
          <aside className="bp-sidebar">
            <p className="bp-sidebar-title">Category</p>
            <ul className="bp-filter-list">
              <li>
                <button
                  className={`bp-filter-item ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                >
                  <span>All</span>
                  <span className="bp-filter-count">{products.length}</span>
                </button>
              </li>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => String(p.category_id) === String(cat.id),
                ).length;
                return (
                  <li key={cat.id}>
                    <button
                      className={`bp-filter-item ${activeCategory === cat.id ? "active" : ""}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span>{cat.categoryName}</span>
                      <span className="bp-filter-count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/*  Product Grid  */}
          <section className="bp-grid-wrap">
            {error && (
              <div className="bp-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            )}

            {loading && (
              <div className="bp-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BrandCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && !error && (
              <div className="bp-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <BrandProductCard
                      key={product.id}
                      product={product}
                      brand={brand}
                      categories={categories}
                    />
                  ))
                ) : (
                  <p className="bp-empty">
                    No products were found in this category.
                </p>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

export default BrandPage;
