import { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Favourite.css";

const LIMIT = 24;

/*  Pagination  */
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
        {start}–{end} / {totalItems} ürün
      </p>
    </div>
  );
}

/*  Favorite Card  */
function FavoriteCard({ fav, onRemove }) {
  const [removing, setRemoving] = useState(false);

  const product = fav.product || {}; 
  const brandName = product.brandName || "Dressify";
  const categoryName = product.categoryName || "";
  const imageUrl = product.imageUrl || null;
  const productTitle = product.productName || "İsimsiz Ürün";

  async function handleRemove() {
    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/favourite/${fav.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onRemove(fav.id);
      } else {
        setRemoving(false);
      }
    } catch {
      setRemoving(false);
    }
  }

  return (
    <div className={`fav-card ${removing ? "fav-card--removing" : ""}`}>
      <div className={`fav-card-img ${!imageUrl ? "no-image" : ""}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={productTitle} className="fav-card-img-tag" />
        ) : (
          <div className="fav-card-fallback">
            <span>{brandName.toUpperCase()}</span>
          </div>
        )}

        <button
          type="button"
          className="fav-remove-btn"
          onClick={handleRemove}
          disabled={removing}
          aria-label="Favorilerden çıkar"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button type="button" className="fav-add-cart">
          Sepete Ekle
        </button>
      </div>

      <div className="fav-card-info">
        <p className="fav-card-brand">{brandName}</p>
        <p className="fav-card-name">{productTitle}</p>

        <div className="fav-card-bottom">
          <span className="fav-card-category">{categoryName}</span>{" "}
          <span className="fav-card-price">
            {product.price != null
              ? `${Number(product.price).toLocaleString("tr-TR")}₺`
              : "—"}
          </span>
        </div>

        <button
          type="button"
          className="fav-detail-btn"
          onClick={() => {
            if (product.id)
              window.location.href = `/dashboard/product/${product.id}`;
          }}
          disabled={!product.id}
        >
          Detay
        </button>
      </div>
    </div>
  );
}

/*  Skeleton  */
function FavoriteCardSkeleton() {
  return (
    <div className="fav-card fav-card--skeleton">
      <div className="fav-card-img skeleton-box" />
      <div className="fav-card-info">
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

/*  Empty State  */
function EmptyFavorites() {
  return (
    <div className="fav-empty-state">
      <div className="fav-empty-icon">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <p className="fav-empty-title">Henüz favori ürününüz yok</p>
      <p className="fav-empty-sub">
        Beğendiğiniz ürünleri favorilere ekleyerek buradan takip edebilirsiniz.
      </p>
      <button
        className="fav-empty-btn"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Ürünleri Keşfet
      </button>
    </div>
  );
}

/*  Main Page  */
function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE_URL}/favourite?page=${page}&limit=${LIMIT}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Favoriler alınamadı.");
        }

        setFavorites(json.data || []);
        setPagination({
          totalPages: json.totalPages || 1,
          totalItems: json.totalItems || 0,
        });
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  function handleRemove(favoriteId) {
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    setPagination((prev) => ({ ...prev, totalItems: prev.totalItems - 1 }));
  }

  return (
    <div className="fav-layout">
      <DashboardHeader />

      <main className="fav-main">
        {/*  Hero  */}
        <div className="fav-hero">
          {loading ? (
            <>
              <div
                className="skeleton-line"
                style={{ width: 100, height: 10, marginBottom: 12 }}
              />
              <div
                className="skeleton-line"
                style={{ width: 200, height: 36 }}
              />
            </>
          ) : (
            <>
              <p className="fav-hero-eyebrow">Hesabım</p>
              <h1 className="fav-hero-title">Favorilerim</h1>
              {!error && (
                <p className="fav-hero-sub">
                  {pagination.totalItems} ürün kaydedildi
                </p>
              )}
            </>
          )}
        </div>

        {/*  Error  */}
        {error && (
          <div className="fav-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Tekrar Dene
            </button>
          </div>
        )}

        {/*  Loading  */}
        {loading && (
          <div className="fav-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <FavoriteCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/*  Content  */}
        {!loading &&
          !error &&
          (favorites.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <>
              <div className="fav-grid">
                {favorites.map((fav) => (
                  <FavoriteCard
                    key={fav.id}
                    fav={fav}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  perPage={LIMIT}
                  onPageChange={setPage}
                />
              )}
            </>
          ))}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default FavoritesPage;
