import { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Favourite.css";

/*  Product Card  */
function FavoriteCard({ product, brand, category, favoriteId, onRemove }) {
  const [removing, setRemoving] = useState(false);

  const imageUrl =
    product.imageUrl || product.image || product.thumbnail || null;
  const productTitle = product.productName || product.name || "İsimsiz Ürün";

  const detailUrl =
    brand?.brandSlug && category?.categorySlug && product.productSlug
      ? `/dashboard/${brand.brandSlug}/${category.categorySlug}/${product.productSlug}`
      : null;

  async function handleRemove() {
    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/favourite/${favoriteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onRemove(favoriteId);
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
            <span>{brand?.brandName || "DRESSIFY"}</span>
          </div>
        )}

        {/* Remove from favorites */}
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
        <p className="fav-card-brand">{brand?.brandName || "Dressify"}</p>
        <p className="fav-card-name">{productTitle}</p>

        <div className="fav-card-bottom">
          <span className="fav-card-category">
            {category?.categoryName || "—"}
          </span>
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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

        const [favRes, productRes, categoryRes, brandRes] = await Promise.all([
          fetch(`${API_BASE_URL}/favourite`, { headers }),
          fetch(`${API_BASE_URL}/product`, { headers }),
          fetch(`${API_BASE_URL}/category`, { headers }),
          fetch(`${API_BASE_URL}/brand`, { headers }),
        ]);

        const [favJson, productJson, categoryJson, brandJson] =
          await Promise.all([
            favRes.json(),
            productRes.json(),
            categoryRes.json(),
            brandRes.json(),
          ]);

        if (!favJson.success)
          throw new Error(favJson.message || "Favoriler alınamadı.");
        if (!productJson.success)
          throw new Error(productJson.message || "Ürünler alınamadı.");
        if (!categoryJson.success)
          throw new Error(categoryJson.message || "Kategoriler alınamadı.");
        if (!brandJson.success)
          throw new Error(brandJson.message || "Markalar alınamadı.");

        setFavorites(favJson.data || []);
        setProducts(productJson.data || []);
        setCategories(categoryJson.data || []);
        setBrands(brandJson.data || []);
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleRemove(favoriteId) {
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
  }

  // Favori product_id'lerine göre ürünleri eşleştir
  const favoriteProducts = favorites
    .map((fav) => {
      const product = products.find(
        (p) => String(p.id) === String(fav.product_id),
      );
      if (!product) return null;

      const category = categories.find(
        (c) => String(c.id) === String(product.category_id),
      );
      const brand = brands.find(
        (b) => String(b.id) === String(category?.brand_id),
      );

      return { fav, product, category, brand };
    })
    .filter(Boolean);

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
                  {favoriteProducts.length} ürün kaydedildi
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
          (favoriteProducts.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <div className="fav-grid">
              {favoriteProducts.map(({ fav, product, category, brand }) => (
                <FavoriteCard
                  key={fav.id}
                  favoriteId={fav.id}
                  product={product}
                  category={category}
                  brand={brand}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ))}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default FavoritesPage;
