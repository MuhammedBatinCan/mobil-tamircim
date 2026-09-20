// MOBİL TAMİRCİM - TWITTER / X TARZI KAPSAMLI PROFİL MODÜLÜ

const Profile = {
  activeUserId: null,
  activeTab: 'threads', // 'threads', 'replies', 'garage', 'solutions', 'badges'
  followingMap: {}, // Takip edilen kullanıcılar

  init() {
    // Sayfa ilk açılışta veya oturum değiştiğinde profil modülü hazır olsun
  },

  open(userId) {
    if (!userId) {
      if (Auth && Auth.currentUser) {
        userId = Auth.currentUser.id;
      } else if (App.state && App.state.users && App.state.users.length > 0) {
        userId = App.state.users[0].id;
      }
    }

    this.activeUserId = userId;
    this.activeTab = 'threads';
    this.render();
    App.switchView('view-profile');
  },

  getUser() {
    if (!App.state || !App.state.users) return null;
    return App.state.users.find(u => u.id === this.activeUserId) || Auth.currentUser || App.state.users[0];
  },

  render() {
    const user = this.getUser();
    if (!user) return;

    const isOwn = Auth.currentUser && Auth.currentUser.id === user.id;

    // 1. Top Bar (Twitter header)
    const topName = document.getElementById('profile-top-name');
    const topCount = document.getElementById('profile-top-count');
    
    // Kullanıcının konuları ve yorumları
    const userThreads = (Forum.threads || []).filter(t => t.authorId === user.id || t.authorUsername === user.username);
    let userComments = [];
    (Forum.threads || []).forEach(t => {
      if (Array.isArray(t.comments)) {
        t.comments.forEach(c => {
          if (c.authorId === user.id || c.authorUsername === user.username) {
            userComments.push({ ...c, threadId: t.id, threadTitle: t.title, threadBrand: t.brand });
          }
        });
      }
    });

    if (topName) topName.textContent = user.name || user.username;
    if (topCount) topCount.textContent = `${userThreads.length} Konu • ${userComments.length} Yanıt`;

    // 2. Banner & Avatar
    const bannerEl = document.getElementById('profile-cover-banner');
    if (bannerEl) {
      const defaultBanner = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80';
      bannerEl.style.backgroundImage = `linear-gradient(to bottom, rgba(11,15,23,0.1), rgba(11,15,23,0.85)), url('${user.banner || defaultBanner}')`;
    }

    const avatarEl = document.getElementById('profile-avatar-img');
    if (avatarEl) {
      avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    }

    // 3. Action Buttons (Profili Düzenle veya Takip Et)
    const actionsContainer = document.getElementById('profile-actions-wrap');
    if (actionsContainer) {
      if (isOwn) {
        actionsContainer.innerHTML = `
          <button class="btn btn-secondary btn-sm" onclick="Profile.openEditModal()" style="font-weight:600; font-size:0.84rem; padding:6px 14px; border-radius:20px;">
            Profili Düzenle
          </button>
          <button class="btn btn-secondary btn-sm" onclick="openModal('user-switcher-modal')" title="Hesap Değiştir" style="font-weight:600; font-size:0.84rem; padding:6px 12px; border-radius:20px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7.5" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            Hesap Değiştir
          </button>
        `;
      } else {
        const isFollowing = this.followingMap[user.id] || false;
        actionsContainer.innerHTML = `
          <button class="btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="Profile.toggleFollow('${user.id}')" style="font-weight:600; font-size:0.84rem; padding:6px 18px; border-radius:20px;">
            ${isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showToast('${escapeHtml(user.name)} ustaya özel mesaj özelliği yakında aktif edilecek!', 'info')" title="Mesaj Gönder" style="border-radius:20px; padding:6px 12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </button>
        `;
      }
    }

    // 4. User Info Block
    const nameEl = document.getElementById('profile-name-text');
    if (nameEl) {
      let badgeIcon = '';
      if (user.role === 'developer') {
        badgeIcon = `<span class="profile-verified-badge badge-dev" title="Mobil Tamircim Baş Mimarı">⚡ Geliştirici</span>`;
      } else if (user.isMechanicVerified || user.role === 'mechanic') {
        badgeIcon = `<span class="profile-verified-badge badge-mech" title="Onaylı Sanayi Ustası">✓ Onaylı Usta</span>`;
      } else if (user.isDealerVerified || user.role === 'dealer') {
        badgeIcon = `<span class="profile-verified-badge badge-dealer" title="Onaylı Otomotiv Bayisi">✓ Yetkili Galeri</span>`;
      } else {
        badgeIcon = `<span class="profile-verified-badge badge-user" title="Doğrulanmış Sürücü">✓ Sürücü</span>`;
      }
      nameEl.innerHTML = `${escapeHtml(user.name || user.username)} ${badgeIcon}`;
    }

    const handleEl = document.getElementById('profile-handle-text');
    if (handleEl) handleEl.textContent = `@${user.username}`;

    const bioEl = document.getElementById('profile-bio-text');
    if (bioEl) {
      bioEl.textContent = user.bio || 'Mobil Tamircim topluluğunda otomobil ve mekanik tecrübelerini paylaşıyor.';
    }

    // Meta items
    const metaGrid = document.getElementById('profile-meta-grid');
    if (metaGrid) {
      let metaHtml = '';
      
      if (user.city) {
        metaHtml += `
          <div class="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${escapeHtml(user.city)}${user.district ? ', ' + escapeHtml(user.district) : ''}</span>
          </div>
        `;
      }

      if (user.car) {
        metaHtml += `
          <div class="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span style="color:var(--accent-amber); font-weight:600;">${escapeHtml(user.car)}</span>
          </div>
        `;
      }

      if (user.shopName || user.dealerName) {
        metaHtml += `
          <div class="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>${escapeHtml(user.shopName || user.dealerName)} ${user.sanayiSite ? `• ${escapeHtml(user.sanayiSite)}` : ''}</span>
          </div>
        `;
      }

      metaHtml += `
        <div class="profile-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>Eylül 2024 tarihinde katıldı</span>
        </div>
      `;

      metaGrid.innerHTML = metaHtml;
    }

    // Stats row (Twitter style)
    const statsRow = document.getElementById('profile-stats-row');
    if (statsRow) {
      const userSolutionsCount = (Forum.threads || []).filter(t => t.solvedByUserId === user.id).length;
      statsRow.innerHTML = `
        <div class="profile-stat-item">
          <span class="stat-count">${14 + (user.reputationPoints % 5)}</span>
          <span class="stat-label">Takip Edilen</span>
        </div>
        <div class="profile-stat-item">
          <span class="stat-count">${48 + Math.floor((user.reputationPoints || 0) / 15)}</span>
          <span class="stat-label">Takipçi</span>
        </div>
        <div class="profile-stat-item">
          <span class="stat-count" style="color:var(--accent-amber);">${user.reputationPoints || 0}</span>
          <span class="stat-label">İtibar (XP)</span>
        </div>
        <div class="profile-stat-item">
          <span class="stat-count" style="color:#10B981;">${userSolutionsCount || (user.isMechanicVerified ? 8 : 1)}</span>
          <span class="stat-label">Çözülen Arıza</span>
        </div>
      `;
    }

    // 5. Update Tab Buttons Text
    const tabThreadsBtn = document.getElementById('ptab-btn-threads');
    const tabRepliesBtn = document.getElementById('ptab-btn-replies');
    const tabGarageBtn = document.getElementById('ptab-btn-garage');
    const tabSolutionsBtn = document.getElementById('ptab-btn-solutions');
    const tabBadgesBtn = document.getElementById('ptab-btn-badges');

    if (tabThreadsBtn) tabThreadsBtn.textContent = `Konular (${userThreads.length})`;
    if (tabRepliesBtn) tabRepliesBtn.textContent = `Yanıtlar (${userComments.length})`;
    if (tabGarageBtn) tabGarageBtn.textContent = `Garajım`;
    if (tabSolutionsBtn) tabSolutionsBtn.textContent = `Çözümler`;
    if (tabBadgesBtn) tabBadgesBtn.textContent = `Rozetler (${(user.badges || []).length})`;

    // 6. Render Tab Content
    this.renderTabContent();
  },

  setTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.renderTabContent();
  },

  renderTabContent() {
    const container = document.getElementById('profile-feed-content');
    if (!container) return;

    const user = this.getUser();
    if (!user) return;

    if (this.activeTab === 'threads') {
      const userThreads = (Forum.threads || []).filter(t => t.authorId === user.id || t.authorUsername === user.username);
      if (userThreads.length === 0) {
        container.innerHTML = `
          <div class="profile-empty-state">
            <div class="empty-icon">💬</div>
            <h3>Henüz Konu Açılmamış</h3>
            <p>${escapeHtml(user.name)} henüz forumda bir arıza veya danışma konusu paylaşmadı.</p>
            ${Auth.currentUser && Auth.currentUser.id === user.id ? `
              <button class="btn btn-primary btn-sm" onclick="openModal('new-thread-modal')" style="margin-top:12px;">
                İlk Konunu Başlat
              </button>
            ` : ''}
          </div>
        `;
        return;
      }

      container.innerHTML = userThreads.map(t => `
        <article class="thread-row ${t.isSolved ? 'is-solved' : ''}" onclick="Forum.openThread('${t.id}')">
          <div class="thread-reply-col">
            <span class="reply-num">${t.commentsCount || 0}</span>
            <span class="reply-text">yanıt</span>
          </div>
          <div class="thread-body-col">
            <div class="thread-title-line">
              ${t.isSolved ? '<span class="status-pill-solved">Çözüldü</span>' : ''}
              <h3 class="thread-title-heading">${escapeHtml(t.title)}</h3>
            </div>
            <p class="thread-preview-text">${escapeHtml(t.content)}</p>
            <div class="thread-info-bar">
              ${t.brand ? `<span class="thread-vehicle-tag">${escapeHtml(t.brand)} ${escapeHtml(t.model || '')}</span>` : ''}
              ${t.obdCode ? `<span class="thread-obd-tag">${escapeHtml(t.obdCode)}</span>` : ''}
              ${t.audioUrl ? `<span class="thread-audio-tag">Ses Kaydı</span>` : ''}
              <span class="thread-time-tag">${formatDate(t.createdAt)}</span>
            </div>
          </div>
        </article>
      `).join('');

    } else if (this.activeTab === 'replies') {
      let userComments = [];
      (Forum.threads || []).forEach(t => {
        if (Array.isArray(t.comments)) {
          t.comments.forEach(c => {
            if (c.authorId === user.id || c.authorUsername === user.username) {
              userComments.push({ ...c, threadId: t.id, threadTitle: t.title, threadBrand: t.brand });
            }
          });
        }
      });

      if (userComments.length === 0) {
        container.innerHTML = `
          <div class="profile-empty-state">
            <div class="empty-icon">✍️</div>
            <h3>Henüz Yanıt Yazılmamış</h3>
            <p>${escapeHtml(user.name)} henüz başka konulara yorum veya usta tavsiyesi yazmadı.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = userComments.map(c => `
        <div class="profile-reply-card" onclick="Forum.openThread('${c.threadId}')">
          <div class="reply-parent-thread">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
            <span>Şu konuya yanıt verildi: <strong>${escapeHtml(c.threadTitle)}</strong></span>
          </div>
          <p class="reply-content-text">${escapeHtml(c.content)}</p>
          <div class="reply-footer-meta">
            ${c.isSolution ? '<span class="status-pill-solved" style="font-size:0.7rem;">✓ Doğrulanmış Çözüm</span>' : ''}
            <span style="font-size:0.75rem; color:var(--text-dim);">${formatDate(c.createdAt)}</span>
            <span style="font-size:0.75rem; color:var(--text-dim); margin-left:auto;">${c.likes || 0} beğeni</span>
          </div>
        </div>
      `).join('');

    } else if (this.activeTab === 'garage') {
      const carName = user.car || 'Belirtilmemiş Araç';
      container.innerHTML = `
        <div class="profile-garage-card">
          <div class="garage-header">
            <div>
              <span class="badge" style="background:rgba(245,158,11,0.1); color:var(--accent-amber); border:1px solid rgba(245,158,11,0.25); margin-bottom:6px;">Birincil Araç</span>
              <h3 style="font-size:1.25rem; font-weight:800; color:#FFF; margin:0;">${escapeHtml(carName)}</h3>
            </div>
            ${user.plate ? `<div class="garage-plate-box">${escapeHtml(user.plate)}</div>` : ''}
          </div>

          <div class="garage-specs-grid">
            <div class="garage-spec-box">
              <span class="spec-label">Araç Türü</span>
              <span class="spec-val">Binek & SUV</span>
            </div>
            <div class="garage-spec-box">
              <span class="spec-label">Bakım Durumu</span>
              <span class="spec-val" style="color:#10B981;">Periyodik Bakım Güncel</span>
            </div>
            <div class="garage-spec-box">
              <span class="spec-label">OBD Kaydı</span>
              <span class="spec-val">0 Aktif Arıza</span>
            </div>
            <div class="garage-spec-box">
              <span class="spec-label">Yetkili Servis / Usta</span>
              <span class="spec-val">${user.shopName ? escapeHtml(user.shopName) : 'Mobil Tamircim Ağı'}</span>
            </div>
          </div>

          <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="AiAssistant.toggleModal()">
              Bu Araç İçin Arıza Sor
            </button>
            <button class="btn btn-secondary btn-sm" onclick="App.switchView('view-prices')">
              Parça & İşçilik Fiyatlarına Bak
            </button>
          </div>
        </div>
      `;

    } else if (this.activeTab === 'solutions') {
      const solutionComments = [];
      (Forum.threads || []).forEach(t => {
        if (Array.isArray(t.comments)) {
          t.comments.forEach(c => {
            if (c.isSolution && (c.authorId === user.id || c.authorUsername === user.username)) {
              solutionComments.push({ ...c, threadId: t.id, threadTitle: t.title });
            }
          });
        }
      });

      if (solutionComments.length === 0) {
        container.innerHTML = `
          <div class="profile-empty-state">
            <div class="empty-icon">🏆</div>
            <h3>Kayıtlı Çözüm Bulunmuyor</h3>
            <p>Forumdaki konulara doğru teşhis ve çözüm sundukça araç sahipleri yanıtınızı "Çözüm" olarak işaretleyecektir.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = solutionComments.map(c => `
        <div class="profile-reply-card solution-card" onclick="Forum.openThread('${c.threadId}')">
          <div class="reply-parent-thread" style="color:#10B981;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Doğrulanmış Çözüm: <strong>${escapeHtml(c.threadTitle)}</strong></span>
          </div>
          <p class="reply-content-text" style="color:#F1F5F9;">${escapeHtml(c.content)}</p>
          <div class="reply-footer-meta">
            <span class="status-pill-solved">Doğrulanmış Usta Teşhisi</span>
            <span style="font-size:0.75rem; color:var(--text-dim); margin-left:auto;">${formatDate(c.createdAt)}</span>
          </div>
        </div>
      `).join('');

    } else if (this.activeTab === 'badges') {
      const badges = user.badges || [];
      const badgeDescriptions = {
        'verified_mechanic': { title: 'Doğrulanmış Usta', desc: 'Sanayi esnafı ve mesleki yeterliliği doğrulanmış usta rozeti.', icon: '👨‍🔧' },
        'developer': { title: 'Sistem Mimarı', desc: 'Mobil Tamircim platformu resmi geliştiricisi ve çekirdek yöneticisi.', icon: '⚡' },
        'beta_tester': { title: 'Öncü Topluluk Üyesi', desc: 'Platformun ilk sürümünden bu yana katkı sunan erken aşama üyesi.', icon: '⭐' },
        'email_verified': { title: 'Onaylı Hesap', desc: 'E-posta adresi iki adımlı kod ile doğrulanmış güvenli kullanıcı.', icon: '🛡️' },
        'verified_user': { title: 'Doğrulanmış Sürücü', desc: 'Kimlik ve araç bilgileri onaylanmış gerçek otomobil kullanıcısı.', icon: '🚗' },
        'verified_dealer': { title: 'Yetkili Otomotiv Satıcısı', desc: 'Yetki belgesi doğrulanmış kurumsal galeri ve bayi.', icon: '🏢' }
      };

      if (badges.length === 0) {
        container.innerHTML = `
          <div class="profile-empty-state">
            <div class="empty-icon">🛡️</div>
            <h3>Rozet Bulunmuyor</h3>
            <p>E-postanızı doğrulayarak veya foruma katkıda bulunarak rozetler kazanabilirsiniz.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="profile-badges-grid">
          ${badges.map(b => {
            const info = badgeDescriptions[b] || { title: b, desc: 'Mobil Tamircim başarı rozeti.', icon: '🎖️' };
            return `
              <div class="profile-badge-card">
                <div class="badge-icon-wrap">${info.icon}</div>
                <div>
                  <h4 style="font-size:0.95rem; font-weight:700; color:#FFF; margin-bottom:4px;">${info.title}</h4>
                  <p style="font-size:0.78rem; color:var(--text-dim); line-height:1.4; margin:0;">${info.desc}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  },

  toggleFollow(targetUserId) {
    this.followingMap[targetUserId] = !this.followingMap[targetUserId];
    const isFollowing = this.followingMap[targetUserId];
    showToast(isFollowing ? 'Kullanıcı takip edildi.' : 'Takipten çıkıldı.', 'info');
    this.render();
  },

  openEditModal() {
    const user = Auth.currentUser;
    if (!user) {
      showToast('Profilinizi düzenlemek için giriş yapmalısınız.', 'error');
      return;
    }

    document.getElementById('edit-profile-name').value = user.name || '';
    document.getElementById('edit-profile-bio').value = user.bio || '';
    document.getElementById('edit-profile-car').value = user.car || '';
    document.getElementById('edit-profile-city').value = user.city || '';
    document.getElementById('edit-profile-district').value = user.district || '';
    document.getElementById('edit-profile-shop').value = user.shopName || user.dealerName || '';
    document.getElementById('edit-profile-phone').value = user.phone || '';

    openModal('edit-profile-modal');
  },

  async saveEdit(e) {
    if (e) e.preventDefault();
    const user = Auth.currentUser;
    if (!user) return;

    const name = document.getElementById('edit-profile-name').value.trim();
    const bio = document.getElementById('edit-profile-bio').value.trim();
    const car = document.getElementById('edit-profile-car').value.trim();
    const city = document.getElementById('edit-profile-city').value.trim();
    const district = document.getElementById('edit-profile-district').value.trim();
    const shopName = document.getElementById('edit-profile-shop').value.trim();
    const phone = document.getElementById('edit-profile-phone').value.trim();

    if (!name) {
      showToast('Lütfen adınızı giriniz.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/users/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name, bio, car, city, district, shopName, phone
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        // Update local object
        Object.assign(user, data.user);
        if (App.state && App.state.users) {
          const idx = App.state.users.findIndex(u => u.id === user.id);
          if (idx !== -1) App.state.users[idx] = user;
        }

        if (Auth.updateUserUI) Auth.updateUserUI();
        closeModal('edit-profile-modal');
        showToast('Profiliniz başarıyla güncellendi!', 'info');
        this.render();
      } else {
        showToast(data.error || 'Profil güncellenirken hata oluştu.', 'error');
      }
    } catch (err) {
      // Local fallback
      user.name = name;
      user.bio = bio;
      user.car = car;
      user.city = city;
      user.district = district;
      user.shopName = shopName;
      user.phone = phone;

      if (Auth.updateUserUI) Auth.updateUserUI();
      closeModal('edit-profile-modal');
      showToast('Profil güncellendi (Yerel).', 'info');
      this.render();
    }
  }
};
