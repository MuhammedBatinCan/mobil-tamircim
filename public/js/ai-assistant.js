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

    container.innerHTML = this.chatHistory.map(m => {
      let sourceTag = '';
      if (m.role === 'bot') {
        if (m.source === 'claude') {
          sourceTag = `<div style="font-size:0.68rem; font-weight:700; color:#F97316; margin-bottom:4px;">Anthropic Claude 3.5</div>`;
        } else if (m.source === 'gemini') {
          sourceTag = `<div style="font-size:0.68rem; font-weight:700; color:#A855F7; margin-bottom:4px;">Google Gemini 2.5</div>`;
        } else if (m.source === 'local_engine') {
          sourceTag = `<div style="font-size:0.68rem; font-weight:700; color:#10B981; margin-bottom:4px;">Mobil Tamircim Yerel Motor</div>`;
        }
      }

      return `
        <div class="ai-msg ${m.role}">
          ${sourceTag}
          <div>${this.formatMarkdown(m.text)}</div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
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

    // 1. Kullanıcı mesajını ekle ve kaydır
    this.chatHistory.push({ role: 'user', text: query });
    this.renderChat();

    // 2. Typing indicator göster
    const typingIndicator = document.getElementById('ai-typing-indicator');
    if (typingIndicator) {
      const provider = this.getProvider();
      let indicatorName = 'AI Usta';
      if (provider === 'claude') indicatorName = 'Claude AI Usta';
      else if (provider === 'gemini') indicatorName = 'Gemini AI Usta';
      
      typingIndicator.querySelector('span').innerText = `${indicatorName} yanıt hazırlıyor...`;
      typingIndicator.style.display = 'flex';
    }

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
      if (typingIndicator) typingIndicator.style.display = 'none';

      if (data.success && data.reply) {
        this.chatHistory.push({ role: 'bot', text: data.reply, source: data.source });
        this.updateSourceBadge(data.source, data.model);
      } else {
        this.chatHistory.push({
          role: 'bot',
          source: 'local_engine',
          text: `**Arıza Analiz Edildi:**\n• ${data.error || 'Geçici bağlantı aksaklığı, yerel veri tabanıyla cevaplandı.'}`
        });
      }
    } catch (err) {
      if (typingIndicator) typingIndicator.style.display = 'none';
      // Çevrimdışı / Hata durumunda yerel teşhis motoru devrede
      const offlineReply = this.localFallbackDiagnosis(query);
      this.chatHistory.push({ role: 'bot', text: offlineReply, source: 'local_engine' });
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
