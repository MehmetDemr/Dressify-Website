import { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Card.css";

/*  Cart Item Row  */
function CartItem({ item, onQuantityChange, onRemove }) {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const product = item.product;
  const brand = product?.category?.brand;
  const category = product?.category;
  const imageUrl = product?.imageUrl || null;
  const productTitle = product?.productName || "İsimsiz Ürün";

  const detailUrl =
    brand?.brandSlug && category?.categorySlug && product?.productSlug
      ? `/dashboard/${brand.brandSlug}/${category.categorySlug}/${product.productSlug}`
      : null;

  async function handleQuantity(newQty) {
    if (newQty < 1) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/card/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      const json = await res.json();
      if (json.success) onQuantityChange(item.id, newQty);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/card/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onRemove(item.id);
    } catch {
      setRemoving(false);
    }
  }

  return (
    <div className={`cart-item ${removing ? "cart-item--removing" : ""}`}>
      {/* Image */}
      <div
        className={`cart-item-img ${!imageUrl ? "no-image" : ""}`}
        onClick={() => detailUrl && (window.location.href = detailUrl)}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={productTitle} />
        ) : (
          <div className="cart-item-fallback">
            <span>{brand?.brandName || "DRESSIFY"}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="cart-item-info">
        <p className="cart-item-brand">{brand?.brandName || "Dressify"}</p>
        <p
          className="cart-item-name"
          onClick={() => detailUrl && (window.location.href = detailUrl)}
        >
          {productTitle}
        </p>
        {category && (
          <p className="cart-item-category">{category.categoryName}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="cart-item-qty">
        <button
          className="cart-qty-btn"
          onClick={() => handleQuantity(item.quantity - 1)}
          disabled={loading || item.quantity <= 1}
          type="button"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="cart-qty-value">{loading ? "·" : item.quantity}</span>
        <button
          className="cart-qty-btn"
          onClick={() => handleQuantity(item.quantity + 1)}
          disabled={loading || item.quantity >= (product?.stock ?? 99)}
          type="button"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Price */}
      <div className="cart-item-price">
        <span className="cart-item-unit-price">
          {product?.price != null
            ? `${Number(product.price).toLocaleString("tr-TR")}₺`
            : "—"}
        </span>
        {item.quantity > 1 && (
          <span className="cart-item-total-price">
            {`${(Number(product.price) * item.quantity).toLocaleString("tr-TR")}₺`}
          </span>
        )}
      </div>

      {/* Remove */}
      <button
        className="cart-item-remove"
        onClick={handleRemove}
        disabled={removing}
        type="button"
        aria-label="Sepetten kaldır"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  );
}

/*  Skeleton  */
function CartItemSkeleton() {
  return (
    <div className="cart-item cart-item--skeleton">
      <div className="cart-item-img skeleton-box" />
      <div className="cart-item-info" style={{ gap: 8 }}>
        <div className="skeleton-line" style={{ width: "30%" }} />
        <div className="skeleton-line" style={{ width: "60%" }} />
        <div className="skeleton-line" style={{ width: "20%" }} />
      </div>
      <div className="skeleton-line" style={{ width: 80 }} />
      <div className="skeleton-line" style={{ width: 60 }} />
      <div
        className="skeleton-line"
        style={{ width: 32, height: 32, borderRadius: 8 }}
      />
    </div>
  );
}

/*  Empty State  */
function EmptyCart() {
  return (
    <div className="cart-empty">
      <div className="cart-empty-icon">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <p className="cart-empty-title">Sepetiniz boş</p>
      <p className="cart-empty-sub">
        Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.
      </p>
      <button
        className="cart-empty-btn"
        onClick={() => (window.location.href = "/dashboard")}
        type="button"
      >
        Alışverişe Başla
      </button>
    </div>
  );
}

/*  Order Summary  */
function OrderSummary({ meta, itemCount }) {
  const shipping = meta.total >= 500 ? 0 : 49.99;
  const grand = meta.total + shipping;

  return (
    <div className="cart-summary">
      <p className="cart-summary-title">Sipariş Özeti</p>

      <div className="cart-summary-rows">
        <div className="cart-summary-row">
          <span>Ürünler ({itemCount} adet)</span>
          <span>{Number(meta.total).toLocaleString("tr-TR")}₺</span>
        </div>
        <div className="cart-summary-row">
          <span>Kargo</span>
          <span className={shipping === 0 ? "cart-summary-free" : ""}>
            {shipping === 0
              ? "Ücretsiz"
              : `${shipping.toLocaleString("tr-TR")}₺`}
          </span>
        </div>
        {shipping > 0 && (
          <p className="cart-summary-shipping-note">
            {`${(500 - meta.total).toLocaleString("tr-TR")}₺ daha ekleyin, kargo ücretsiz olsun.`}
          </p>
        )}
      </div>

      <div className="cart-summary-divider" />

      <div className="cart-summary-total">
        <span>Toplam</span>
        <span>{Number(grand).toLocaleString("tr-TR")}₺</span>
      </div>

      <button className="cart-checkout-btn" type="button">
        Siparişi Tamamla
      </button>

      <button
        className="cart-continue-btn"
        type="button"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Alışverişe Devam Et
      </button>
    </div>
  );
}

/*  Main Page  */
function CartPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ itemCount: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/card`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Sepet alınamadı.");

        setItems(json.data || []);
        setMeta(json.meta || { itemCount: 0, total: 0 });
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  function handleQuantityChange(id, newQty) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
    // meta.total'i güncelle
    setMeta((prev) => {
      const updated = items.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      );
      const total = updated.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0,
      );
      return { ...prev, total, itemCount: updated.length };
    });
  }

  function handleRemove(id) {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      const total = updated.reduce(
        (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
        0,
      );
      setMeta({ itemCount: updated.length, total });
      return updated;
    });
  }

  return (
    <div className="cart-layout">
      <DashboardHeader />

      <main className="cart-main">
        {/* Hero */}
        <div className="cart-hero">
          <p className="cart-hero-eyebrow">Hesabım</p>
          <h1 className="cart-hero-title">Sepetim</h1>
          {!loading && !error && items.length > 0 && (
            <p className="cart-hero-sub">{meta.itemCount} ürün</p>
          )}
        </div>

        {error && (
          <div className="cart-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} type="button">
              Tekrar Dene
            </button>
          </div>
        )}

        {!error && (
          <div
            className={`cart-body ${!loading && items.length === 0 ? "cart-body--empty" : ""}`}
          >
            {/* Items */}
            <div className="cart-items">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))
              ) : items.length === 0 ? (
                <EmptyCart />
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </div>

            {/* Summary */}
            {!loading && items.length > 0 && (
              <OrderSummary
                meta={meta}
                itemCount={items.reduce((s, i) => s + i.quantity, 0)}
              />
            )}
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}

export default CartPage;
