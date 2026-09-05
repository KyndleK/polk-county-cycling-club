/* PoCo Cycling — shared site JS */

(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Join / signup form — preventDefault + localStorage (no backend)
  const form = document.getElementById("join-form");
  const success = document.getElementById("form-success");
  if (form && success) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const entry = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        city: String(fd.get("city") || "").trim(),
        experience: String(fd.get("experience") || "").trim(),
        hearAbout: String(fd.get("hearAbout") || "").trim(),
        hearRides: fd.get("hearRides") === "on",
        savedAt: new Date().toISOString(),
      };
      try {
        const key = "pocoJoinSignupsV1";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        const list = Array.isArray(prev) ? prev : [];
        list.unshift(entry);
        localStorage.setItem(key, JSON.stringify(list));
      } catch (_) {
        /* ignore storage errors in private mode */
      }
      form.reset();
      form.hidden = true;
      success.classList.add("is-visible");
      success.focus();
    });
  }

  // Load news from JSON when a container is present
  const newsHome = document.getElementById("news-teaser");
  const newsList = document.getElementById("news-list");
  if (newsHome || newsList) {
    loadNews(newsHome, newsList);
  }

  if (window.PoCoRoutes) {
    if (document.body.classList.contains("page-routes")) {
      window.PoCoRoutes.initRoutesPage();
    }
    if (document.body.classList.contains("page-admin")) {
      window.PoCoRoutes.initAdminPage();
    }
  }

  // Home: overlay nav on hero, then sticky solid header after scroll
  const home = document.body.classList.contains("page-home");
  const hero = document.querySelector(".hero-photo");
  if (home && hero) {
    const brandMark = document.getElementById("home-brand-mark");
    const logoWhite = "assets/poco-logo-white.png";
    const logoDark = "assets/poco-logo-transparent.png";
    const syncHomeHeader = function () {
      const header = document.querySelector(".site-header");
      const headerH = header ? header.offsetHeight : 0;
      const heroBottom = hero.getBoundingClientRect().bottom;
      /* absolute header: solid sticky once hero clears the top */
      const scrolled = heroBottom <= headerH + 4;
      document.body.classList.toggle("is-scrolled", scrolled);
      if (brandMark) {
        const next = scrolled ? logoDark : logoWhite;
        if (!brandMark.src.includes(scrolled ? "poco-logo-transparent" : "poco-logo-white")) {
          brandMark.src = next;
        }
      }
    };
    syncHomeHeader();
    window.addEventListener("scroll", syncHomeHeader, { passive: true });
    window.addEventListener("resize", syncHomeHeader);
  }

  initLightbox();
})();

function formatDate(iso) {
  try {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (_) {
    return iso;
  }
}

function postImage(post) {
  if (!post.image) return "";
  const alt = escapeHtml(post.imageAlt || post.title || "Club photo");
  return (
    '<div class="news-thumb">' +
    '<img src="' +
    escapeHtml(post.image) +
    '" alt="' +
    alt +
    '" loading="lazy" width="640" height="420">' +
    "</div>"
  );
}

function postCard(post, compact) {
  const sample = post.sample
    ? '<p class="sample-note">Draft — confirm details in data/news.json</p>'
    : "";
  const img = postImage(post);
  if (compact) {
    return (
      '<article class="card">' +
      img +
      '<span class="tag">' +
      escapeHtml(post.tag || "News") +
      "</span>" +
      "<h3>" +
      escapeHtml(post.title) +
      "</h3>" +
      '<p class="meta">' +
      formatDate(post.date) +
      "</p>" +
      "<p>" +
      escapeHtml(post.excerpt) +
      "</p>" +
      sample +
      "</article>"
    );
  }
  return (
    '<article class="news-item">' +
    img +
    '<span class="tag">' +
    escapeHtml(post.tag || "News") +
    "</span>" +
    "<h3>" +
    escapeHtml(post.title) +
    "</h3>" +
    '<p class="meta">' +
    formatDate(post.date) +
    "</p>" +
    "<p>" +
    escapeHtml(post.excerpt) +
    "</p>" +
    sample +
    "</article>"
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadNews(teaserEl, listEl) {
  const path = "data/news.json";
  fetch(path)
    .then(function (r) {
      if (!r.ok) throw new Error("Could not load news");
      return r.json();
    })
    .then(function (posts) {
      posts.sort(function (a, b) {
        return String(b.date).localeCompare(String(a.date));
      });
      if (teaserEl) {
        if (!posts.length) {
          teaserEl.innerHTML = '<p class="meta">No news yet — check back soon.</p>';
        } else {
          teaserEl.innerHTML = posts
            .slice(0, 3)
            .map(function (p) {
              return postCard(p, true);
            })
            .join("");
        }
      }
      if (listEl) {
        if (!posts.length) {
          listEl.innerHTML = '<p class="meta">No news posts yet. Add items in data/news.json.</p>';
        } else {
          listEl.innerHTML = posts
            .map(function (p) {
              return postCard(p, false);
            })
            .join("");
        }
      }
    })
    .catch(function () {
      const fallback =
        '<p class="meta">News could not be loaded. Open this site via a local server (see README) or edit data/news.json.</p>';
      if (teaserEl) teaserEl.innerHTML = fallback;
      if (listEl) listEl.innerHTML = fallback;
    });
}


function initLightbox() {
  var galleries = document.querySelectorAll(".js-lightbox-gallery");
  if (!galleries.length) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Enlarged photo");
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close photo">&times;</button>' +
    '<div class="lightbox-inner"><img alt=""></div>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector("img");
  var closeBtn = overlay.querySelector(".lightbox-close");
  var lastFocus = null;

  function openLightbox(src, alt) {
    if (!src) return;
    lastFocus = document.activeElement;
    imgEl.src = src;
    imgEl.alt = alt || "";
    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  }

  function closeLightbox() {
    if (overlay.hidden) return;
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    document.body.classList.remove("lightbox-open");
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  function frameFromEvent(target) {
    var el = target;
    if (!el || !el.closest) return null;
    var gallery = el.closest(".js-lightbox-gallery");
    if (!gallery) return null;
    return el.closest(".photo-frame");
  }

  function activateFrame(frame) {
    if (!frame) return;
    var img = frame.querySelector("img");
    if (!img) return;
    var src = img.getAttribute("data-full-src") || img.currentSrc || img.src;
    openLightbox(src, img.alt || "");
  }

  galleries.forEach(function (gallery) {
    gallery.addEventListener("click", function (e) {
      var frame = frameFromEvent(e.target);
      if (!frame) return;
      e.preventDefault();
      activateFrame(frame);
    });

    gallery.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var frame = frameFromEvent(e.target);
      if (!frame) return;
      e.preventDefault();
      activateFrame(frame);
    });
  });

  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    closeLightbox();
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) {
      e.preventDefault();
      closeLightbox();
    }
  });
}
