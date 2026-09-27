// ============================================================================
// MOBİL TAMİRCİM - USTA & SÜRÜCÜ ANLIK ÖZEL MESAJLAŞMA SİSTEMİ (DM / CHAT)
// ============================================================================

const Messages = {
  state: {
    conversations: [],
    activeConversationId: null,
    activeConversation: null,
    otherUser: null,
    messages: [],
    searchQuery: '',
    pendingImage: null,
    pollTimer: null,
    unreadTimer: null
  },

  init() {
    this.updateUnreadBadge();
    
    // Periyodik okunmamış mesaj sayacı (Her 10 saniyede bir kontrol)
    if (!this.state.unreadTimer) {
      this.state.unreadTimer = setInterval(() => {
        this.updateUnreadBadge();
      }, 10000);
    }
  },

  async render() {
    this.startPolling();
    await this.loadConversations(true);
  },

  startPolling() {
    if (this.state.pollTimer) clearInterval(this.state.pollTimer);
    this.state.pollTimer = setInterval(() => {
      // Eğer kullanıcı şu anda mesajlar sayfasındaysa canlı güncelle
      const viewEl = document.getElementById('view-messages');
      if (viewEl && viewEl.classList.contains('active')) {
        this.loadConversations(false);
        if (this.state.activeConversationId) {
          this.refreshThreadSilently(this.state.activeConversationId);
        }
      }
    }, 4000);
  },

  stopPolling() {
    if (this.state.pollTimer) {
      clearInterval(this.state.pollTimer);
      this.state.pollTimer = null;
    }
  },

  async updateUnreadBadge() {
    if (!window.Auth || !Auth.currentUser) return;
    try {
      const res = await fetch(`/api/messages/unread-total?userId=${encodeURIComponent(Auth.currentUser.id)}`);
      const data = await res.json();
      if (data.success) {
        const total = data.unreadTotal || 0;
        const navBadge = document.getElementById('nav-unread-badge');
        const headerBadge = document.getElementById('header-unread-msg-badge');
        
        [navBadge, headerBadge].forEach(el => {
          if (!el) return;
          if (total > 0) {
            el.textContent = total > 99 ? '99+' : total;
            el.style.display = 'inline-flex';
          } else {
            el.style.display = 'none';
          }
        });
      }
    } catch (e) {
      // Sessizce geç
    }
  },

  async loadConversations(autoSelectFirst = true) {
    if (!window.Auth || !Auth.currentUser) return;
    try {
      const res = await fetch(`/api/messages/conversations?userId=${encodeURIComponent(Auth.currentUser.id)}`);
      const data = await res.json();
      if (data.success) {
        this.state.conversations = data.conversations || [];
        this.renderConversationsList();

        if (autoSelectFirst && this.state.conversations.length > 0 && !this.state.activeConversationId) {
          this.openThread(this.state.conversations[0].id);
        } else if (this.state.conversations.length === 0) {
          this.renderEmptyChatState();
        }
      }
    } catch (err) {
      console.error('Sohbetler yüklenemedi:', err);
    }
  },

  onSearch(query) {
    this.state.searchQuery = (query || '').toLowerCase().trim();
    this.renderConversationsList();
  },

  renderConversationsList() {
    const listContainer = document.getElementById('messages-conv-list');
    if (!listContainer) return;

    let convs = [...this.state.conversations];
    if (this.state.searchQuery) {
      convs = convs.filter(c => {
        const u = c.otherUser || {};
        return (u.name || '').toLowerCase().includes(this.state.searchQuery) ||
               (u.username || '').toLowerCase().includes(this.state.searchQuery) ||
               (c.lastMessage?.text || '').toLowerCase().includes(this.state.searchQuery);
      });
    }

    if (convs.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 16px; color: var(--text-dim);">
          <div style="font-size:2rem; margin-bottom:8px;">💬</div>
          <div style="font-size:0.9rem; font-weight:600; color:var(--text-secondary);">Sohbet Bulunamadı</div>
          <p style="font-size:0.78rem; margin-top:4px;">Usta profillerinden veya parça ilanlarından sohbet başlatabilirsiniz.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = convs.map(c => {
      const u = c.otherUser || {};
      const isActive = c.id === this.state.activeConversationId;
      const unreadCount = c.unreadCount || 0;
      const lastMsg = c.lastMessage || {};
      const isSentByMe = lastMsg.senderId === Auth.currentUser.id;
      
      const roleColor = u.role === 'mechanic' ? '#10B981' : (u.role === 'dealer' ? '#F59E0B' : '#3B82F6');
      const roleText = u.role === 'mechanic' ? '🔧 Usta' : (u.role === 'dealer' ? '🏪 Galeri' : '🚗 Sürücü');

      const timeStr = lastMsg.createdAt ? this.formatTime(lastMsg.createdAt) : '';

      return `
        <div class="conv-item ${isActive ? 'active' : ''} ${unreadCount > 0 ? 'unread' : ''}" 
             onclick="Messages.openThread('${c.id}')">
          <div class="conv-avatar-wrap">
            <img src="${escapeHtml(u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150')}" class="conv-avatar" alt="Avatar">
            <span class="online-indicator"></span>
          </div>
          <div class="conv-content">
            <div class="conv-header-row">
              <span class="conv-user-name">${escapeHtml(u.name || 'Kullanıcı')}</span>
              <span class="conv-time">${timeStr}</span>
            </div>
            <div class="conv-badge-row">
              <span class="badge" style="background:rgba(255,255,255,0.06); color:${roleColor}; font-size:0.68rem; padding:2px 6px;">
                ${roleText}
              </span>
              ${u.city ? `<span style="font-size:0.7rem; color:var(--text-dim); margin-left:4px;">📍 ${escapeHtml(u.city)}</span>` : ''}
            </div>
            <div class="conv-snippet-row">
              <span class="conv-snippet">
                ${isSentByMe ? '<span style="color:#10B981; font-size:0.75rem; margin-right:3px;">✓✓</span>' : ''}
                ${escapeHtml(lastMsg.text || 'Görsel veya mesaj paylaşıldı')}
              </span>
              ${unreadCount > 0 ? `<span class="conv-unread-pill">${unreadCount}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  async openThread(conversationId) {
    this.state.activeConversationId = conversationId;
    this.renderConversationsList();

    const chatContainer = document.getElementById('messages-active-thread');
    if (!chatContainer) return;

    chatContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-dim);">
        <div style="text-align:center;">
          <div class="spinner-border" style="width:2rem; height:2rem; margin-bottom:10px;"></div>
          <div>Sohbet yükleniyor...</div>
        </div>
      </div>
    `;

    try {
      const res = await fetch(`/api/messages/thread?conversationId=${encodeURIComponent(conversationId)}&userId=${encodeURIComponent(Auth.currentUser.id)}`);
      const data = await res.json();
      if (data.success) {
        this.state.activeConversation = data.conversation;
        this.state.otherUser = data.otherUser;
        this.state.messages = data.messages || [];
        
        this.renderActiveChat();
        this.scrollToBottom();
        this.updateUnreadBadge();
        
        // Konuşma listesindeki okunmamış adedi sıfırla
        const conv = this.state.conversations.find(c => c.id === conversationId);
        if (conv) conv.unreadCount = 0;
        this.renderConversationsList();
      }
    } catch (err) {
      console.error('Mesajlar yüklenemedi:', err);
    }
  },

  async refreshThreadSilently(conversationId) {
    if (this.state.activeConversationId !== conversationId) return;
    try {
      const res = await fetch(`/api/messages/thread?conversationId=${encodeURIComponent(conversationId)}&userId=${encodeURIComponent(Auth.currentUser.id)}`);
      const data = await res.json();
      if (data.success) {
        const newCount = (data.messages || []).length;
        if (newCount !== this.state.messages.length) {
          this.state.messages = data.messages || [];
          this.renderMessagesOnly();
          this.scrollToBottom();
          this.updateUnreadBadge();
        }
      }
    } catch (e) {}
  },

  renderEmptyChatState() {
    const chatContainer = document.getElementById('messages-active-thread');
    if (!chatContainer) return;
    chatContainer.innerHTML = `
      <div class="chat-empty-state">
        <div class="chat-empty-icon">💬</div>
        <h3 style="color:#FFF; font-weight:700; margin-bottom:6px;">Özel Mesaj Kutunuz</h3>
        <p style="color:var(--text-muted); font-size:0.88rem; max-width:380px; line-height:1.5;">
          Ustalardan tamir randevusu almak, yedek parça satıcılarıyla fiyat görüşmek veya konum paylaşmak için soldan bir sohbet seçin.
        </p>
      </div>
    `;
  },

  renderActiveChat() {
    const chatContainer = document.getElementById('messages-active-thread');
    if (!chatContainer) return;

    const u = this.state.otherUser || {};
    const context = this.state.activeConversation?.context;
    const roleColor = u.role === 'mechanic' ? '#10B981' : (u.role === 'dealer' ? '#F59E0B' : '#3B82F6');
    const roleText = u.role === 'mechanic' ? '🔧 Doğrulanmış Usta' : (u.role === 'dealer' ? '🏪 Doğrulanmış Galeri' : '🚗 Araç Sahibi');

    chatContainer.innerHTML = `
      <!-- Üst Bar: Muhatap Profili & Hızlı İşlemler -->
      <div class="chat-header-bar">
        <div style="display:flex; align-items:center; gap:12px; min-width:0;">
          <div class="conv-avatar-wrap">
            <img src="${escapeHtml(u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150')}" class="conv-avatar" alt="Avatar">
            <span class="online-indicator"></span>
          </div>
          <div style="min-width:0;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="color:#FFF; font-size:1rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${escapeHtml(u.name || 'Kullanıcı')}
              </strong>
              <span class="badge" style="background:rgba(255,255,255,0.06); color:${roleColor}; font-size:0.72rem; padding:2px 8px;">
                ${roleText}
              </span>
            </div>
            <div style="font-size:0.76rem; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
              <span>@${escapeHtml(u.username || 'kullanici')}</span>
              ${u.city ? `<span>• 📍 ${escapeHtml(u.city)}</span>` : ''}
              <span style="color:#10B981;">• Canlı / Çevrimiçi</span>
            </div>
          </div>
        </div>

        <div class="chat-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="App.openUserProfile('${u.id}')" title="Kullanıcı Profilini Görüntüle" style="font-size:0.78rem; padding:6px 12px;">
            👤 Profili Gör
          </button>
          ${u.phone ? `
            <a href="tel:${u.phone}" class="btn btn-secondary btn-sm" style="font-size:0.78rem; padding:6px 12px; color:#10B981; border-color:rgba(16,185,129,0.3);">
              📞 Ara
            </a>
          ` : ''}
        </div>
      </div>

      <!-- Varsa İlan / Teklif Bağlam Bannerı (Context) -->
      ${context ? `
        <div class="chat-context-banner">
          <span style="font-size:1rem;">🛒</span>
          <div style="flex:1; min-width:0; font-size:0.82rem; color:#E2E8F0;">
            <strong>İlgili İlan/Talep:</strong> ${escapeHtml(context.title)}
          </div>
          ${context.url ? `
            <a href="${context.url}" class="btn btn-secondary btn-sm" style="font-size:0.72rem; padding:3px 8px;">Görüntüle</a>
          ` : ''}
        </div>
      ` : ''}

      <!-- Mesaj Akışı Baloncukları -->
      <div id="chat-messages-scroll" class="chat-messages-body">
        <!-- JS render -->
      </div>

      <!-- Hızlı Otomotiv Yanıt Çipleri -->
      <div class="chat-quick-chips">
        <button type="button" class="quick-chip-btn" onclick="Messages.sendLocation()">
          📍 Canlı Konumumu Gönder
        </button>
        <button type="button" class="quick-chip-btn" onclick="Messages.sendQuickReply('💰 Merhaba, bu işlem için güncel parça ve işçilik dahil son fiyatınız nedir?')">
          💰 Son Fiyatınız Nedir?
        </button>
        <button type="button" class="quick-chip-btn" onclick="Messages.sendQuickReply('🗓️ Yarın sabah için uygun musunuz, aracı dükkana getirebilir miyim?')">
          🗓️ Yarın Sabah Randevu
        </button>
        <button type="button" class="quick-chip-btn" onclick="Messages.sendQuickReply('🔧 Parça orijinal mi yoksa muadil/yan sanayi midir?')">
          🔧 Parça Durumu?
        </button>
      </div>

      <!-- Yüklenen Görsel Önizleme Şeridi -->
      <div id="chat-image-preview-bar" class="chat-image-preview-bar" style="display:none;">
        <img id="chat-preview-img" src="" alt="Yüklenecek Görsel">
        <div style="flex:1; font-size:0.78rem; color:#E2E8F0;">
          <span style="font-weight:700;">Görsel eklendi</span> (Gönderilmeye hazır)
        </div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="Messages.clearImagePreview()" style="padding:4px 8px; font-size:0.75rem;">✕ Kaldır</button>
      </div>

      <!-- Mesaj Yazma & Gönderme Alanı -->
      <form id="chat-input-form" class="chat-input-form" onsubmit="Messages.onSubmitMessage(event)">
        <label class="chat-file-btn" title="Fotoğraf veya Ekran Görüntüsü Ekle">
          <input type="file" id="chat-file-input" accept="image/*" style="display:none;" onchange="Messages.handleImageUpload(this)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </label>

        <textarea id="chat-text-input" 
                  class="chat-text-input" 
                  placeholder="Mesajınızı yazın... (Enter ile gönder, Shift+Enter ile alt satır)" 
                  rows="1" 
                  onkeydown="Messages.onInputKeydown(event)"></textarea>

        <button type="submit" id="chat-send-btn" class="chat-send-btn" title="Gönder">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    `;

    this.renderMessagesOnly();
  },

  renderMessagesOnly() {
    const scrollContainer = document.getElementById('chat-messages-scroll');
    if (!scrollContainer) return;

    if (this.state.messages.length === 0) {
      scrollContainer.innerHTML = `
        <div style="text-align:center; padding: 48px 20px; color: var(--text-dim);">
          <div style="font-size:2rem; margin-bottom:8px;">👋</div>
          <div style="font-size:0.95rem; font-weight:700; color:#FFF;">Sohbet Başladı!</div>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">
            İlk mesajı yazarak veya hızlı butonları kullanarak konuşmayı başlatabilirsiniz.
          </p>
        </div>
      `;
      return;
    }

    const currentUserId = Auth.currentUser ? Auth.currentUser.id : null;

    scrollContainer.innerHTML = this.state.messages.map(m => {
      const isMe = m.senderId === currentUserId;
      const timeStr = this.formatTime(m.createdAt);

      return `
        <div class="message-row ${isMe ? 'message-outgoing' : 'message-incoming'}">
          <div class="message-bubble ${isMe ? 'bubble-me' : 'bubble-other'}">
            ${m.image ? `
              <div class="message-image-wrap">
                <img src="${escapeHtml(m.image)}" class="message-attached-img" onclick="window.open('${escapeHtml(m.image)}', '_blank')" alt="Fotoğraf">
              </div>
            ` : ''}

            ${m.location ? `
              <div class="message-location-card">
                <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:#38BDF8; margin-bottom:4px;">
                  <span>📍</span> Canlı Konum Paylaşıldı
                </div>
                <div style="font-size:0.78rem; color:#CBD5E1; margin-bottom:6px;">
                  ${m.location.address || 'Hassas Harita Koordinatları'}
                </div>
                <a href="${m.location.url || `https://www.google.com/maps/search/?api=1&query=${m.location.lat},${m.location.lng}`}" 
                   target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:3px 8px; display:inline-flex; align-items:center; gap:4px; border-color:#38BDF8; color:#38BDF8;">
                  🗺️ Haritada Aç
                </a>
              </div>
            ` : ''}

            ${m.text ? `
              <div class="message-text">${this.formatMessageText(m.text)}</div>
            ` : ''}

            <div class="message-meta-row">
              <span class="message-time">${timeStr}</span>
              ${isMe ? `
                <span class="message-ticks" title="${m.isRead ? 'Görüldü' : 'İletildi'}">
                  ${m.isRead ? '<span style="color:#38BDF8;">✓✓</span>' : '<span style="color:var(--text-dim);">✓✓</span>'}
                </span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  formatMessageText(text) {
    if (!text) return '';
    let escaped = escapeHtml(text);
    // Linkleri tıklanabilir yap
    escaped = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#38BDF8; text-decoration:underline;">$1</a>');
    return escaped.replace(/\n/g, '<br>');
  },

  scrollToBottom() {
    const scrollContainer = document.getElementById('chat-messages-scroll');
    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 50);
    }
  },

  onInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.onSubmitMessage(e);
    }
  },

  async onSubmitMessage(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!this.state.activeConversationId) return;

    const input = document.getElementById('chat-text-input');
    const text = input ? input.value.trim() : '';
    const image = this.state.pendingImage;

    if (!text && !image) return;

    const convId = this.state.activeConversationId;
    const receiverId = this.state.otherUser?.id;

    if (input) input.value = '';
    this.clearImagePreview();

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          senderId: Auth.currentUser.id,
          receiverId: receiverId,
          text: text,
          image: image
        })
      });

      const data = await res.json();
      if (data.success) {
        this.state.messages.push(data.message);
        this.renderMessagesOnly();
        this.scrollToBottom();

        // Sol listedeki son mesajı güncelle
        const c = this.state.conversations.find(conv => conv.id === convId);
        if (c) {
          c.lastMessage = data.message;
          c.updatedAt = data.message.createdAt;
          this.state.conversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          this.renderConversationsList();
        }
      } else {
        showToast(data.error || 'Mesaj gönderilemedi.', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası oluştu.', 'error');
    }
  },

  sendQuickReply(text) {
    const input = document.getElementById('chat-text-input');
    if (input) {
      input.value = text;
      input.focus();
    }
    this.onSubmitMessage();
  },

  sendLocation() {
    if (!navigator.geolocation) {
      this.sendSimulatedLocation();
      return;
    }

    showToast('📍 Canlı GPS konumu alınıyor...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.dispatchLocationMessage(lat, lng, `Hassas Canlı GPS Konumu (±${Math.round(pos.coords.accuracy || 10)}m)`);
      },
      () => {
        // Fallback test konumu
        this.sendSimulatedLocation();
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  },

  sendSimulatedLocation() {
    const lat = 41.1086;
    const lng = 29.0152;
    this.dispatchLocationMessage(lat, lng, 'Maslak Atatürk Oto Sanayi Sitesi, 2. Kısım');
  },

  async dispatchLocationMessage(lat, lng, address) {
    if (!this.state.activeConversationId) return;
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: this.state.activeConversationId,
          senderId: Auth.currentUser.id,
          receiverId: this.state.otherUser?.id,
          text: `📍 Konumumu paylaştım: ${address}`,
          location: { lat, lng, address, url: gmapsUrl }
        })
      });

      const data = await res.json();
      if (data.success) {
        this.state.messages.push(data.message);
        this.renderMessagesOnly();
        this.scrollToBottom();
        showToast('📍 Konumunuz sohbete iletildi.');
      }
    } catch (e) {
      showToast('Konum gönderilemedi.', 'error');
    }
  },

  handleImageUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    if (file.size > 8 * 1024 * 1024) {
      showToast('Görsel boyutu en fazla 8MB olabilir.', 'error');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.pendingImage = e.target.result;
      const previewBar = document.getElementById('chat-image-preview-bar');
      const previewImg = document.getElementById('chat-preview-img');
      if (previewBar && previewImg) {
        previewImg.src = this.state.pendingImage;
        previewBar.style.display = 'flex';
      }
    };
    reader.readAsDataURL(file);
  },

  clearImagePreview() {
    this.state.pendingImage = null;
    const previewBar = document.getElementById('chat-image-preview-bar');
    const fileInput = document.getElementById('chat-file-input');
    if (previewBar) previewBar.style.display = 'none';
    if (fileInput) fileInput.value = '';
  },

  // Dışarıdan doğrudan bir kullanıcıyla sohbet başlatma fonksiyonu
  async startConversationWith(targetUserId, initialMessage = '', contextTitle = '', contextUrl = '') {
    if (!window.Auth || !Auth.currentUser) {
      showToast('Mesaj göndermek için lütfen giriş yapın.', 'warning');
      openModal('login-modal');
      return;
    }

    if (Auth.currentUser.id === targetUserId) {
      showToast('Kendi hesabınıza mesaj gönderemezsiniz.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/messages/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: Auth.currentUser.id,
          targetUserId: targetUserId,
          initialMessage: initialMessage,
          contextTitle: contextTitle,
          contextUrl: contextUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        // Mesajlar sayfasına geç
        if (window.App && App.switchView) {
          App.switchView('view-messages');
        }
        await this.loadConversations(false);
        await this.openThread(data.conversationId);
        showToast('Sohbet penceresi açıldı.');
      } else {
        showToast(data.error || 'Sohbet açılamadı.', 'error');
      }
    } catch (err) {
      showToast('Bağlantı hatası.', 'error');
    }
  },

  formatTime(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');

      if (isToday) return `${hours}:${mins}`;

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return `Dün ${hours}:${mins}`;

      return `${d.getDate()}/${d.getMonth() + 1} ${hours}:${mins}`;
    } catch (e) {
      return '';
    }
  }
};

window.Messages = Messages;
