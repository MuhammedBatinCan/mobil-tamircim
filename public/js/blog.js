// MOBİL TAMİRCİM - SANAYİ & OTOMOTİV BLOG / REHBERLER MODÜLÜ

const Blog = {
  posts: [],
  activeCategory: 'all',
  activePost: null,

  init(initialPosts) {
    this.posts = Array.isArray(initialPosts) ? initialPosts : [];
    this.render();
  },

  setCategory(category, btn) {
    this.activeCategory = category;
    if (btn) {
      document.querySelectorAll('#blog-category-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.render();
  },

  getFilteredPosts() {
    if (this.activeCategory === 'all') return this.posts;
    return this.posts.filter(p => p.category === this.activeCategory);
  },

  render() {
    const container = document.getElementById('blog-feed');
    if (!container) return;

    const list = this.getFilteredPosts();
    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding:40px; text-align:center;">
          <p style="color:var(--text-muted);">Bu kategoride henüz yazı bulunmuyor.</p>
        </div>
      `;
      return;
    }

    // İlk makaleyi manşet (featured), kalanları ızgara (grid) olarak göster
    const featured = list[0];
    const rest = list.slice(1);

    container.innerHTML = `
      <!-- Öne Çıkan Manşet Makale (Hero Card) -->
      ${featured ? `
        <div class="blog-hero-card sidebar-card" onclick="Blog.openPost('${featured.slug}')">
          <div class="blog-hero-img-wrap">
            <img class="blog-hero-img" src="${featured.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000'}" alt="${escapeHtml(featured.title)}">
            <span class="blog-category-badge">${escapeHtml(featured.category)}</span>
          </div>
          <div class="blog-hero-body">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; font-size:0.75rem; color:var(--text-muted);">
              <span>⏱️ ${escapeHtml(featured.readTime || '5 dk okuma')}</span>
              <span>•</span>
              <span>👀 ${new Intl.NumberFormat('tr-TR').format(featured.views || 0)} Okunma</span>
              <span>•</span>
              <span>❤️ ${featured.likes || 0} Beğeni</span>
            </div>
            <h2 class="blog-hero-title">${escapeHtml(featured.title)}</h2>
            <p class="blog-hero-excerpt">${escapeHtml(featured.excerpt || '')}</p>
            <div class="blog-author-row">
              <img src="${featured.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}" class="blog-author-img" alt="Yazar">
              <div>
                <span class="blog-author-name">${escapeHtml(featured.author || 'Mobil Tamircim')}</span>
                <span class="blog-date">${featured.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Diğer Makaleler Izgarası (Grid) -->
      <div class="blog-grid" style="margin-top:20px;">
        ${rest.map(post => `
          <div class="blog-card sidebar-card" onclick="Blog.openPost('${post.slug}')">
            <div class="blog-card-img-wrap">
              <img class="blog-card-img" src="${post.coverImage || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600'}" alt="${escapeHtml(post.title)}" loading="lazy">
              <span class="blog-category-badge">${escapeHtml(post.category)}</span>
            </div>
            <div class="blog-card-body">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px; font-size:0.72rem; color:var(--text-muted);">
                <span>⏱️ ${escapeHtml(post.readTime || '4 dk')}</span>
                <span>•</span>
                <span>👀 ${new Intl.NumberFormat('tr-TR').format(post.views || 0)}</span>
                <span>•</span>
                <span>❤️ ${post.likes || 0}</span>
              </div>
              <h4 class="blog-card-title">${escapeHtml(post.title)}</h4>
              <p class="blog-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
              <div class="blog-author-row" style="margin-top:auto;">
                <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'}" class="blog-author-img-sm" alt="Yazar">
                <div>
                  <span class="blog-author-name" style="font-size:0.75rem;">${escapeHtml(post.author || 'Mobil Tamircim')}</span>
                  <span class="blog-date" style="font-size:0.7rem;">${post.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async openPost(slug) {
    const post = this.posts.find(p => p.slug === slug || p.id === slug);
    if (!post) return;

    this.activePost = post;
    const container = document.getElementById('blog-detail-content');
    if (!container) return;

    // Increment views via API in background
    fetch(`/api/blog/${slug}`).catch(() => {});
    post.views = (post.views || 0) + 1;

    container.innerHTML = `
      <div class="blog-detail-nav">
        <button class="btn btn-secondary btn-sm" onclick="App.switchView('view-blog')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Rehberlere Dön
        </button>
        <span class="badge badge-primary">${escapeHtml(post.category)}</span>
      </div>

      <article class="blog-article sidebar-card" style="padding:28px 24px; margin-top:14px;">
        <h1 class="blog-article-title">${escapeHtml(post.title)}</h1>
        
        <div class="blog-article-meta">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid var(--accent-amber);" alt="Yazar">
            <div>
              <strong style="color:#FFF; font-size:0.88rem; display:block;">${escapeHtml(post.author)}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${post.createdAt} • ${escapeHtml(post.readTime)}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px;">
            <button id="blog-like-btn" class="btn btn-secondary btn-sm" onclick="Blog.likeCurrentPost('${post.id}')" style="display:flex; align-items:center; gap:6px;">
              <span>❤️</span> <span id="blog-like-count">${post.likes || 0}</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(window.location.href); showToast('Bağlantı kopyalandı! 📋');" title="Paylaş">
              🔗 Paylaş
            </button>
          </div>
        </div>

        <div class="blog-article-cover-wrap">
          <img class="blog-article-cover" src="${post.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200'}" alt="${escapeHtml(post.title)}">
        </div>

        <div class="blog-article-body">
          ${post.content || `<p>${escapeHtml(post.excerpt)}</p>`}
        </div>

        <!-- Etiketler -->
        ${(post.tags && post.tags.length > 0) ? `
          <div class="blog-tags-row" style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); display:flex; flex-wrap:wrap; gap:6px;">
            ${post.tags.map(t => `<span class="badge badge-secondary" style="font-size:0.75rem;">#${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Alt Forum Tartışması Kutusu -->
        <div class="blog-forum-cta" style="margin-top:28px; background:linear-gradient(135deg, rgba(245,158,11,0.1), rgba(15,23,42,0.8)); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h4 style="color:#FFF; font-size:1rem; margin:0 0 4px 0;">Bu Konuda Yaşadığınız Bir Arıza mı Var?</h4>
            <p style="color:var(--text-secondary); font-size:0.82rem; margin:0;">
              Mobil Tamircim forumunda diğer araç sahipleri ve ustalara ücretsiz danışabilirsiniz.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="App.switchView('view-forum')">
            Forumda Tartış & Konu Aç
          </button>
        </div>
      </article>
    `;

    App.switchView('view-blog-detail');
  },

  async likeCurrentPost(postId) {
    if (!this.activePost) return;
    try {
      const res = await fetch(`/api/blog/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        this.activePost.likes = data.likes;
        const countEl = document.getElementById('blog-like-count');
        if (countEl) countEl.textContent = data.likes;
        showToast('Yazıyı beğendiniz! ❤️');
      }
    } catch (err) {
      console.error(err);
    }
  }
};
