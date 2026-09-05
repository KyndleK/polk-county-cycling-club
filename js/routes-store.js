/* PoCo Cycling — route submissions (localStorage prototype) */

(function (global) {
  var STORAGE_KEY = "pocoRoutesV1";
  var AUTH_KEY = "pocoAdminAuth";
  var ADMIN_PASSWORD = "poco";

  function uid() {
    return "r_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  }

  function saveAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function submitRoute(payload) {
    var list = loadAll();
    var entry = {
      id: uid(),
      title: String(payload.title || "").trim(),
      description: String(payload.description || "").trim(),
      distance: String(payload.distance || "").trim(),
      url: String(payload.url || "").trim(),
      submitterName: String(payload.submitterName || "").trim(),
      submitterEmail: String(payload.submitterEmail || "").trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    list.unshift(entry);
    saveAll(list);
    return entry;
  }

  function setStatus(id, status) {
    var list = loadAll();
    var found = false;
    list = list
      .map(function (r) {
        if (r.id !== id) return r;
        found = true;
        if (status === "rejected") return null;
        return Object.assign({}, r, { status: status });
      })
      .filter(Boolean);
    saveAll(list);
    return found;
  }

  function published() {
    return loadAll().filter(function (r) {
      return r.status === "published";
    });
  }

  function pending() {
    return loadAll().filter(function (r) {
      return r.status === "pending";
    });
  }

  function isAuthed() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function tryLogin(password) {
    if (String(password) === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch (_) {}
      return true;
    }
    return false;
  }

  function logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch (_) {}
  }

  function renderPublished(container) {
    if (!container) return;
    var routes = published();
    if (!routes.length) {
      container.innerHTML = "";
      container.hidden = true;
      return;
    }
    container.hidden = false;
    container.innerHTML = routes
      .map(function (r) {
        var dist = r.distance
          ? escapeHtml(r.distance)
          : "Distance TBD";
        var link = r.url
          ? '<a class="btn btn-outline" href="' +
            escapeHtml(r.url) +
            '" target="_blank" rel="noopener noreferrer">Open route</a>'
          : "";
        return (
          '<article class="card">' +
          '<span class="tag">Community</span>' +
          "<h3>" +
          escapeHtml(r.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(r.description || "Member-submitted route.") +
          "</p>" +
          '<p class="meta"><strong>' +
          dist +
          "</strong> · Elevation: see link / TBD · Approved by club</p>" +
          link +
          "</article>"
        );
      })
      .join("");
  }

  function initSubmitForm() {
    var form = document.getElementById("route-submit-form");
    var success = document.getElementById("route-submit-success");
    if (!form || !success) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      submitRoute({
        title: fd.get("title"),
        description: fd.get("description"),
        distance: fd.get("distance"),
        url: fd.get("url"),
        submitterName: fd.get("submitterName"),
        submitterEmail: fd.get("submitterEmail"),
      });
      form.reset();
      form.hidden = true;
      success.classList.add("is-visible");
      success.focus();
      var pub = document.getElementById("published-routes");
      renderPublished(pub);
    });
  }

  function initRoutesPage() {
    renderPublished(document.getElementById("published-routes"));
    initSubmitForm();
  }

  function renderAdminList() {
    var listEl = document.getElementById("admin-pending-list");
    var emptyEl = document.getElementById("admin-pending-empty");
    if (!listEl) return;
    var items = pending();
    if (!items.length) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    listEl.innerHTML = items
      .map(function (r) {
        return (
          '<article class="admin-item" data-id="' +
          escapeHtml(r.id) +
          '">' +
          "<div>" +
          "<h3>" +
          escapeHtml(r.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(r.description || "") +
          "</p>" +
          '<p class="meta">' +
          (r.distance ? escapeHtml(r.distance) + " · " : "") +
          (r.url
            ? '<a href="' +
              escapeHtml(r.url) +
              '" target="_blank" rel="noopener noreferrer">Route link</a> · '
            : "") +
          "from " +
          escapeHtml(r.submitterName) +
          " &lt;" +
          escapeHtml(r.submitterEmail) +
          "&gt;</p>" +
          "</div>" +
          '<div class="admin-actions">' +
          '<button type="button" class="btn" data-action="approve">Approve</button>' +
          '<button type="button" class="btn btn-outline" data-action="reject">Reject</button>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    listEl.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var article = btn.closest(".admin-item");
        var id = article && article.getAttribute("data-id");
        if (!id) return;
        if (btn.getAttribute("data-action") === "approve") {
          setStatus(id, "published");
        } else {
          setStatus(id, "rejected");
        }
        renderAdminList();
        renderPublished(document.getElementById("published-routes"));
      });
    });
  }

  function initAdminPage() {
    var gate = document.getElementById("admin-gate");
    var panel = document.getElementById("admin-panel");
    var loginForm = document.getElementById("admin-login-form");
    var err = document.getElementById("admin-login-error");
    var logoutBtn = document.getElementById("admin-logout");

    function showPanel() {
      if (gate) gate.hidden = true;
      if (panel) panel.hidden = false;
      renderAdminList();
    }

    function showGate() {
      if (gate) gate.hidden = false;
      if (panel) panel.hidden = true;
    }

    if (isAuthed()) showPanel();
    else showGate();

    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var pw = new FormData(loginForm).get("password");
        if (tryLogin(pw)) {
          if (err) err.hidden = true;
          showPanel();
        } else if (err) {
          err.hidden = false;
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        logout();
        showGate();
      });
    }
  }

  global.PoCoRoutes = {
    initRoutesPage: initRoutesPage,
    initAdminPage: initAdminPage,
    ADMIN_PASSWORD: ADMIN_PASSWORD,
  };
})(window);
