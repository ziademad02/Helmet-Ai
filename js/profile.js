/* =============================================================
 * profile.js — fills profile.html from api/profile.php on page:loaded
 * ============================================================= */

document.addEventListener("page:loaded", e => {
    if (e.detail.name !== "profile") return;

    fetch("api/profile.php", { credentials: "same-origin" })
        .then(r => r.json())
        .then(d => {
            if (!d.ok) { location.hash = "#login"; return; }
            renderHeader(d.worker, d.user);
            renderWorker(d.worker);
            renderHelmet(d.helmet);
            renderAlerts(d.alerts);
            renderReadings(d.readings);

            document.getElementById("loading").classList.add("hidden");
            document.getElementById("content").classList.remove("hidden");
        })
        .catch(() => {
            const l = document.getElementById("loading");
            if (l) l.textContent = "Could not load profile.";
        });
});

function renderHeader(worker, user) {
    document.getElementById("avatar").textContent         = worker.full_name.charAt(0).toUpperCase();
    document.getElementById("hello-name").textContent     = worker.full_name;
    document.getElementById("hello-job").textContent      = worker.job_title;
    document.getElementById("hello-username").textContent = user.username;
}

function renderWorker(w) {
    document.getElementById("w-nid").textContent     = w.national_id;
    document.getElementById("w-age").textContent     = w.age;
    document.getElementById("w-phone").textContent   = w.phone;
    document.getElementById("w-hired").textContent   = w.hired_at;
    document.getElementById("w-created").textContent = w.created_at;
}

function renderHelmet(h) {
    const box = document.getElementById("helmet-info");
    if (!h) {
        box.innerHTML =
            '<p class="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">' +
            '<i class="fa-solid fa-circle-info mr-1"></i> ' +
            'No helmet has been assigned to your account yet.</p>';
        return;
    }
    const status = h.status.charAt(0).toUpperCase() + h.status.slice(1);
    box.innerHTML =
        '<div class="space-y-2 text-sm">' +
            row("Helmet ID",   '<span class="font-mono">' + h.helmet_id + '</span>') +
            row("Model",       h.model) +
            row("Firmware",    "v" + h.firmware_version) +
            row("Status",      '<span class="dot dot-' + h.status + '"></span>' + status) +
            row("Assigned at", h.assigned_at, true) +
        '</div>';
}

function row(label, value, last) {
    const cls = last
        ? "flex justify-between py-2"
        : "flex justify-between border-b border-gray-100 dark:border-gray-700 py-2";
    return '<div class="' + cls + '">' +
               '<span class="text-gray-500 dark:text-gray-400">' + label + '</span>' +
               '<span class="font-semibold">' + value + '</span>' +
           '</div>';
}

function renderAlerts(alerts) {
    if (!alerts.length) return;
    document.getElementById("alerts-card").classList.remove("hidden");
    document.getElementById("alerts-count").textContent = alerts.length;
    document.getElementById("alerts-list").innerHTML = alerts.map(al => {
        const danger = al.level === "danger";
        const box  = danger ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
                            : "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500";
        const icon = danger ? "fa-circle-radiation text-red-600"
                            : "fa-bell text-amber-600";
        return '<div class="flex items-start gap-3 p-3 rounded-lg ' + box + '">' +
                   '<i class="fa-solid ' + icon + ' text-lg mt-0.5"></i>' +
                   '<div class="flex-1">' +
                       '<p class="font-semibold capitalize">' + al.type +
                           '<span class="text-xs font-normal text-gray-500 ml-1">&middot; ' + al.level + '</span>' +
                       '</p>' +
                       '<p class="text-sm text-gray-600 dark:text-gray-300">' + al.message + '</p>' +
                       '<p class="text-xs text-gray-400 mt-1">' + al.created_at + '</p>' +
                   '</div>' +
               '</div>';
    }).join("");
}

function renderReadings(readings) {
    if (!readings.length) return;
    document.getElementById("readings-card").classList.remove("hidden");
    document.getElementById("readings-body").innerHTML = readings.map(r =>
        '<tr class="border-b border-gray-100 dark:border-gray-800">' +
            '<td class="py-2 pr-3 text-xs text-gray-500">' + r.recorded_at  + '</td>' +
            '<td class="py-2 pr-3 font-mono">'             + r.temperature_c + '</td>' +
            '<td class="py-2 pr-3 font-mono">'             + r.gas_adc       + '</td>' +
            '<td class="py-2 pr-3 font-mono">'             + r.tilt_deg      + '</td>' +
            '<td class="py-2 pr-3 font-mono">'             + r.battery_v     + '</td>' +
            '<td class="py-2 pr-3 font-mono">'             + r.wifi_rssi + ' dBm</td>' +
        '</tr>'
    ).join("");
}
