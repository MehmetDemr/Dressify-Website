import { useState } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import "../styles/Settings.css";

/*  Toggle Switch  */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`stg-toggle ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="stg-toggle-thumb" />
    </button>
  );
}

/*  Section Wrapper  */
function Section({ title, description, children }) {
  return (
    <div className="stg-section">
      <div className="stg-section-head">
        <h2 className="stg-section-title">{title}</h2>
        {description && <p className="stg-section-desc">{description}</p>}
      </div>
      <div className="stg-section-body">{children}</div>
    </div>
  );
}

/*  Row  */
function Row({ label, sublabel, children }) {
  return (
    <div className="stg-row">
      <div className="stg-row-text">
        <span className="stg-row-label">{label}</span>
        {sublabel && <span className="stg-row-sublabel">{sublabel}</span>}
      </div>
      <div className="stg-row-control">{children}</div>
    </div>
  );
}

/*  Saved Card  */
function SavedCard({ last4, brand, expiry, onRemove }) {
  return (
    <div className="stg-card">
      <div className="stg-card-left">
        <div className="stg-card-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <div>
          <p className="stg-card-brand">{brand}</p>
          <p className="stg-card-number">•••• •••• •••• {last4}</p>
          <p className="stg-card-expiry">Son kullanma: {expiry}</p>
        </div>
      </div>
      <button className="stg-card-remove" onClick={onRemove} type="button">
        Kaldır
      </button>
    </div>
  );
}

/*  Address Card  */
function AddressCard({ title, address, onRemove }) {
  return (
    <div className="stg-card">
      <div className="stg-card-left">
        <div className="stg-card-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <p className="stg-card-brand">{title}</p>
          <p className="stg-card-expiry" style={{ maxWidth: 260 }}>
            {address}
          </p>
        </div>
      </div>
      <button className="stg-card-remove" onClick={onRemove} type="button">
        Kaldır
      </button>
    </div>
  );
}

/*  Nav items  */
const NAV_ITEMS = [
  {
    id: "notifications",
    label: "Bildirimler",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: "payment",
    label: "Ödeme Yöntemleri",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "addresses",
    label: "Adreslerim",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "privacy",
    label: "Gizlilik & Güvenlik",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },

  {
    id: "account",
    label: "Hesap",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/*  Main  */
function SettingsPage() {
  const [activeSection, setActiveSection] = useState("notifications");

  /* Notf */
  const [notif, setNotif] = useState({
    emailDiscount: true,
    emailOrder: true,
    emailNewProduct: false,
    smsDiscount: false,
    smsOrder: true,
    pushAll: true,
    pushFavorite: true,
  });

  /* Payment */
  const [cards, setCards] = useState([
    { id: 1, last4: "4242", brand: "Visa", expiry: "08/27" },
    { id: 2, last4: "1234", brand: "Mastercard", expiry: "03/26" },
  ]);

  /* Adress */
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Ev",
      address: "Bornova Mah. Atatürk Cad. No:12 D:3, Bornova / İzmir",
    },
    {
      id: 2,
      title: "İş",
      address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:48, Konak / İzmir",
    },
  ]);

  /* Gizlilik */
  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    loginAlert: true,
    dataSharing: false,
    activityVisible: true,
  });

  /* Görünüm */
  const [appearance, setAppearance] = useState({
    language: "tr",
    currency: "TRY",
    compactView: false,
  });

  /* Hesap */
  const [account, setAccount] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  function toggleNotif(key) {
    setNotif((p) => ({ ...p, [key]: !p[key] }));
  }

  function togglePrivacy(key) {
    setPrivacy((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="stg-layout">
      <DashboardHeader />

      <main className="stg-main">
        {/*  Page Hero  */}
        <div className="stg-hero">
          <p className="stg-hero-eyebrow">Hesabım</p>
          <h1 className="stg-hero-title">Ayarlar</h1>
        </div>

        <div className="stg-body">
          {/*  Sidebar  */}
          <aside className="stg-sidebar">
            <nav className="stg-nav">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`stg-nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="stg-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/*  Content  */}
          <div className="stg-content">
            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <>
                <Section
                  title="E-posta Bildirimleri"
                  description="Hangi konularda e-posta almak istediğinizi seçin."
                >
                  <Row
                    label="İndirim ve Kampanyalar"
                    sublabel="Özel fırsatlar ve indirim kodları"
                  >
                    <Toggle
                      checked={notif.emailDiscount}
                      onChange={() => toggleNotif("emailDiscount")}
                    />
                  </Row>
                  <Row
                    label="Sipariş Güncellemeleri"
                    sublabel="Kargo ve teslimat bildirimleri"
                  >
                    <Toggle
                      checked={notif.emailOrder}
                      onChange={() => toggleNotif("emailOrder")}
                    />
                  </Row>
                  <Row
                    label="Yeni Ürünler"
                    sublabel="Favori markalarınızın yeni koleksiyonları"
                  >
                    <Toggle
                      checked={notif.emailNewProduct}
                      onChange={() => toggleNotif("emailNewProduct")}
                    />
                  </Row>
                </Section>

                <Section
                  title="SMS Bildirimleri"
                  description="Telefon numaranıza gönderilecek bildirimler."
                >
                  <Row
                    label="İndirim ve Kampanyalar"
                    sublabel="Anlık fırsat mesajları"
                  >
                    <Toggle
                      checked={notif.smsDiscount}
                      onChange={() => toggleNotif("smsDiscount")}
                    />
                  </Row>
                  <Row
                    label="Sipariş Güncellemeleri"
                    sublabel="Kargo takip SMS'leri"
                  >
                    <Toggle
                      checked={notif.smsOrder}
                      onChange={() => toggleNotif("smsOrder")}
                    />
                  </Row>
                </Section>

                <Section
                  title="Uygulama Bildirimleri"
                  description="Tarayıcı ve mobil push bildirimleri."
                >
                  <Row
                    label="Tüm Bildirimler"
                    sublabel="Genel uygulama bildirimleri"
                  >
                    <Toggle
                      checked={notif.pushAll}
                      onChange={() => toggleNotif("pushAll")}
                    />
                  </Row>
                  <Row
                    label="Favori Ürün Fiyat Düşüşü"
                    sublabel="Favorilistenizdeki ürünler indirime girdiğinde"
                  >
                    <Toggle
                      checked={notif.pushFavorite}
                      onChange={() => toggleNotif("pushFavorite")}
                    />
                  </Row>
                </Section>
              </>
            )}

            {/* PAYMENT */}
            {activeSection === "payment" && (
              <>
                <Section
                  title="Kayıtlı Kartlar"
                  description="Hızlı ödeme için kartlarınızı yönetin."
                >
                  <div className="stg-card-list">
                    {cards.length === 0 && (
                      <p className="stg-empty-note">Kayıtlı kart bulunmuyor.</p>
                    )}
                    {cards.map((card) => (
                      <SavedCard
                        key={card.id}
                        {...card}
                        onRemove={() =>
                          setCards((p) => p.filter((c) => c.id !== card.id))
                        }
                      />
                    ))}
                  </div>
                  <button className="stg-add-btn" type="button">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Yeni Kart Ekle
                  </button>
                </Section>

                <Section
                  title="Fatura Tercihleri"
                  description="Varsayılan fatura tipinizi seçin."
                >
                  <Row
                    label="E-Fatura"
                    sublabel="Faturalar e-posta adresinize gönderilsin"
                  >
                    <Toggle checked={true} onChange={() => {}} />
                  </Row>
                  <Row
                    label="Kurumsal Fatura"
                    sublabel="Şirket adına fatura kesilsin"
                  >
                    <Toggle checked={false} onChange={() => {}} />
                  </Row>
                </Section>
              </>
            )}

            {/* ADDRESSES */}
            {activeSection === "addresses" && (
              <Section
                title="Adreslerim"
                description="Teslimat adreslerinizi ekleyin ve yönetin."
              >
                <div className="stg-card-list">
                  {addresses.length === 0 && (
                    <p className="stg-empty-note">Kayıtlı adres bulunmuyor.</p>
                  )}
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      {...addr}
                      onRemove={() =>
                        setAddresses((p) => p.filter((a) => a.id !== addr.id))
                      }
                    />
                  ))}
                </div>
                <button className="stg-add-btn" type="button">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Yeni Adres Ekle
                </button>
              </Section>
            )}

            {/* PRIVACY */}
            {activeSection === "privacy" && (
              <>
                <Section
                  title="Güvenlik"
                  description="Hesabınızın güvenliğini artırın."
                >
                  <Row
                    label="İki Faktörlü Doğrulama"
                    sublabel="Giriş yaparken SMS ile doğrulama kodu"
                  >
                    <Toggle
                      checked={privacy.twoFactor}
                      onChange={() => togglePrivacy("twoFactor")}
                    />
                  </Row>
                  <Row
                    label="Yeni Giriş Bildirimi"
                    sublabel="Hesabınıza yeni giriş yapıldığında e-posta al"
                  >
                    <Toggle
                      checked={privacy.loginAlert}
                      onChange={() => togglePrivacy("loginAlert")}
                    />
                  </Row>
                </Section>

                <Section
                  title="Veri & Gizlilik"
                  description="Verilerinizin nasıl kullanılacağını kontrol edin."
                >
                  <Row
                    label="Veri Paylaşımı"
                    sublabel="Kişiselleştirilmiş deneyim için anonim kullanım verileri"
                  >
                    <Toggle
                      checked={privacy.dataSharing}
                      onChange={() => togglePrivacy("dataSharing")}
                    />
                  </Row>
                  <Row
                    label="Profil Görünürlüğü"
                    sublabel="Diğer kullanıcılar profil bilgilerinizi görebilsin"
                  >
                    <Toggle
                      checked={privacy.activityVisible}
                      onChange={() => togglePrivacy("activityVisible")}
                    />
                  </Row>
                </Section>

                <Section title="Tehlikeli Alan">
                  <div className="stg-danger-zone">
                    <div>
                      <p className="stg-danger-label">Hesabı Sil</p>
                      <p className="stg-danger-sub">
                        Tüm verileriniz kalıcı olarak silinir, bu işlem geri
                        alınamaz.
                      </p>
                    </div>
                    <button className="stg-danger-btn" type="button">
                      Hesabı Sil
                    </button>
                  </div>
                </Section>
              </>
            )}

            {/* APPEARANCE */}
            {activeSection === "appearance" && (
              <>
                <Section
                  title="Dil & Para Birimi"
                  description="Tercih ettiğiniz dil ve para birimini seçin."
                >
                  <Row label="Dil" sublabel="Arayüz dilini seçin">
                    <select
                      className="stg-select"
                      value={appearance.language}
                      onChange={(e) =>
                        setAppearance((p) => ({
                          ...p,
                          language: e.target.value,
                        }))
                      }
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </Row>
                  <Row
                    label="Para Birimi"
                    sublabel="Fiyatların gösterileceği para birimi"
                  >
                    <select
                      className="stg-select"
                      value={appearance.currency}
                      onChange={(e) =>
                        setAppearance((p) => ({
                          ...p,
                          currency: e.target.value,
                        }))
                      }
                    >
                      <option value="TRY">₺ Türk Lirası</option>
                      <option value="USD">$ Dolar</option>
                      <option value="EUR">€ Euro</option>
                    </select>
                  </Row>
                </Section>

                <Section
                  title="Görüntüleme"
                  description="Ürün listesi görünümünü özelleştirin."
                >
                  <Row
                    label="Kompakt Görünüm"
                    sublabel="Ürün kartlarını daha küçük göster"
                  >
                    <Toggle
                      checked={appearance.compactView}
                      onChange={(v) =>
                        setAppearance((p) => ({ ...p, compactView: v }))
                      }
                    />
                  </Row>
                </Section>
              </>
            )}

            {/* ACCOUNT */}
            {activeSection === "account" && (
              <>
                <Section
                  title="Şifre Değiştir"
                  description="Güvenliğiniz için şifrenizi düzenli olarak güncelleyin."
                >
                  <div className="stg-form">
                    <div className="stg-field">
                      <label className="stg-label">Mevcut Şifre</label>
                      <input
                        type="password"
                        className="stg-input"
                        placeholder="••••••••"
                        value={account.currentPassword}
                        onChange={(e) =>
                          setAccount((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="stg-field">
                      <label className="stg-label">Yeni Şifre</label>
                      <input
                        type="password"
                        className="stg-input"
                        placeholder="••••••••"
                        value={account.newPassword}
                        onChange={(e) =>
                          setAccount((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="stg-field">
                      <label className="stg-label">Yeni Şifre Tekrar</label>
                      <input
                        type="password"
                        className="stg-input"
                        placeholder="••••••••"
                        value={account.newPasswordConfirm}
                        onChange={(e) =>
                          setAccount((p) => ({
                            ...p,
                            newPasswordConfirm: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button className="stg-save-btn" type="button">
                      Şifreyi Güncelle
                    </button>
                  </div>
                </Section>

                <Section
                  title="Oturum Yönetimi"
                  description="Aktif oturumlarınızı görün ve yönetin."
                >
                  <div className="stg-session">
                    <div className="stg-session-info">
                      <div className="stg-session-dot active" />
                      <div>
                        <p className="stg-session-device">Chrome — Windows</p>
                        <p className="stg-session-time">
                          Şu an aktif · İzmir, TR
                        </p>
                      </div>
                    </div>
                    <span className="stg-session-badge">Bu cihaz</span>
                  </div>
                  <button
                    className="stg-danger-btn"
                    type="button"
                    style={{ marginTop: 16 }}
                  >
                    Tüm Oturumları Kapat
                  </button>
                </Section>
              </>
            )}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

export default SettingsPage;
