import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Dashboard.css";

//  Cache settings
const LIMIT = 24;
const STALE_TIME = 1000 * 60 * 5; // it counts fresh 5 minutes
const CACHE_TIME = 1000 * 60 * 30; // stored in cache 30 minutes

function getToken() {
  return localStorage.getItem("token");
}

async function fetchProducts(page) {
  const res = await fetch(
    `${API_BASE_URL}/product?page=${page}&limit=${LIMIT}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.message || "Products could not be fetched.");
  return json;
}

async function fetchBrands() {
  const res = await fetch(`${API_BASE_URL}/brand`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.message || "Brands could not be fetched.");
  return json.data || [];
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/category`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.message || "Categories could not be fetched.");
  return json.data || [];
}

//Pagination
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="dash-pagination">
      <div className="dash-pg-controls">
        <button
          className="dash-pg-btn dash-pg-arrow"
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === 1}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="dash-pg-dots">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`dash-pg-btn ${p === currentPage ? "active" : ""}`}
              onClick={() => {
                onPageChange(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {p}
            </button>
          ),
        )}

        <button
          className="dash-pg-btn dash-pg-arrow"
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
      <p className="dash-pg-info">
        {start}–{end} / {totalItems} product
      </p>
    </div>
  );
}

//  ProductCard
function ProductCard({ product, categories, brands }) {
  const [liked, setLiked] = useState(!!product.isFavourite);
  const [favouriteId, setFavouriteId] = useState(product.favouriteId || null);
  const [isLiking, setIsLiking] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const brandName = product.category?.brand?.brandName || "Dressify";
  const categoryName = product.category?.categoryName || "Category";
  const imageUrl =
    product.imageUrl || product.image || product.thumbnail || null;
  const productTitle = product.productName || product.name || "Unnamed Product";
  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 7
    : false;

  const matchedCategory = categories.find(
    (c) => String(c.id) === String(product.category_id),
  );
  const matchedBrand = brands.find(
    (b) => String(b.id) === String(matchedCategory?.brand_id),
  );
  const detailUrl =
    matchedBrand?.brandSlug &&
    matchedCategory?.categorySlug &&
    product.productSlug
      ? `/dashboard/${matchedBrand.brandSlug}/${matchedCategory.categorySlug}/${product.productSlug}`
      : null;

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAddingToCart) return;
    const token = getToken();
    if (!token) {
      alert("You must log in to add to your cart.");
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await fetch(`${API_BASE_URL}/card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Product added to cart.");
      } else {
        alert(data.message || "The product could not be added to the cart.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("An error occured.");
    } finally {
      setIsAddingToCart(false);
    }
  };

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
            <span>{brandName?.toUpperCase() || "DRESSIFY"}</span>
          </div>
        )}

        {isNew && <span className="product-badge">New</span>}

        <button
          type="button"
          className={`product-like ${liked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={isLiking}
          aria-label="Add to favourites"
          style={{
            color: liked ? "#ff4d4f" : "inherit",
            cursor: isLiking ? "not-allowed" : "pointer",
          }}
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

        <button
          type="button"
          className="product-add-cart product-add-cart--desktop"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          style={{ cursor: isAddingToCart ? "not-allowed" : "pointer" }}
        >
          {isAddingToCart ? "Adding Card..." : "Add Card"}
        </button>
      </div>

      <div className="product-info">
        <p className="product-brand">{brandName}</p>
        <p className="product-name">{productTitle}</p>

        <div className="product-bottom">
          <span className="product-category">{categoryName}</span>
          <span className="product-price">
            {product.price != null
              ? `${Number(product.price).toLocaleString("tr-TR")}₺`
              : ""}
          </span>
        </div>

        <button
          type="button"
          className="product-add-cart product-add-cart--mobile"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          style={{ cursor: isAddingToCart ? "not-allowed" : "pointer" }}
        >
          {isAddingToCart ? "Adding Card..." : "Add Card"}
        </button>

        <button
          type="button"
          className="product-detail-btn product-detail-btn--static"
          onClick={() => {
            if (!detailUrl) return;
            window.location.href = detailUrl;
          }}
          disabled={!detailUrl}
        >
          Details
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

//  Dashboard
function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Products
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
    error: productErr,
    isFetching,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME, // v5: cacheTime → gcTime
    placeholderData: (prev) => prev, //send older data while changing pages.
  });

  // Brands infinity cache
  const { data: brandData } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Categories infinitiy cache
  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // prefetch
  const prefetchNextPage = () => {
    const totalPages = productData?.totalPages || 1;
    if (page < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["products", page + 1],
        queryFn: () => fetchProducts(page + 1),
        staleTime: STALE_TIME,
      });
    }
  };

  const products = productData?.data || [];
  const brands = brandData || [];
  const categories = categoryData || [];
  const pagination = {
    totalPages: productData?.totalPages || 1,
    totalItems: productData?.totalItems || 0,
  };

  const loading = productsLoading;
  const error = productsError
    ? productErr?.message || "An error occurred."
    : null;

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const filters = ["All", "New"];

  const filteredProducts =
    activeFilter === "All"
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
            <p className="dash-hero-eyebrow">New Season 2026</p>
            <h1 className="dash-hero-title">New Products</h1>
          </div>

          {!loading && !error && (
            <div className="dash-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`dash-filter-btn ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        {isFetching && !loading && (
          <div className="dash-refetch-indicator" aria-label="Refreshing...">
            ↻
          </div>
        )}

        {error && (
          <div className="dash-error">
            <p>Products could not be loaded: {error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
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
              <p className="dash-empty">Products not found...</p>
            )}
          </div>
        )}

        {!loading && !error && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            perPage={LIMIT}
            onPageChange={(newPage) => {
              setPage(newPage);
              prefetchNextPage();
            }}
          />
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default Dashboard;
