/* =============================================================
 * router.js — hash-based page loader for the layout shell.
 *
 * Pages live as plain HTML fragments at the project root:
 *     home.html | login.html | register.html | profile.html | dashboard.html
 *
 * The shell index.html provides <main id="page-content"></main>.
 * On every hashchange, router fetches the correct fragment and
 * injects it into that slot, then dispatches a `page:loaded`
 * CustomEvent so per-page JS modules can bind to fresh elements.
 *
 * Hash → page mapping:
 *     #home    → home.html       (default if hash is empty or unknown page)
 *     #login   → login.html
 *     #register→ register.html
 *     #profile → profile.html
 *     #dashboard → dashboard.html
 *
 * Anchor hashes (#features, #technology, #team, #formz) are NOT pages —
 * if such a hash arrives while home is the current page, the router
 * just scrolls to that anchor; if home isn't loaded yet, it loads home
 * first and then scrolls.
 * ============================================================= */

(function () {
    const PAGES = ["home", "login", "register", "profile", "dashboard"];
    const TITLES = {
        home:      "Helmet AI | Smart Safety System for Riders",
        login:     "Login — Helmet AI",
        register:  "Register — Helmet AI",
        profile:   "Profile — Helmet AI",
        dashboard: "Dashboard — Helmet AI",
    };

    let currentPage = null;
    let aosInited   = false;

    async function route() {
        const rawHash = location.hash.slice(1);
        const isPage  = PAGES.includes(rawHash);
        const target  = isPage ? rawHash : "home";

        // Fetch + inject only when the target page actually changes.
        if (target !== currentPage) {
            await loadFragment(target);
            currentPage = target;
            document.title = TITLES[target] || TITLES.home;
        }

        // After load, scroll: anchor on home page → that section, else top.
        if (rawHash && !isPage && currentPage === "home") {
            const anchor = document.getElementById(rawHash);
            if (anchor) {
                anchor.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }
        window.scrollTo(0, 0);
    }

    async function loadFragment(name) {
        const slot = document.getElementById("page-content");
        if (!slot) return;

        try {
            const res = await fetch(name + ".html", { credentials: "same-origin" });
            slot.innerHTML = await res.text();
        } catch (err) {
            slot.innerHTML =
                '<div class="text-center py-20 text-red-500">' +
                    '<i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>' +
                    '<p>Failed to load the requested page.</p>' +
                '</div>';
        }

        // Tell per-page modules they can wire up.
        document.dispatchEvent(new CustomEvent("page:loaded", { detail: { name } }));

        // AOS handling — wait two animation frames so the browser has fully
        // laid out the new fragment before we measure element offsets:
        //   • first call → init AOS (only after content is in the DOM)
        //   • later calls → refreshHard to re-attach observers on new nodes
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (typeof AOS === "undefined") return;
            if (!aosInited) {
                AOS.init({ duration: 600, once: true });
                aosInited = true;
            } else if (AOS.refreshHard) {
                AOS.refreshHard();
            }
        }));
    }

    // Images and webfonts can stretch the page after AOS already measured —
    // recalculate offsets once everything finishes loading so below-the-fold
    // animations trigger at the correct scroll positions.
    window.addEventListener("load", () => {
        if (typeof AOS !== "undefined" && AOS.refresh) AOS.refresh();
    });

    window.addEventListener("hashchange", route);
    document.addEventListener("DOMContentLoaded", route);
})();
