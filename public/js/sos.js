// OTO SANAYİ FORUMU - SOS ACİL DURUM / YOLDA KALDIM MODÜLÜ

const SOS = {
  requests: [],

  init(stateSos) {
    this.requests = stateSos || [];
    this.renderSosFeed();
  },

  renderSosFeed() {
    const container = document.getElementById('sos-feed');
    if (!container) return;

    if (this.requests.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 40px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md);">
          <div style="font-size:2.5rem; margin-bottom:8px;">🛣️</div>
          <div style="font-weight:700; color:#FFF;">Şu Anda Aktif Acil Çağrı Yok</div>
          <p style="font-size:0.85rem; margin-top:4px;">Yollar açık, tekerinize taş değmesin!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.requests.map(item => {
      const isActive = item.status === 'active';
      return `
        <div class="sidebar-card" style="margin-bottom:16px; border-left: 4px solid ${isActive ? '#EF4444' : '#10B981'};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              ${isActive ? '<span class="badge" style="background:#EF4444; color:#FFF; animation:pulse-sos 1.5s infinite;">🚨 ACİL YOLDA KALDI</span>' : '<span class="badge" style="background:#10B981; color:#FFF;">✓ YARDIM ULAŞTI</span>'}
              <span style="font-size:0.8rem; color:var(--text-dim);">${formatDate(item.createdAt)}</span>
            </div>
            ${Auth.renderPlate(item.plate, 'sm')}
          </div>

          <h3 style="font-size:1.1rem; font-weight:800; color:#FFF; margin-bottom:6px;">
            📍 ${escapeHtml(item.locationCity)} - ${escapeHtml(item.locationDetails)}
          </h3>

          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
            <strong>Araç:</strong> ${escapeHtml(item.car || 'Belirtilmedi')} • 
            <strong style="color:#F87171;">Arıza:</strong> ${escapeHtml(item.issueType.toUpperCase())}
          </div>

          <p style="font-size:0.9rem; color:#E2E8F0; line-height:1.5; background:var(--bg-input); padding:10px; border-radius:var(--radius-sm); margin-bottom:12px;">
            "${escapeHtml(item.description)}"
          </p>

          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="tel:${item.phone}" class="btn btn-primary btn-sm" style="background:#EF4444; color:#FFF; border:none; flex:1;">
              📞 Hemen Ara: ${item.phone}
            </a>
            ${isActive && (Auth.isAdmin() || (Auth.currentUser && Auth.currentUser.id === item.userId)) ? `
              <button class="btn btn-secondary btn-sm" onclick="SOS.resolveAlert('${item.id}')">
                ✓ Yardım Ulaştı Olarak Kapat
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  async createAlert(formData) {
    const user = Auth.currentUser;
    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.name,
          plate: formData.plate || user.plate,
          car: formData.car || user.car,
          locationCity: formData.city,
          locationDetails: formData.locationDetails,
          issueType: formData.issueType,
          description: formData.description,
          phone: formData.phone
        })
      });

      const data = await res.json();
      if (data.success) {
        this.requests.unshift(data.sos);
        this.renderSosFeed();
        showToast('🚨 Acil durum çağrınız yayınlandı! Çevredeki usta ve çekicilere bildirildi.');
        closeModal('sos-modal');
        window.App.switchView('view-sos');
      } else {
        showToast(data.error || 'Hata oluştu', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası', 'error');
    }
  },

  async resolveAlert(sosId) {
    try {
      const res = await fetch(`/api/sos/${sosId}/resolve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const item = this.requests.find(s => s.id === sosId);
        if (item) item.status = 'resolved';
        this.renderSosFeed();
        showToast('✓ Acil durum çağrısı kapatıldı.');
      }
    } catch (err) {
      showToast('Hata oluştu', 'error');
    }
  }
};
