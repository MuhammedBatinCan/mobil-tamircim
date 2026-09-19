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
        <div style="text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; color:var(--text-dim);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div style="font-weight:700; color:#FFF;">Şu Anda Aktif Acil Çağrı Yok</div>
          <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">Yollar açık, güvenli sürüşler dileriz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.requests.map(item => {
      const isActive = item.status === 'active';
      return `
        <div class="sidebar-card" style="margin-bottom:16px; border-left: 3px solid ${isActive ? '#EF4444' : '#10B981'};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              ${isActive ? '<span class="badge" style="background:rgba(239,68,68,0.15); color:#FCA5A5; border:1px solid rgba(239,68,68,0.3);">ACİL YOLDA KALDI</span>' : '<span class="badge" style="background:rgba(16,185,129,0.15); color:#6EE7B7; border:1px solid rgba(16,185,129,0.3);">YARDIM ULAŞTI</span>'}
              <span style="font-size:0.8rem; color:var(--text-dim);">${formatDate(item.createdAt)}</span>
            </div>
            ${Auth.renderPlate(item.plate, 'sm')}
          </div>

          <h3 style="font-size:1.05rem; font-weight:700; color:#FFF; margin-bottom:6px;">
            ${escapeHtml(item.locationCity)} - ${escapeHtml(item.locationDetails)}
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
              Hemen Ara: ${item.phone}
            </a>
            ${isActive && (Auth.isAdmin() || (Auth.currentUser && Auth.currentUser.id === item.userId)) ? `
              <button class="btn btn-secondary btn-sm" onclick="SOS.resolveAlert('${item.id}')">
                Yardım Ulaştı Olarak Kapat
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
        showToast('Acil durum çağrınız yayınlandı. Çevredeki usta ve çekicilere bildirildi.');
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
        showToast('Acil durum çağrısı kapatıldı.');
      }
    } catch (err) {
      showToast('Hata oluştu', 'error');
    }
  }
};
