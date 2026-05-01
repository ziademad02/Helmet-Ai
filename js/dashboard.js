/* =============================================================
 * dashboard.js — fills dashboard.html from api/dashboard.php on page:loaded
 * ============================================================= */

document.addEventListener("page:loaded", e => {
    if (e.detail.name !== "dashboard") return;

    document.querySelectorAll(".filter-pill").forEach(a => {
        a.addEventListener("click", evt => {
            evt.preventDefault();
            loadDashboard(a.dataset.view);
        });
    });

    loadDashboard();
});

const PILL_ACTIVE   = "bg-purple-600 text-white";
const PILL_INACTIVE = "bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600";

function loadDashboard(view) {
    const url = view ? ("api/dashboard.php?view=" + view) : "api/dashboard.php";
    fetch(url, { credentials: "same-origin" })
        .then(r => r.json())
        .then(d => {
            if (!d.ok) { location.hash = "#login"; return; }
            renderStats(d.stats);
            paintFilterPills(d.view);
            renderHelmets(d.helmets);

            document.getElementById("loading").classList.add("hidden");
            document.getElementById("content").classList.remove("hidden");
        })
        .catch(() => {
            const l = document.getElementById("loading");
            if (l) l.textContent = "Could not load fleet data.";
        });
}

function renderStats(s) {
    document.getElementById("s-workers").textContent  = s.workers;
    document.getElementById("s-helmets").textContent  = s.helmets;
    document.getElementById("s-active").textContent   = s.active;
    document.getElementById("s-alerts").textContent   = s.open_alerts;
    document.getElementById("s-readings").textContent = s.readings;
}

function paintFilterPills(currentView) {
    document.querySelectorAll(".filter-pill").forEach(a => {
        const base = "filter-pill px-4 py-1.5 rounded-full font-semibold transition ";
        a.className = base + (a.dataset.view === currentView ? PILL_ACTIVE : PILL_INACTIVE);
    });
}

function renderHelmets(helmets) {
    const grid  = document.getElementById("helmets-grid");
    const empty = document.getElementById("empty-state");

    if (helmets.length === 0) {
        grid.innerHTML = "";
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    grid.innerHTML = "";
    helmets.forEach(h => grid.appendChild(buildHelmetCard(h)));
}

function buildHelmetCard(h) {
    const pct = batteryPercent(h.battery_v);
    const col = batteryColor(pct);
    const card = document.createElement("div");
    card.className = "bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 hover:shadow-lg transition";

    const workerName = h.worker_name
        ? escapeHtml(h.worker_name)
        : '<span class="italic text-gray-400">Unassigned</span>';

    const pendingBadge = h.pending > 0
        ? '<span class="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold px-2 py-0.5 rounded-full">' +
              '<i class="fa-solid fa-bell mr-1"></i>' + h.pending +
              ' alert' + (h.pending > 1 ? "s" : "") +
          '</span>'
        : "";

    card.innerHTML =
        '<div class="flex items-start justify-between mb-3">' +
            '<div>' +
                '<h3 class="text-lg font-bold flex items-center gap-2">' +
                    '<i class="fa-solid fa-helmet-safety text-purple-600"></i>' +
                    h.helmet_id +
                '</h3>' +
                '<p class="text-xs text-gray-500">' + h.model + ' &middot; v' + h.firmware_version + '</p>' +
            '</div>' +
            '<span class="text-xs font-semibold capitalize">' +
                '<span class="dot dot-' + h.status + '"></span>' + h.status +
            '</span>' +
        '</div>' +
        '<p class="text-sm mb-3">' +
            '<i class="fa-solid fa-user text-gray-400 mr-1"></i>' + workerName +
        '</p>' +
        '<p class="text-xs text-gray-500 dark:text-gray-400 mb-1 flex justify-between">' +
            '<span>Battery</span>' +
            '<span class="font-mono">' + (pct === null ? "—" : pct + "%") + '</span>' +
        '</p>' +
        '<div class="battery-bar mb-3"><div class="battery-fill"></div></div>' +
        '<div class="flex items-center justify-between text-xs">' +
            '<span class="text-gray-500 dark:text-gray-400">' +
                '<i class="fa-regular fa-clock mr-1"></i>' + (h.last_seen || "—") +
            '</span>' +
            pendingBadge +
        '</div>';

    const fill = card.querySelector(".battery-fill");
    fill.style.width      = (pct === null ? 0 : pct) + "%";
    fill.style.background = col;
    return card;
}

function batteryPercent(v) {
    if (v === null || v === undefined) return null;
    const p = ((v - 3.0) / (4.2 - 3.0)) * 100;
    return Math.max(0, Math.min(100, Math.round(p)));
}

function batteryColor(p) {
    if (p === null) return "#9ca3af";
    if (p >= 60)    return "#16a34a";
    if (p >= 30)    return "#f59e0b";
    return "#dc2626";
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
}
