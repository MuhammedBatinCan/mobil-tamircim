// MOBİL TAMİRCİM - KULLANICI KİMLİK, KAYIT, GİRİŞ & ROZET YÖNETİMİ

const Auth = {
  currentUser: null,
  allUsers: [],
  pendingVerifyUser: null,
  verifyCountdownTimer: null,
  verifySecondsLeft: 60,

  init(stateUsers) {
    this.allUsers = stateUsers || [];

    // Check "Beni Unutma" (localStorage) or Session (sessionStorage)
    const localUser = localStorage.getItem('mobil_tamircim_user');
    const sessionUser = sessionStorage.getItem('mobil_tamircim_user');

    let targetUser = null;
    if (localUser) {
      try { targetUser = JSON.parse(localUser); } catch(e){}
    } else if (sessionUser) {
      try { targetUser = JSON.parse(sessionUser); } catch(e){}
    }

    if (targetUser) {
      // Find latest user state from server
      const match = this.allUsers.find(u => u.id === targetUser.id);
      this.currentUser = match || targetUser;
    } else {
      // Default to Ahmet Usta for demo convenience
      this.currentUser = this.allUsers.find(u => u.role === 'mechanic') || this.allUsers[0];
    }

    this.updateUserUI();
  },

  // Giriş Yap (Login: Kullanıcı Adı, E-Posta veya Plaka ile)
  async login(username, password, rememberMe = true) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        this.currentUser = data.user;
        
        // Beni Unutma / Hatırla Yönetimi
        if (rememberMe) {
          localStorage.setItem('mobil_tamircim_user', JSON.stringify(data.user));
          sessionStorage.removeItem('mobil_tamircim_user');
        } else {
          sessionStorage.setItem('mobil_tamircim_user', JSON.stringify(data.user));
          localStorage.removeItem('mobil_tamircim_user');
        }

        this.updateUserUI();
        if (window.App && typeof window.App.refreshCurrentView === 'function') {
          window.App.refreshCurrentView();
        }

        showToast(`Hoş geldiniz, ${data.user.name}`);
        closeModal('auth-modal');
        return { success: true };
      } else {
        showToast(data.error || 'Giriş başarısız!', 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast('Sunucu bağlantı hatası!', 'error');
      return { success: false, error: 'Bağlantı hatası' };
    }
  },

  // Yeni Kayıt Ol (Register - E-Posta & Doğrulama Entegre)
  async register(formData, rememberMe = true) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        this.allUsers.push(data.user);
        this.currentUser = data.user;

        // Beni Unutma / Hatırla
        if (rememberMe) {
          localStorage.setItem('mobil_tamircim_user', JSON.stringify(data.user));
          sessionStorage.removeItem('mobil_tamircim_user');
        } else {
          sessionStorage.setItem('mobil_tamircim_user', JSON.stringify(data.user));
          localStorage.removeItem('mobil_tamircim_user');
        }

        this.updateUserUI();
        if (window.App) {
          window.App.renderUserSwitcherOptions();
          window.App.refreshCurrentView();
        }

        closeModal('auth-modal');

        // E-Posta Doğrulama Modalı Aç
        if (data.requiresEmailVerification) {
          this.openVerifyModal(data.user, data.verificationCode);
          showToast(`Kayıt alındı. Doğrulama kodu ${data.user.email} adresine iletildi.`);
          return { success: true, requiresVerification: true };
        } else {
          showToast(`Kayıt başarılı. Hoş geldiniz ${data.user.name}`);
          return { success: true };
        }
      } else {
        showToast(data.error || 'Kayıt oluşturulamadı!', 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast('Bağlantı hatası!', 'error');
      return { success: false, error: 'Bağlantı hatası' };
    }
  },

  // E-Posta Doğrulama Modalı Aç
  openVerifyModal(user, demoCode = '') {
    this.pendingVerifyUser = user;
    const emailEl = document.getElementById('verify-modal-email');
    if (emailEl) emailEl.textContent = user.email || '';

    const demoCodeEl = document.getElementById('verify-demo-code-val');
    if (demoCodeEl) {
      demoCodeEl.textContent = demoCode || user.emailVerificationCode || '123456';
    }

    const input = document.getElementById('verify-code-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }

    this.startVerifyCountdown(60);
    openModal('email-verify-modal');
  },

  openVerifyModalForUser(userId) {
    const user = this.allUsers.find(u => u.id === userId) || this.currentUser;
    if (!user) return;
    this.openVerifyModal(user, user.emailVerificationCode || '123456');
    this.resendVerificationCode(false);
  },

  // Demo Kodu Otomatik Doldur
  fillDemoVerifyCode() {
    const demoCodeEl = document.getElementById('verify-demo-code-val');
    const input = document.getElementById('verify-code-input');
    if (input && demoCodeEl) {
      const code = demoCodeEl.textContent.trim() || '123456';
      input.value = code;
      input.focus();
      showToast('Doğrulama kodu dolduruldu.');
    }
  },

  // 60 Saniye Geri Sayım
  startVerifyCountdown(seconds = 60) {
    if (this.verifyCountdownTimer) {
      clearInterval(this.verifyCountdownTimer);
    }
    this.verifySecondsLeft = seconds;
    const btn = document.getElementById('verify-resend-btn');
    const timerText = document.getElementById('verify-countdown-timer');

    if (btn) btn.disabled = true;
    if (timerText) timerText.textContent = `${this.verifySecondsLeft}s`;

    this.verifyCountdownTimer = setInterval(() => {
      this.verifySecondsLeft--;
      if (timerText) timerText.textContent = `${this.verifySecondsLeft}s`;

      if (this.verifySecondsLeft <= 0) {
        clearInterval(this.verifyCountdownTimer);
        this.verifyCountdownTimer = null;
        if (btn) btn.disabled = false;
        if (timerText) timerText.textContent = 'Hazır';
      }
    }, 1000);
  },

  // Yeni Kod Gönder (Resend)
  async resendVerificationCode(showToastMsg = true) {
    const user = this.pendingVerifyUser || this.currentUser;
    if (!user) return;

    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      });
      const data = await res.json();
      if (data.success) {
        const demoCodeEl = document.getElementById('verify-demo-code-val');
        if (demoCodeEl && data.verificationCode) {
          demoCodeEl.textContent = data.verificationCode;
        }
        this.startVerifyCountdown(60);
        if (showToastMsg) {
          showToast(`${user.email} adresine yeni 6 haneli kod gönderildi.`);
        }
      } else {
        showToast(data.error || 'Kod gönderilemedi.', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası!', 'error');
    }
  },

  // 6 Haneli Kodu Doğrula (Verify Email)
  async verifyEmail(code) {
    const user = this.pendingVerifyUser || this.currentUser;
    if (!user) {
      showToast('Kullanıcı oturumu bulunamadı.', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          code: code
        })
      });

      const data = await res.json();
      if (data.success) {
        if (this.verifyCountdownTimer) {
          clearInterval(this.verifyCountdownTimer);
          this.verifyCountdownTimer = null;
        }

        const updatedUser = data.user;
        const idx = this.allUsers.findIndex(u => u.id === updatedUser.id);
        if (idx !== -1) this.allUsers[idx] = updatedUser;
        this.currentUser = updatedUser;

        if (localStorage.getItem('mobil_tamircim_user')) {
          localStorage.setItem('mobil_tamircim_user', JSON.stringify(updatedUser));
        } else if (sessionStorage.getItem('mobil_tamircim_user')) {
          sessionStorage.setItem('mobil_tamircim_user', JSON.stringify(updatedUser));
        }

        this.updateUserUI();
        if (window.App) {
          window.App.renderUserSwitcherOptions();
          window.App.refreshCurrentView();
        }

        closeModal('email-verify-modal');
        showToast(data.message || 'E-posta başarıyla doğrulandı.');
        return true;
      } else {
        showToast(data.error || 'Doğrulama başarısız!', 'error');
        return false;
      }
    } catch (err) {
      showToast('Bağlantı hatası oluştu.', 'error');
      return false;
    }
  },

  // Çıkış Yap (Logout)
  logout() {
    localStorage.removeItem('mobil_tamircim_user');
    sessionStorage.removeItem('mobil_tamircim_user');
    // Set to a guest/normal user or open login modal
    this.currentUser = this.allUsers.find(u => u.role === 'user') || this.allUsers[0];
    this.updateUserUI();
    if (window.App && typeof window.App.refreshCurrentView === 'function') {
      window.App.refreshCurrentView();
    }
    showToast('Oturum kapatıldı.');
  },

  // Şifre Göster / Gizle Göz Butonu
  togglePassword(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      btnEl.innerHTML = 'Gizle';
      btnEl.title = 'Şifreyi Gizle';
    } else {
      input.type = 'password';
      btnEl.innerHTML = 'Göster';
      btnEl.title = 'Şifreyi Göster';
    }
  },

  switchUser(userId) {
    const user = this.allUsers.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('mobil_tamircim_user', JSON.stringify(user));
      this.updateUserUI();
      if (window.App && typeof window.App.refreshCurrentView === 'function') {
        window.App.refreshCurrentView();
      }
      showToast(`Aktif Kullanıcı: ${user.name} (${user.role})`);
    }
  },

  getUserById(userId) {
    return this.allUsers.find(u => u.id === userId);
  },

  isMechanic(user = this.currentUser) {
    if (!user) return false;
    return user.role === 'mechanic' || (user.badges && user.badges.includes('verified_mechanic'));
  },

  isDealer(user = this.currentUser) {
    if (!user) return false;
    return user.role === 'dealer' || (user.badges && user.badges.includes('verified_dealer'));
  },

  isDeveloper(user = this.currentUser) {
    if (!user) return false;
    return user.role === 'developer' || (user.badges && user.badges.includes('developer'));
  },

  isBetaTester(user = this.currentUser) {
    if (!user) return false;
    return user.badges && user.badges.includes('beta_tester');
  },

  isAdmin(user = this.currentUser) {
    if (!user) return false;
    return user.role === 'admin';
  },

  // HTML Plaka Oluşturucu (Kaldırıldı)
  renderPlate(plate, size = '') {
    return '';
  },

  // HTML Rozetler Oluşturucu (Sade & Prestijli)
  renderBadges(badges = [], showLevel = null) {
    let html = '';
    if (Array.isArray(badges)) {
      if (badges.includes('verified_mechanic')) {
        html += `<span class="badge badge-mechanic" title="Doğrulanmış Sanayi Tamircisi">Onaylı Usta</span>`;
      } else if (badges.includes('developer')) {
        html += `<span class="badge badge-developer" title="Platform Geliştiricisi">Geliştirici</span>`;
      } else if (badges.includes('verified_dealer')) {
        html += `<span class="badge badge-dealer" title="Yetki Belgeli Otomotiv Galericisi">Yetkili Galerici</span>`;
      } else if (badges.includes('verified_user')) {
        html += `<span class="badge badge-verified" title="Doğrulanmış Araç Sahibi">Doğrulanmış Üye</span>`;
      }
    }
    return html;
  },

  updateUserUI() {
    const u = this.currentUser;
    if (!u) return;

    // Header mini profile
    const avatarEl = document.getElementById('header-avatar');
    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const plateContainer = document.getElementById('header-user-plate');

    if (avatarEl) avatarEl.src = u.avatar;
    if (nameEl) nameEl.textContent = u.name;
    if (roleEl) {
      let roleDesc = 'Araç Sahibi';
      if (this.isMechanic(u)) roleDesc = 'Onaylı Usta';
      else if (this.isDeveloper(u)) roleDesc = 'Geliştirici';
      else if (this.isDealer(u)) roleDesc = 'Yetkili Galerici';
      else if (this.isAdmin(u)) roleDesc = 'Yönetici';
      roleEl.textContent = roleDesc;
    }
    if (plateContainer) {
      plateContainer.innerHTML = this.renderPlate(u.plate, 'sm');
    }

    // Sidebar full profile
    const sbAvatar = document.getElementById('sidebar-avatar');
    const sbName = document.getElementById('sidebar-name');
    const sbUsername = document.getElementById('sidebar-username');
    const sbPlate = document.getElementById('sidebar-plate');
    const sbCar = document.getElementById('sidebar-car');
    const sbBadges = document.getElementById('sidebar-badges');
    const sbXp = document.getElementById('sidebar-xp');
    const sbBar = document.getElementById('sidebar-progress-bar');
    const sbNextLevel = document.getElementById('sidebar-next-level');

    if (sbAvatar) sbAvatar.src = u.avatar;
    if (sbName) sbName.textContent = u.name;
    if (sbUsername) sbUsername.textContent = '@' + u.username;
    if (sbPlate) sbPlate.innerHTML = this.renderPlate(u.plate);
    if (sbCar) sbCar.textContent = u.car || 'Araç tanımlanmadı';
    if (sbBadges) {
      let bHtml = this.renderBadges(u.badges, u.level);
      if (u.isEmailVerified === false) {
        bHtml += ` <button type="button" class="badge" style="background:rgba(245,158,11,0.12); color:#FCD34D; border:1px solid rgba(245,158,11,0.3); cursor:pointer; font-weight:600; margin-left:4px;" onclick="Auth.openVerifyModalForUser('${u.id}')" title="Hesabınızı aktifleştirmek için e-postanızı doğrulayın">E-Postayı Doğrula</button>`;
      }
      sbBadges.innerHTML = bHtml;
    }

    const pts = u.reputationPoints || 0;
    if (sbXp) sbXp.textContent = pts >= 500 ? 'Yüksek İtibar' : 'Aktif Üye';
    if (sbBar) sbBar.style.display = 'none';
    if (sbNextLevel) sbNextLevel.style.display = 'none';
  }
};

// Global Export
window.Auth = Auth;
