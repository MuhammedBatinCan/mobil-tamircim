// OTO SANAYİ FORUMU - FİYAT ANALİZİ ("PİYASA NE DİYOR?")

const PriceAnalysis = {
  benchmarks: [],

  init(stateBenchmarks) {
    this.benchmarks = stateBenchmarks || [];
    this.renderPrices();
  },

  renderPrices() {
    const container = document.getElementById('price-feed');
    if (!container) return;

    if (this.benchmarks.length === 0) {
      container.innerHTML = `<p style="color:var(--text-dim); text-align:center; padding:20px;">Henüz fiyat verisi girilmemiş.</p>`;
      return;
    }

    container.innerHTML = this.benchmarks.map(p => `
      <div class="sidebar-card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
          <div>
            <span class="badge" style="background:#1E293B; color:#38BDF8; margin-bottom:4px;">🚗 ${escapeHtml(p.brand)} ${escapeHtml(p.model)}</span>
            <h3 style="font-size:1.1rem; font-weight:800; color:#FFF;">${escapeHtml(p.operation)}</h3>
            <span style="font-size:0.78rem; color:var(--text-dim);">📍 ${escapeHtml(p.city)} • Son Güncelleme: ${escapeHtml(p.lastUpdated)}</span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.35rem; font-weight:900; color:var(--accent-amber);">
              ${p.totalAvg.toLocaleString('tr-TR')} TL
            </div>
            <div style="font-size:0.72rem; color:var(--text-dim);">Ortalama Toplam Tutar</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:12px;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-dim);">⚙️ Parça Maliyeti (Ort.)</div>
            <div style="font-weight:700; color:#E2E8F0; font-size:0.95rem;">${p.partCostAvg.toLocaleString('tr-TR')} TL</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-dim);">🔧 İşçilik Ücreti (Ort.)</div>
            <div style="font-weight:700; color:#E2E8F0; font-size:0.95rem;">${p.laborCostAvg.toLocaleString('tr-TR')} TL</div>
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; color:var(--text-dim);">
          <span>👨‍🔧 ${p.verifiedByMechanics} Onaylı Tamirci Tarafından Doğrulandı</span>
          <span style="color:var(--accent-green); font-weight:700;">✓ Piyasa Uyumlu</span>
        </div>
      </div>
    `).join('');
  },

  async submitNewPrice(formData) {
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        this.benchmarks.unshift(data.price);
        this.renderPrices();
        showToast('💰 Fiyat verisi başarıyla eklendi!');
        closeModal('price-modal');
      } else {
        showToast(data.error || 'Hata oluştu', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası', 'error');
    }
  }
};
