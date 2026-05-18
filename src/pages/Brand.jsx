import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Brand.css";

function getProductCategoryId(product) {
  if (!product) return null;
  return (
    product.category_id ||
    product.categoryId ||
    product.category?.id ||
    product.Category?.id ||
    null
  );
}

function getCategoryBrandId(category) {
  if (!category) return null;
  return (
    category.brand_id ||
    category.brandId ||
    category.brand?.id ||
    category.Brand?.id ||
    null
  );
}

function getLastSlugPart(slug) {
  if (!slug) return "";
  return String(slug).split("/").filter(Boolean).pop();
}

function getToken() {
  return localStorage.getItem("token");
}

//Cache settings
const STALE_TIME = 1000 * 60 * 5; // it counts fresh 5 minutes
const CACHE_TIME = 1000 * 60 * 30; // stored in cache 30 minutes

async function fetchBrands() {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/brand`, { headers });
  const json = await res.json();
  console.log("brands raw:", json.data);

  if (!json.success)
    throw new Error(json.message || "The brands could not be acquired.");
  return json.data || [];
}

async function fetchCategories() {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/category`, { headers });
  const json = await res.json();
  if (!json.success)
    throw new Error(json.message || "The categories could not be acquired.");
  return json.data || [];
}

async function fetchBrandProducts({ brandSlug, page, limit }) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `${API_BASE_URL}/product?brandSlug=${brandSlug}&limit=${limit}&page=${page}`,
    { headers },
  );
  const json = await res.json();
  if (!json.success)
    throw new Error(json.message || "The products could not be received.");
  return json;
}

function BrandProductCard({ product, brand, categories }) {
  const [liked, setLiked] = useState(!!product.isFavourite);
  const [favouriteId, setFavouriteId] = useState(product.favouriteId || null);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (isLiking) return;

    const token = getToken();
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
  const productCategoryId = getProductCategoryId(product);
  const matchedCategory = categories.find(
    (c) => String(c.id) === String(productCategoryId),
  );
  const categoryName = matchedCategory?.categoryName || "Category";
  const categorySlugForUrl = getLastSlugPart(matchedCategory?.categorySlug);
  const productSlugForUrl = getLastSlugPart(product.productSlug);
  const detailUrl =
    brand?.brandSlug && categorySlugForUrl && productSlugForUrl
      ? `/dashboard/${brand.brandSlug}/${categorySlugForUrl}/${productSlugForUrl}`
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
          Add to Cart
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
          Add to Cart
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

function BrandPage() {
  const { brandSlug } = useParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);
  const LIMIT = 32;

  // Brands infinity cache
  const {
    data: allBrands = [],
    isLoading: brandsLoading,
    isError: brandsError,
    error: brandsErr,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  //Categories infinity cache
  const {
    data: allCategories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErr,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  // Products caching
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErr,
    isFetching,
  } = useQuery({
    queryKey: ["brandProducts", brandSlug, page],
    queryFn: () => fetchBrandProducts({ brandSlug, page, limit: LIMIT }),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    placeholderData: (prev) => prev,
  });

  const brand =
    allBrands.find((b) => String(b.brandSlug) === String(brandSlug)) || null;

  const brandCategories = allCategories.filter(
    (cat) => brand && String(getCategoryBrandId(cat)) === String(brand.id),
  );

  const allProducts = productData?.data || [];
  const totalPages = productData?.totalPages || 1;

  const brandCategoryIds = new Set(brandCategories.map((c) => String(c.id)));
  const brandProducts = allProducts.filter((p) =>
    brandCategoryIds.has(String(getProductCategoryId(p))),
  );

  const filteredProducts =
    activeCategory === "all"
      ? brandProducts
      : brandProducts.filter(
          (p) => String(getProductCategoryId(p)) === String(activeCategory),
        );

  const error =
    (brandsError && (brandsErr?.message || "Brands could not be fetched.")) ||
    (categoriesError &&
      (categoriesErr?.message || "Categories could not be fetched.")) ||
    (productsError &&
      (productsErr?.message || "Products could not be fetched.")) ||
    (!productsLoading && !productsError && !brand ? "Brand not found." : null);

  const loading =
    brandsLoading || categoriesLoading || (productsLoading && !productData);

  return (
    <div className="bp-layout">
      <DashboardHeader />

      <main className="bp-main">
        <div className="bp-hero">
          {loading ? (
            <div className="skeleton-line" style={{ width: 180, height: 36 }} />
          ) : error ? null : (
            <>
              <p className="bp-hero-eyebrow">Brand Collection</p>
              <h1 className="bp-hero-title">{brand?.brandName}</h1>
              <p className="bp-hero-sub">
                {filteredProducts.length} product
                {activeCategory !== "all" &&
                brandCategories.find(
                  (c) => String(c.id) === String(activeCategory),
                )
                  ? ` — ${brandCategories.find((c) => String(c.id) === String(activeCategory)).categoryName}`
                  : ""}
              </p>
            </>
          )}
        </div>

        <div className="bp-body">
          <aside className="bp-sidebar">
            <p className="bp-sidebar-title">Category</p>
            <ul className="bp-filter-list">
              <li>
                <button
                  className={`bp-filter-item ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                >
                  <span>All</span>
                  <span className="bp-filter-count">
                    {brandProducts.length}
                  </span>
                </button>
              </li>

              {brandCategories.map((cat) => {
                const count = brandProducts.filter(
                  (p) => String(getProductCategoryId(p)) === String(cat.id),
                ).length;

                return (
                  <li key={cat.id}>
                    <button
                      className={`bp-filter-item ${String(activeCategory) === String(cat.id) ? "active" : ""}`}
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

          <section className="bp-grid-wrap">
            {isFetching && !loading && (
              <div
                className="dash-refetch-indicator"
                aria-label="Refreshing..."
              >
                ↻
              </div>
            )}

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
                {Array.from({ length: 6 }).map((_, index) => (
                  <BrandCardSkeleton key={index} />
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
                      categories={brandCategories}
                    />
                  ))
                ) : (
                  <p className="bp-empty">
                    No products were found in this category.
                  </p>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="dash-pagination">
                <div className="dash-pg-controls">
                  <button
                    className="dash-pg-btn dash-pg-arrow"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        className={`dash-pg-btn ${p === page ? "active" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    className="dash-pg-btn dash-pg-arrow"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    ›
                  </button>
                </div>
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
