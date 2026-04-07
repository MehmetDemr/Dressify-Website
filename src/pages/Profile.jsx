import { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/Profile.css";

function ProfilePage() {
  const [user, setUser] = useState(null);

  // Form states
  const [personalForm, setPersonalForm] = useState({
    userName: "",
    gender: "",
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmPassword: "",
  });
  const [phoneForm, setPhoneForm] = useState({ newPhone: "" });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPw: "",
    confirm: "",
  });
  const [pwStrength, setPwStrength] = useState({ score: 0, label: "" });

  // Toast states
  const [toasts, setToasts] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setUser(json.data);
          setPersonalForm({
            userName: json.data.userName || "",
            gender: json.data.gender || "",
          });
          setPhoneForm({ newPhone: json.data.phone || "" });
        }
      } catch (err) {
        console.error("Kullanıcı bilgisi alınamadı:", err);
      }
    }
    fetchUser();
  }, []);

  function showToast(key) {
    setToasts((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setToasts((prev) => ({ ...prev, [key]: false })), 3000);
  }

  function checkPwStrength(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const labels = ["", "Çok zayıf", "Zayıf", "Orta", "Güçlü"];
    setPwStrength({ score, label: val ? labels[score] || "Çok zayıf" : "" });
  }

  function getInitials() {
    if (user?.userName?.length >= 2)
      return user.userName.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return "..";
  }

  function formatDate(dateStr, withTime = false) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
  }

  const strengthClass =
    ["", "weak", "weak", "medium", "strong"][pwStrength.score] || "";

  // Handlers (API entegrasyonu için)
  async function handlePersonalSave() {
    // PUT /user/me => { userName, gender }
    showToast("personal");
  }

  async function handleEmailSave() {
    // PUT /user/email => { newEmail, confirmPassword }
    showToast("email");
  }

  async function handlePhoneSave() {
    // PUT /user/phone => { newPhone }
    showToast("phone");
  }

  async function handlePasswordSave() {
    if (passwordForm.newPw !== passwordForm.confirm) return;
    // PUT /user/password => { current, newPw }
    showToast("password");
  }

  return (
    <>
      <DashboardHeader />

      <main className="profile-page">
        <div className="profile-wrap">
          <p className="profile-section-title">Hesap Ayarları</p>

          <div className="profile-grid">
            {/* Sidebar */}
            <aside className="profile-sidebar">
              <div className="profile-avatar">{getInitials()}</div>
              <p className="profile-display-name">{user?.userName ?? "—"}</p>
              <p className="profile-display-email">{user?.email ?? "—"}</p>
              <span className="profile-badge">
                {user?.userType === "standart_user"
                  ? "Standart"
                  : (user?.userType ?? "—")}
              </span>
              <div className="profile-divider" />
              <ul className="profile-stats">
                <li className="stat-row">
                  <span className="stat-label">Durum</span>
                  <span className="stat-value">
                    <span
                      className={`status-dot ${user?.active ? "active" : "inactive"}`}
                    />
                    {user?.active ? "Aktif" : "Pasif"}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Rol</span>
                  <span className="role-pill">{user?.role ?? "—"}</span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Cinsiyet</span>
                  <span className="stat-value">
                    {user?.gender === "male"
                      ? "Erkek"
                      : user?.gender === "female"
                        ? "Kadın"
                        : "—"}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Son giriş</span>
                  <span className="stat-value">
                    {formatDate(user?.lastLogin, true)}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">İlk giriş</span>
                  <span className="stat-value">
                    {formatDate(user?.firstLogin, true)}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Kayıt tarihi</span>
                  <span className="stat-value">
                    {formatDate(user?.createdAt)}
                  </span>
                </li>
         
              </ul>
            </aside>

            {/* Ana içerik */}
            <div className="profile-main">
              {/* Kişisel Bilgiler */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Kişisel Bilgiler
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Kullanıcı adı</label>
                    <input
                      type="text"
                      value={personalForm.userName}
                      onChange={(e) =>
                        setPersonalForm((p) => ({
                          ...p,
                          userName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Cinsiyet</label>
                    <select
                      value={personalForm.gender}
                      onChange={(e) =>
                        setPersonalForm((p) => ({
                          ...p,
                          gender: e.target.value,
                        }))
                      }
                    >
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                      <option value="other">Belirtmek istemiyorum</option>
                    </select>
                  </div>
                </div>
                <button className="save-btn" onClick={handlePersonalSave}>
                  Kaydet
                </button>
                {toasts.personal && (
                  <div className="success-toast">Bilgiler güncellendi.</div>
                )}
              </div>

              {/* E-posta */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    E-posta Adresi
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mevcut e-posta</label>
                    <input type="email" value={user?.email ?? ""} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Yeni e-posta</label>
                    <input
                      type="email"
                      placeholder="yeni@email.com"
                      value={emailForm.newEmail}
                      onChange={(e) =>
                        setEmailForm((p) => ({
                          ...p,
                          newEmail: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group form-full">
                    <label>Şifre (doğrulama için)</label>
                    <input
                      type="password"
                      placeholder="Mevcut şifrenizi girin"
                      value={emailForm.confirmPassword}
                      onChange={(e) =>
                        setEmailForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button className="save-btn" onClick={handleEmailSave}>
                  E-postayı Güncelle
                </button>
                {toasts.email && (
                  <div className="success-toast">E-posta güncellendi.</div>
                )}
              </div>

              {/* Telefon */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.79 16l.13.92z" />
                    </svg>
                    Telefon Numarası
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mevcut numara</label>
                    <input type="tel" value={user?.phone ?? ""} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Yeni numara</label>
                    <input
                      type="tel"
                      placeholder="05xx xxx xx xx"
                      value={phoneForm.newPhone}
                      onChange={(e) =>
                        setPhoneForm({ newPhone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button className="save-btn" onClick={handlePhoneSave}>
                  Telefonu Güncelle
                </button>
                {toasts.phone && (
                  <div className="success-toast">
                    Telefon numarası güncellendi.
                  </div>
                )}
              </div>

              {/* Şifre */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Şifre Değiştir
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group form-full">
                    <label>Mevcut şifre</label>
                    <input
                      type="password"
                      placeholder="Mevcut şifrenizi girin"
                      value={passwordForm.current}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          current: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Yeni şifre</label>
                    <input
                      type="password"
                      placeholder="En az 8 karakter"
                      value={passwordForm.newPw}
                      onChange={(e) => {
                        setPasswordForm((p) => ({
                          ...p,
                          newPw: e.target.value,
                        }));
                        checkPwStrength(e.target.value);
                      }}
                    />
                    <div className="pw-strength">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`pw-bar ${i <= pwStrength.score ? strengthClass : ""}`}
                        />
                      ))}
                    </div>
                    {pwStrength.label && (
                      <span className={`pw-hint pw-hint--${strengthClass}`}>
                        {pwStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Şifre tekrar</label>
                    <input
                      type="password"
                      placeholder="Yeni şifrenizi tekrar girin"
                      value={passwordForm.confirm}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          confirm: e.target.value,
                        }))
                      }
                    />
                    {passwordForm.confirm &&
                      passwordForm.newPw !== passwordForm.confirm && (
                        <span className="pw-hint pw-hint--weak">
                          Şifreler eşleşmiyor
                        </span>
                      )}
                  </div>
                </div>
                <button className="save-btn" onClick={handlePasswordSave}>
                  Şifreyi Güncelle
                </button>
                {toasts.password && (
                  <div className="success-toast">
                    Şifre başarıyla değiştirildi.
                  </div>
                )}
              </div>

              {/* Tehlikeli Bölge */}
              <div className="profile-card profile-card--danger">
                <div className="card-header">
                  <span className="card-title card-title--danger">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Tehlikeli Bölge
                  </span>
                </div>
                <p className="danger-info">
                  Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz
                  kalıcı olarak kaldırılır.
                </p>
                <button className="save-btn save-btn--danger">
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </>
  );
}

export default ProfilePage;
