// OTO SANAYİ FORUMU - OBD-II ARIZA KÜTÜPHANESİ & TEŞHİS SÖZLÜĞÜ (OBD.JS)

const OBD = {
  codes: [],
  selectedCategory: 'all',
  searchQuery: '',
  activeCode: null,

  init(stateCodes) {
    const defaults = (typeof APP_DATA !== 'undefined' && APP_DATA.obdCodes)
      ? APP_DATA.obdCodes
      : ((window.APP_DATA && window.APP_DATA.obdCodes) ? window.APP_DATA.obdCodes : []);
    this.codes = (stateCodes && stateCodes.length > 0) ? stateCodes : defaults;
    
    // Enrich with detailed symptoms, causes, mechanic solutions and costs
    this.codes = this.codes.map(c => this.enrichCode(c));
    this.render();
  },

  enrichCode(c) {
    const code = c.code.toUpperCase();
    let severity = 'Orta';
    let symptoms = ['Motor arıza lambası (Check Engine) yanması'];
    let causes = [c.desc || 'Sensör veya mekanik aksam arızası'];
    let solution = 'Aracı OBD arıza tespit cihazına bağlayıp canlı verileri (Live Data) kontrol edin.';
    let estimatedCost = '1.000 - 3.500 TL';

    if (code.startsWith('P03')) {
      severity = 'Kritik';
      symptoms = ['Rölantide şiddetli sarsıntı & titreme', 'Gaza basınca tekleme ve yığılma', 'Egzozdan çiğ benzin kokusu', 'Çekişte belirgin düşüş'];
      causes = ['Ateşleme bobini arızası veya soket temassızlığı', 'Aşınmış/yağlanmış bujiler', 'Enjektör püskürtme bozukluğu', 'Sübap kaçağı veya kompresyon düşüklüğü'];
      solution = 'Arızalı silindirin buji ve bobinini sağlam silindirle çaprazlayın (swap testi). Arıza kodu yer değiştiriyorsa bobin/buji arızalıdır.';
      estimatedCost = '1.200 - 4.500 TL';
    } else if (code === 'P0299' || code === 'P0234') {
      severity = 'Yüksek';
      symptoms = ['Araç koruma moduna (Limp Mode) geçiyor', '3000 deviri geçmeme', 'Yokuşta hızlanamama', 'Hava ıslık veya fıslama sesi'];
      causes = ['Turbo intercooler hava hortumunda yırtık/kaçak', 'N75 turbo selenoid valfi arızası', 'Wastegate klape sıkışması veya vakum kaçağı', 'Georadyal kanatçık kurum birikimi'];
      solution = 'Önce intercooler hortumlarını ve kelepçelerini elle kontrol edin; duman testi (smoke test) ile emme kaçaklarını tespit ettirin.';
      estimatedCost = '1.500 - 8.000 TL';
    } else if (code.startsWith('P02')) {
      severity = 'Kritik';
      symptoms = ['Sabah geç çalışma veya sarsıntılı rölanti', 'Kara duman atma', 'Şakırtılı motor sesi (enjektör vuruntusu)', 'Enjeksiyonu kontrol ettirin uyarısı'];
      causes = ['Piezo/bobinli enjektör iç eleman arızası', 'Mazot filtresi tıkanıklığı veya talaş', 'Rail basınç regülatörü dengesizliği', 'Enjektör elektrik tesisatı temassızlığı'];
      solution = 'Sanayide enjektör geri dönüş testi yaptırın. Değerleri tolerans dışı olan enjektörü revizyona verin.';
      estimatedCost = '2.500 - 9.000 TL';
    } else if (code.startsWith('P04') || code.startsWith('P20') || code.startsWith('P24')) {
      severity = 'Yüksek';
      symptoms = ['Egzoz emisyon uyarısı', 'DPF doluluk oranının artması', 'Yakıt tüketiminde %20-30 artış', 'Egzozdan koku gelmesi'];
      causes = ['EGR valfinin kurum bağlayıp açık takılı kalması', 'Dizel Partikül Filtresi (DPF) gözenek tıkanması', 'Diferansiyel basınç sensörü silikon hortum kopması', 'Katalitik konvertör petek erimesi'];
      solution = 'EGR valfini söküp kimyasal banyoda temizleyin; DPF basınç farkını canlı test cihazıyla kontrol edip rejenerasyon yaptırın.';
      estimatedCost = '2.000 - 6.500 TL';
    } else if (code.startsWith('P07') || code.startsWith('P08')) {
      severity = 'Kritik';
      symptoms = ['Vites geçişlerinde sert vuruntu', 'Geri vitese veya D konumuna geçmeme', 'Şanzıman harareti uyarısı', 'Yalnızca tek viteste sabit kalma'];
      causes = ['Mekatronik gövde basınç tüpü gevşemesi/patlaması', 'Kuru/ıslak kavrama balata aşınması', 'Selenoid valf kirliliği veya eski şanzıman yağı', 'TCM şanzıman beyni lehim çatlağı'];
      solution = 'Öncelikle şanzıman yağı ve mekatronik basıncını kontrol ettirin. Mekatronik tüp onarımı ile komple ünite değişiminden kurtulabilirsiniz.';
      estimatedCost = '4.000 - 28.000 TL';
    } else if (code.startsWith('U')) {
      severity = 'Yüksek';
      symptoms = ['Kadran göstergelerinin resetlenmesi', 'Birden fazla arıza lambasının aynı anda yanması', 'Motorun marş basıp çalışmaması'];
      causes = ['CAN-Bus haberleşme hattında kısa devre veya şase', 'Akü kutup başı gevşekliği veya düşük akü voltajı', 'Motor beyni ana besleme rölesi arızası'];
      solution = 'Akü voltajını ve şarj dinamosu değerini ölçün. ABS ve BCM soketlerindeki nem/oksitlenmeyi kontrol edin.';
      estimatedCost = '800 - 3.500 TL';
    } else if (code.startsWith('C')) {
      severity = 'Yüksek';
      symptoms = ['ABS ve ESP lambasının sürekli yanması', 'Fren pedalında titreşim', 'Yokuş kalkış desteğinin devre dışı kalması'];
      causes = ['Tekerlek ABS devir sensörü kablosunun kopması', 'Porya rulman manyetik şeridinin kirlenmesi/hasarı', 'Fren hidroliği seviye düşüklüğü'];
      solution = 'Arızalı tekerleğin sensör kablosunu ve soketini kontrol edin; gerekirse tekerlek hız sensörünü yenileyin.';
      estimatedCost = '800 - 2.500 TL';
    }

    return {
      code,
      category: c.category || 'Genel Motor & Mekanik',
      title: c.title || 'OBD-II Tanımlı Arıza Kodu',
      desc: c.desc || 'Arıza tespit soketinden okunan elektronik teşhis kodu.',
      severity,
      symptoms,
      causes,
      solution,
      estimatedCost
    };
  },

  setCategory(cat) {
    this.selectedCategory = cat;
    document.querySelectorAll('.obd-cat-pill, .obd-category-btn').forEach(btn => {
      const bCat = btn.getAttribute('data-cat') || btn.getAttribute('data-category');
      btn.classList.toggle('active', bCat === cat);
    });
    this.render();
  },

  onSearch(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.render();
  },

  getFilteredCodes() {
    return this.codes.filter(c => {
      const cat = this.selectedCategory;
      let matchCat = true;

      if (cat !== 'all') {
        const cCode = c.code;
        const cCat = (c.category || '').toLowerCase();

        if (cat === 'powertrain') {
          matchCat = cCode.startsWith('P00') || cCode.startsWith('P01') || cCat.includes('motor') || cCat.includes('güç');
        } else if (cat === 'fuel') {
          matchCat = cCode.startsWith('P02') || cCat.includes('yakıt') || cCat.includes('enjeksiyon');
        } else if (cat === 'ignition') {
          matchCat = cCode.startsWith('P03') || cCat.includes('ateşleme') || cCat.includes('buji');
        } else if (cat === 'emission') {
          matchCat = cCode.startsWith('P04') || cCode.startsWith('P20') || cCode.startsWith('P24') || cCat.includes('egzoz') || cCat.includes('emisyon') || cCat.includes('dpf') || cCat.includes('kataliz');
        } else if (cat === 'transmission') {
          matchCat = cCode.startsWith('P07') || cCode.startsWith('P08') || cCat.includes('şanzıman') || cCat.includes('vites');
        } else if (cat === 'body_chassis') {
          matchCat = cCode.startsWith('B') || cCode.startsWith('C') || cCode.startsWith('U') || cCat.includes('şasi') || cCat.includes('gövde') || cCat.includes('abs');
        } else {
          matchCat = cCat.includes(cat.toLowerCase());
        }
      }

      if (!matchCat) return false;

      if (!this.searchQuery) return true;
      const q = this.searchQuery;
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        (c.symptoms && c.symptoms.some(s => s.toLowerCase().includes(q))) ||
        (c.causes && c.causes.some(cau => cau.toLowerCase().includes(q)))
      );
    });
  },

  render() {
    const container = document.getElementById('obd-codes-grid');
    const countEl = document.getElementById('obd-total-count-badge');
    if (!container) return;

    const list = this.getFilteredCodes();
    if (countEl) countEl.textContent = `${list.length} Arıza Kodu Listelendi`;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
          <div style="font-weight:700; color:#FFF; font-size:1.05rem;">Aradığınız OBD Kodu Bulunamadı</div>
          <p style="font-size:0.85rem; margin-top:4px; color:var(--text-muted);">
            "${escapeHtml(this.searchQuery)}" ile eşleşen bir arıza kodu bulunamadı. Yapay Zeka Danışmanımıza sorabilir veya foruma yeni konu açabilirsiniz.
          </p>
          <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="AiAssistant.askPreset('${escapeHtml(this.searchQuery)} arıza kodu nedir')">
            AI Usta'ya Sor &rarr;
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => {
      const relatedCount = (window.Forum && window.Forum.threads) 
        ? window.Forum.threads.filter(t => (t.obdCode || '').toUpperCase() === c.code).length 
        : 0;

      const severityClass = c.severity === 'Kritik' 
        ? 'badge-obd-critical' 
        : (c.severity === 'Yüksek' ? 'badge-obd-high' : 'badge-obd-medium');

      return `
        <div class="sidebar-card obd-card" onclick="OBD.openModal('${c.code}')">
          <div class="obd-card-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="obd-code-badge">${c.code}</span>
              <span class="obd-severity-badge ${severityClass}">${c.severity}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-dim);">${escapeHtml(c.category)}</span>
          </div>

          <h3 class="obd-card-title">${escapeHtml(c.title)}</h3>
          <p class="obd-card-desc">${escapeHtml(c.desc)}</p>

          <div class="obd-card-meta">
            <span class="obd-cost-tag" title="Tahmini Masraf">
              💰 ${c.estimatedCost}
            </span>
            ${relatedCount > 0 ? `
              <span style="color:#60A5FA; font-weight:700; font-size:0.78rem;" title="Bu kodla ilgili forumda tartışılan konu sayısı">
                💬 ${relatedCount} Konu
              </span>
            ` : `
              <span style="color:var(--text-muted); font-size:0.75rem;">
                Detayları Gör &rarr;
              </span>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  openModal(codeQuery) {
    if (!codeQuery) return;
    const clean = codeQuery.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const c = this.codes.find(x => x.code === clean) || this.enrichCode({ 
      code: clean, 
      category: 'Arıza Kodu', 
      title: `${clean} Arıza Kodu Teşhisi`, 
      desc: 'Sistem arıza tespit soketinden okunan elektronik hata kaydı.' 
    });

    this.activeCode = c;

    // Fill elements
    const badgeEl = document.getElementById('obd-modal-badge') || document.getElementById('obd-modal-code');
    const sevEl = document.getElementById('obd-modal-severity');
    const catEl = document.getElementById('obd-modal-category');
    const titleEl = document.getElementById('obd-modal-title');
    const descEl = document.getElementById('obd-modal-desc');
    const symptomsEl = document.getElementById('obd-modal-symptoms');
    const causesEl = document.getElementById('obd-modal-causes');
    const solutionEl = document.getElementById('obd-modal-solution');
    const costEl = document.getElementById('obd-modal-cost');
    const relatedBtn = document.getElementById('obd-modal-threads-btn') || document.getElementById('obd-modal-related-btn');
    const relatedCountEl = document.getElementById('obd-modal-threads-count');

    if (badgeEl) badgeEl.textContent = c.code;
    if (sevEl) {
      sevEl.textContent = c.severity;
      sevEl.className = 'obd-severity-badge ' + (c.severity === 'Kritik' ? 'badge-obd-critical' : (c.severity === 'Yüksek' ? 'badge-obd-high' : 'badge-obd-medium'));
    }
    if (catEl) catEl.textContent = c.category;
    if (titleEl) titleEl.textContent = c.title;
    if (descEl) descEl.textContent = c.desc;
    if (costEl) costEl.textContent = c.estimatedCost;
    if (solutionEl) solutionEl.textContent = c.solution;

    if (symptomsEl) {
      symptomsEl.innerHTML = (c.symptoms || []).map(s => `<li>${escapeHtml(s)}</li>`).join('');
    }
    if (causesEl) {
      causesEl.innerHTML = (c.causes || []).map(cau => `<li>${escapeHtml(cau)}</li>`).join('');
    }

    const relatedThreads = (window.Forum && window.Forum.threads)
      ? window.Forum.threads.filter(t => (t.obdCode || '').toUpperCase() === c.code)
      : [];

    if (relatedCountEl) relatedCountEl.textContent = relatedThreads.length;
    if (relatedBtn) {
      relatedBtn.onclick = () => {
        closeModal('obd-detail-modal');
        OBD.viewRelatedThreads(c.code);
      };
    }

    openModal('obd-detail-modal');
  },

  viewRelatedThreads(code) {
    if (window.App && window.App.switchView) {
      window.App.switchView('view-forum');
    }
    if (window.Forum) {
      const searchInput = document.getElementById('header-search-input');
      if (searchInput) searchInput.value = code;
      Forum.onSearch(code);
      showToast(`${code} arıza koduna ait forum konuları filtrelendi`);
    }
  }
};

window.OBD = OBD;
