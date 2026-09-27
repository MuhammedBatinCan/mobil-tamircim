// OTO SANAYİ FORUMU - MOBİL TAMİRCİM CANLI YAPAY ZEKA USTA MOTORU (AI-ASSISTANT.JS)
// Anthropic Claude 3.5 Sonnet/Haiku + Google Gemini 2.5 + Yerel Otomotiv Bilgi Motoru

const AiAssistant = {
  chatHistory: [
    {
      role: 'bot',
      source: 'welcome',
      text: 'Selamlar kardeşim! Ben **Mobil Tamircim AI Usta**. Kaputun altından gelen sesi, aracının göstergesindeki arıza lambasını, duman rengini veya OBD kodunu yaz; sana en olası sebepleri, aciliyetini, tahmini parça/işçilik masrafını ve usta tavsiyesini hemen dökeyim.'
    }
  ],

  init() {
    const provider = this.getProvider();
    const claudeKey = this.getClaudeKey();
    const claudeModel = this.getClaudeModel();
    const geminiKey = this.getGeminiKey();

    const providerSelect = document.getElementById('ai-provider-select');
    if (providerSelect) providerSelect.value = provider;

    const claudeInput = document.getElementById('claude-api-key-input');
    if (claudeInput && claudeKey) claudeInput.value = claudeKey;

    const modelSelect = document.getElementById('claude-model-select');
    if (modelSelect && claudeModel) modelSelect.value = claudeModel;

    const geminiInput = document.getElementById('gemini-api-key-input');
    if (geminiInput && geminiKey) geminiInput.value = geminiKey;

    this.onProviderChange();
    this.updateSourceBadge();
  },

  getProvider() {
    return localStorage.getItem('ai_provider') || 'local';
  },

  getClaudeKey() {
    return localStorage.getItem('claude_api_key') || '';
  },

  getClaudeModel() {
    return localStorage.getItem('claude_model') || 'claude-3-5-sonnet-20241022';
  },

  getGeminiKey() {
    return localStorage.getItem('gemini_api_key') || '';
  },

  onProviderChange() {
    const select = document.getElementById('ai-provider-select');
    if (!select) return;
    const val = select.value;

    const claudeSec = document.getElementById('ai-claude-section');
    const geminiSec = document.getElementById('ai-gemini-section');
    const localSec = document.getElementById('ai-local-section');

    if (claudeSec) claudeSec.style.display = (val === 'claude') ? 'block' : 'none';
    if (geminiSec) geminiSec.style.display = (val === 'gemini') ? 'block' : 'none';
    if (localSec) localSec.style.display = (val === 'local') ? 'block' : 'none';
  },

  toggleKeyVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.innerText = 'Gizle';
    } else {
      input.type = 'password';
      if (btn) btn.innerText = 'Göster';
    }
  },

  saveSettings() {
    const providerSelect = document.getElementById('ai-provider-select');
    const claudeInput = document.getElementById('claude-api-key-input');
    const claudeModelSelect = document.getElementById('claude-model-select');
    const geminiInput = document.getElementById('gemini-api-key-input');

    const provider = providerSelect ? providerSelect.value : 'claude';
    const claudeKey = claudeInput ? claudeInput.value.trim() : '';
    const claudeModel = claudeModelSelect ? claudeModelSelect.value : 'claude-3-5-sonnet-20241022';
    const geminiKey = geminiInput ? geminiInput.value.trim() : '';

    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('claude_model', claudeModel);

    if (claudeKey) {
      localStorage.setItem('claude_api_key', claudeKey);
    } else {
      localStorage.removeItem('claude_api_key');
    }

    if (geminiKey) {
      localStorage.setItem('gemini_api_key', geminiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }

    let providerName = 'Anthropic Claude';
    if (provider === 'gemini') providerName = 'Google Gemini 2.5';
    if (provider === 'local') providerName = 'Mobil Tamircim Yerel Motor';

    showToast(`Yapay zeka ayarları güncellendi. Aktif: ${providerName}`);
    this.toggleApiKeyModal();
    this.updateSourceBadge();
  },

  // Geriye dönük uyumluluk için
  saveApiKey() {
    this.saveSettings();
  },

  toggleApiKeyModal() {
    const banner = document.getElementById('ai-api-key-banner');
    if (banner) {
      banner.style.display = banner.style.display === 'none' ? 'block' : 'none';
      if (banner.style.display === 'block') {
        const providerSelect = document.getElementById('ai-provider-select');
        if (providerSelect) providerSelect.value = this.getProvider();
        this.onProviderChange();
      }
    }
  },

  updateSourceBadge(source = null, model = null) {
    const badge = document.querySelector('.ai-online-indicator');
    if (!badge) return;

    const provider = this.getProvider();
    const hasClaude = !!this.getClaudeKey();
    const hasGemini = !!this.getGeminiKey();

    if (provider === 'claude' && (hasClaude || source === 'claude')) {
      const activeModel = model || this.getClaudeModel();
      const modelName = activeModel.includes('haiku') ? 'Claude 3.5 Haiku' : 'Claude 3.5 Sonnet';
      badge.innerHTML = `Canlı ${modelName}`;
      badge.style.color = '#F97316';
    } else if (provider === 'gemini' && (hasGemini || source === 'gemini')) {
      badge.innerHTML = 'Canlı Google Gemini 2.5';
      badge.style.color = '#A855F7';
    } else {
      badge.innerHTML = 'Mobil Tamircim Yerel Teşhis';
      badge.style.color = '#10B981';
    }
  },

  toggleModal() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) {
      modal.classList.toggle('active');
      if (modal.classList.contains('active')) {
        this.renderChat();
        setTimeout(() => {
          const input = document.getElementById('ai-chat-input');
          if (input) input.focus();
        }, 120);
      }
    }
  },

  clearHistory() {
    this.chatHistory = [
      {
        role: 'bot',
        source: 'welcome',
        text: 'Sohbet geçmişi temizlendi. Aracındaki yeni bir arızayı, merak ettiğin masrafı veya OBD kodunu yazabilirsin!'
      }
    ];
    this.renderChat();
    showToast('AI Sohbet geçmişi sıfırlandı.');
  },

  renderChat() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    container.innerHTML = this.chatHistory.map((m, idx) => {
      let sourceTag = '';
      if (m.role === 'bot') {
        if (m.source === 'claude') {
          sourceTag = `<div style="font-size:0.68rem; font-weight:700; color:#F97316; margin-bottom:4px;">Anthropic Claude 3.5 Sonnet</div>`;
        } else if (m.source === 'gemini') {
          sourceTag = `<div style="font-size:0.68rem; font-weight:700; color:#A855F7; margin-bottom:4px;">Google Gemini 2.5 Flash</div>`;
        } else {
          sourceTag = `<div style="font-size:0.68rem; font-weight:700; color:#10B981; margin-bottom:4px;">Mobil Tamircim Araştırmacı AI Motoru</div>`;
        }
      }

      // Araştırma Özeti & Taranan Kaynaklar Akordeonu
      let researchHtml = '';
      if (m.role === 'bot' && m.researchTrace) {
        const trace = m.researchTrace;
        const hasData = (trace.matchedObd && trace.matchedObd.length > 0) ||
                        (trace.matchedThreads && trace.matchedThreads.length > 0) ||
                        (trace.matchedPrices && trace.matchedPrices.length > 0) ||
                        (trace.matchedParts && trace.matchedParts.length > 0) ||
                        (trace.matchedMechanics && trace.matchedMechanics.length > 0);

        if (hasData) {
          const accId = `ai-acc-${idx}`;
          researchHtml = `
            <div class="ai-research-accordion">
              <div class="ai-research-accordion-header" onclick="AiAssistant.toggleAccordion('${accId}')">
                <span>🔬 Araştırma Özeti & Taranan Platform Kaynakları</span>
                <span id="${accId}-icon">▼</span>
              </div>
              <div id="${accId}" class="ai-research-accordion-content" style="display:none;">
                ${(trace.matchedObd && trace.matchedObd.length > 0) ? `
                  <div class="ai-trace-item">
                    <div class="ai-trace-title">⚡ Taranan OBD-II Arıza Kodları:</div>
                    <div class="ai-trace-chips">
                      ${trace.matchedObd.map(o => `
                        <span class="ai-trace-chip" onclick="AiAssistant.openObdView('${escapeHtml(o.code)}')">
                          <strong>${escapeHtml(o.code)}</strong>: ${escapeHtml(o.title)} (${escapeHtml(o.cost || 'Masraf Belirsiz')})
                        </span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${(trace.matchedThreads && trace.matchedThreads.length > 0) ? `
                  <div class="ai-trace-item">
                    <div class="ai-trace-title">📖 Taranan Forum Vakaları & Usta Çözümleri:</div>
                    <div class="ai-trace-chips">
                      ${trace.matchedThreads.map(t => `
                        <span class="ai-trace-chip" onclick="AiAssistant.openThreadView('${t.id}')">
                          ${t.isSolved ? '✓ Çözüldü: ' : ''}<strong>${escapeHtml(t.title)}</strong> (${t.commentsCount} Yorum)
                        </span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${(trace.matchedPrices && trace.matchedPrices.length > 0) ? `
                  <div class="ai-trace-item">
                    <div class="ai-trace-title">🏷️ 2026 Sanayi Parça & İşçilik Maliyetleri:</div>
                    <div class="ai-trace-chips">
                      ${trace.matchedPrices.map(pr => `
                        <span class="ai-trace-chip" onclick="AiAssistant.goToQuotes('${encodeURIComponent(pr.operation || '')}')">
                          <strong>${escapeHtml(pr.operation)}</strong>: ~${new Intl.NumberFormat('tr-TR').format(pr.avgTotal)} TL (Parça: ${new Intl.NumberFormat('tr-TR').format(pr.partCost)} TL + İşçilik: ${new Intl.NumberFormat('tr-TR').format(pr.laborCost)} TL)
                        </span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${(trace.matchedParts && trace.matchedParts.length > 0) ? `
                  <div class="ai-trace-item">
                    <div class="ai-trace-title">🛒 Parça Pazarındaki İlgili İlanlar:</div>
                    <div class="ai-trace-chips">
                      ${trace.matchedParts.map(part => `
                        <span class="ai-trace-chip" onclick="AiAssistant.openPartDetailView('${part.id}')">
                          ${escapeHtml(part.name)} - <strong>${new Intl.NumberFormat('tr-TR').format(part.price)} TL</strong> (${escapeHtml(part.condition)})
                        </span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${(trace.matchedMechanics && trace.matchedMechanics.length > 0) ? `
                  <div class="ai-trace-item">
                    <div class="ai-trace-title">👨‍🔧 Önerilen Uzman & Onaylı Ustalar:</div>
                    <div class="ai-trace-chips">
                      ${trace.matchedMechanics.map(m => `
                        <span class="ai-trace-chip" onclick="AiAssistant.openMechanicProfile('${m.id}')">
                          🔧 <strong>${escapeHtml(m.name)}</strong> (${escapeHtml(m.shopName || 'Özel Servis')}, ${escapeHtml(m.city || '')})
                        </span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }
      }

      // Aksiyon Butonları Satırı
      let actionsHtml = '';
      if (m.role === 'bot') {
        const queryTerm = encodeURIComponent(m.query || '');
        actionsHtml = `
          <div class="ai-actions-row">
            <button class="ai-action-btn" onclick="AiAssistant.goToParts('${queryTerm}')">
              <span>🛒 İlgili Yedek Parçalar</span>
            </button>
            <button class="ai-action-btn" onclick="AiAssistant.goToQuotes('${queryTerm}')">
              <span>💰 Ustalardan Fiyat Teklifi Al</span>
            </button>
            <button class="ai-action-btn" onclick="AiAssistant.goToNewThread('${queryTerm}')">
              <span>💬 Forumda Başlık Aç</span>
            </button>
          </div>
        `;
      }

      return `
        <div class="ai-msg ${m.role}">
          ${sourceTag}
          <div class="ai-msg-body">${this.formatMarkdown(m.text)}</div>
          ${researchHtml}
          ${actionsHtml}
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  },

  toggleAccordion(accId) {
    const el = document.getElementById(accId);
    const icon = document.getElementById(`${accId}-icon`);
    if (!el) return;
    const isHidden = el.style.display === 'none';
    el.style.display = isHidden ? 'flex' : 'none';
    if (icon) icon.textContent = isHidden ? '▲' : '▼';
  },

  openObdView(code) {
    this.toggleModal();
    App.switchView('view-obd');
    setTimeout(() => {
      const searchInput = document.getElementById('obd-search-input');
      if (searchInput) {
        searchInput.value = code;
        if (typeof OBD !== 'undefined' && OBD.search) OBD.search(code);
      }
    }, 150);
  },

  openThreadView(threadId) {
    this.toggleModal();
    if (typeof Forum !== 'undefined' && Forum.openThread) {
      Forum.openThread(threadId);
    }
  },

  openPartDetailView(partId) {
    this.toggleModal();
    if (typeof Parts !== 'undefined' && Parts.openPartDetail) {
      Parts.openPartDetail(partId);
    }
  },

  openMechanicProfile(userId) {
    this.toggleModal();
    if (typeof Profile !== 'undefined' && Profile.openUserProfile) {
      Profile.openUserProfile(userId);
    }
  },

  goToParts(query) {
    this.toggleModal();
    App.switchView('view-parts');
    const term = decodeURIComponent(query || '').trim();
    if (term) {
      setTimeout(() => {
        const searchInput = document.getElementById('parts-search-input');
        if (searchInput) {
          searchInput.value = term;
          if (typeof Parts !== 'undefined' && Parts.applyFilters) Parts.applyFilters();
        }
      }, 150);
    }
  },

  goToQuotes(query) {
    this.toggleModal();
    App.switchView('view-quotes');
    const term = decodeURIComponent(query || '').trim();
    setTimeout(() => {
      openModal('new-quote-modal');
      const titleInput = document.getElementById('quote-title-input');
      if (titleInput && term) {
        titleInput.value = `${term} Arızası / Parça & İşçilik Teklifi`;
      }
    }, 150);
  },

  goToNewThread(query) {
    this.toggleModal();
    App.switchView('view-forum');
    const term = decodeURIComponent(query || '').trim();
    setTimeout(() => {
      openModal('new-thread-modal');
      const titleInput = document.getElementById('thread-title-input');
      if (titleInput && term) {
        titleInput.value = `${term} Hakkında Usta Tavsiyesi & Bilgi`;
      }
    }, 150);
  },

  formatMarkdown(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullets
    formatted = formatted.replace(/• (.*?)(?=\n|$)/g, '<div style="margin-left:8px; margin-top:3px;">• $1</div>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  },

  async ask(questionText) {
    if (!questionText || !questionText.trim()) return;

    const query = questionText.trim();

    // 1. Kullanıcı mesajını ekle ve render et
    this.chatHistory.push({ role: 'user', text: query });
    this.renderChat();

    // 2. Canlı 4 Aşamalı Araştırma HUD'ını yerleştir
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    const hudEl = document.createElement('div');
    hudEl.id = 'ai-live-research-hud';
    hudEl.className = 'ai-research-hud';
    hudEl.innerHTML = `
      <div class="ai-research-hud-header">
        <span class="ai-research-hud-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>ARAŞTIRMACI AI USTA MOTORU</span>
        </span>
        <span style="font-size:0.7rem; color:#38BDF8; font-weight:700;">DERİN VERİ TABANI TARAMASI</span>
      </div>
      <div class="ai-research-steps">
        <div id="ai-step-1" class="ai-research-step active">
          <div class="ai-step-indicator">1</div>
          <span>🔍 1. Aşama: Semptomlar & araç mekaniği analiz ediliyor...</span>
        </div>
        <div id="ai-step-2" class="ai-research-step">
          <div class="ai-step-indicator">2</div>
          <span>📚 2. Aşama: Forum veritabanı, çözülen vakalar & OBD kodları taranıyor...</span>
        </div>
        <div id="ai-step-3" class="ai-research-step">
          <div class="ai-step-indicator">3</div>
          <span>💰 3. Aşama: 2026 sanayi parça borsası ve usta işçilik fiyatları taranıyor...</span>
        </div>
        <div id="ai-step-4" class="ai-research-step">
          <div class="ai-step-indicator">4</div>
          <span>👨‍🔧 4. Aşama: Onaylı usta tecrübeleri ile nihai teşhis reçetesi derleniyor...</span>
        </div>
      </div>
    `;

    container.appendChild(hudEl);
    container.scrollTop = container.scrollHeight;

    // Aşamaların görsel canlı ilerleyişi
    const updateStep = (stepNum, isDone = false) => {
      const step = document.getElementById(`ai-step-${stepNum}`);
      if (!step) return;
      if (isDone) {
        step.classList.remove('active');
        step.classList.add('done');
        const indicator = step.querySelector('.ai-step-indicator');
        if (indicator) indicator.textContent = '✓';
      } else {
        step.classList.add('active');
      }
    };

    const timer1 = setTimeout(() => { updateStep(1, true); updateStep(2, false); }, 380);
    const timer2 = setTimeout(() => { updateStep(2, true); updateStep(3, false); }, 760);
    const timer3 = setTimeout(() => { updateStep(3, true); updateStep(4, false); }, 1140);

    try {
      // 3. Sunucudaki /api/ai/chat endpointini çağır
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          provider: this.getProvider(),
          claudeApiKey: this.getClaudeKey(),
          claudeModel: this.getClaudeModel(),
          geminiApiKey: this.getGeminiKey()
        })
      });

      const data = await res.json();

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      // Tüm adımları tamamlandı olarak işaretle
      updateStep(1, true);
      updateStep(2, true);
      updateStep(3, true);
      updateStep(4, true);

      // Kısa bir geçiş süresinin ardından HUD'ı kaldır ve raporu bas
      await new Promise(r => setTimeout(r, 260));
      const activeHud = document.getElementById('ai-live-research-hud');
      if (activeHud) activeHud.remove();

      if (data.success && data.reply) {
        this.chatHistory.push({
          role: 'bot',
          text: data.reply,
          source: data.source,
          researchTrace: data.researchTrace,
          query
        });
        this.updateSourceBadge(data.source, data.model);
      } else {
        this.chatHistory.push({
          role: 'bot',
          source: 'local_engine',
          text: `**Arıza Raporu Derlendi:**\n• ${data.error || 'Yerel veritabanı analiz edildi.'}`,
          query
        });
      }
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      const activeHud = document.getElementById('ai-live-research-hud');
      if (activeHud) activeHud.remove();

      const offlineReply = this.localFallbackDiagnosis(query);
      this.chatHistory.push({
        role: 'bot',
        text: offlineReply,
        source: 'local_engine',
        query
      });
      this.updateSourceBadge('local_engine');
    }

    this.renderChat();
  },

  localFallbackDiagnosis(query) {
    const qLower = query.toLowerCase();
    // OBD match
    if (window.APP_DATA && Array.isArray(window.APP_DATA.obdCodes)) {
      const found = window.APP_DATA.obdCodes.find(o => qLower.includes(o.code.toLowerCase()));
      if (found) {
        return `**OBD-II Arıza Teşhisi: ${found.code} (${found.title})**\n• **Sistem:** ${found.category}\n• **Muhtemel Sebep:** ${found.desc}\n• **Usta Tavsiyesi:** Soket korozyonu ve voltaj değerlerini okutun. Arıza lambasını söndürüp test sürüşüne çıkın.`;
      }
    }
    return `**Mobil Tamircim AI Danışman Yanıtı:**\nBelirttiğin "${escapeHtml(query)}" konusuyla ilgili olarak; araç model ve motor tipini belirterek forumda bir başlık açarsan onaylı ustalarımız en hızlı teşhisi koyacaktır!`;
  },

  sendFromInput() {
    const input = document.getElementById('ai-chat-input');
    if (input && input.value.trim()) {
      const text = input.value.trim();
      input.value = '';
      this.ask(text);
    }
  },

  askPreset(text) {
    this.ask(text);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AiAssistant.init();
});
