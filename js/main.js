/* =============================================================
 * main.js — site-wide JS for the Helmet AI shell.
 *
 * Two kinds of behaviors live here:
 *   (a) Shell-level — bind once on DOMContentLoaded.
 *       Examples: mobile menu, theme toggle, AOS init.
 *   (b) Page-level — bind on every `page:loaded` event because
 *       the relevant elements only appear after the router
 *       injects the corresponding fragment.
 *       Examples: hero typing, video modal, carousel, contact
 *       form (home), confirm-password live check (register).
 *
 * Each block guards itself with element-existence checks so it
 * silently no-ops when the matching markup isn't present.
 * ============================================================= */


// =============== Shell-level (bind once) ===============

// ---- Mobile side menu ----
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn  = document.getElementById("menu-btn");
    const sideMenu = document.getElementById("side-menu");
    const closeBtn = document.getElementById("close-menu");
    if (!menuBtn || !sideMenu || !closeBtn) return;

    menuBtn.addEventListener("click",  () => sideMenu.classList.remove("-translate-x-full"));
    closeBtn.addEventListener("click", () => sideMenu.classList.add("-translate-x-full"));

    // Close on any nav-link click in the sidebar
    sideMenu.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", () => sideMenu.classList.add("-translate-x-full"))
    );
});


// ---- Dark-mode toggle ----
(function () {
    const KEY = "theme";
    const root = document.documentElement;
    if (localStorage.getItem(KEY) === "dark") root.classList.add("dark");

    document.addEventListener("DOMContentLoaded", () => {
        const btn = document.getElementById("theme-toggle");
        if (!btn) return;
        btn.addEventListener("click", () => {
            root.classList.toggle("dark");
            localStorage.setItem(KEY, root.classList.contains("dark") ? "dark" : "light");
        });
    });
})();


// AOS is initialized + refreshed inside router.js — see js/router.js.
// Initializing here on DOMContentLoaded would run against an empty
// #page-content slot and produce wrong scroll offsets for the home page.


// =============== Page-level (bind on each page:loaded) ===============

document.addEventListener("page:loaded", e => {
    const page = e.detail.name;

    if (page === "home") {
        initTyping();
        initVideoModal();
        initCarousel();
        initContactForm();
    }
    if (page === "register") {
        initPasswordMatch();
    }
});


// ---- Hero typing animation ----
function initTyping() {
    const el = document.getElementById("typing");
    if (!el) return;

    const text = "Smart Helmet\nProtection Powered\nby AI";
    const TYPE_MS = 120, DELETE_MS = 80, PAUSE_MS = 5000;
    let pos = 0, deleting = false;

    (function tick() {
        if (!el.isConnected) return; // page swapped out — stop
        if (!deleting) {
            el.textContent = text.substring(0, ++pos);
            if (pos === text.length) { deleting = true; return setTimeout(tick, PAUSE_MS); }
        } else {
            el.textContent = text.substring(0, --pos);
            if (pos === 0) deleting = false;
        }
        setTimeout(tick, deleting ? DELETE_MS : TYPE_MS);
    })();
}


// ---- Video modal ----
function initVideoModal() {
    const openBtn  = document.getElementById("open-video");
    const closeBtn = document.getElementById("close-video");
    const modal    = document.getElementById("videoModal");
    const video    = document.getElementById("demoVideo");
    if (!openBtn || !closeBtn || !modal) return;

    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => {
        if (video) { video.pause(); video.currentTime = 0; }
        modal.classList.add("hidden");
    });
}


// ---- Technology showcase carousel ----
function initCarousel() {
    const carousel = document.getElementById("carousel");
    if (!carousel) return;

    const SLIDES = 3;
    let i = 0;

    function show() { carousel.style.transform = `translateX(-${i * 100}%)`; }
    function next() { i = (i + 1) % SLIDES;          show(); }
    function prev() { i = (i - 1 + SLIDES) % SLIDES; show(); }

    const nextBtn = document.getElementById("next-slide");
    const prevBtn = document.getElementById("prev-slide");
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    setInterval(() => { if (carousel.isConnected) next(); }, 6000);
}


// ---- Contact form (home page) ----
function initContactForm() {
    const form  = document.getElementById("contactForm");
    const name  = document.getElementById("name");
    const email = document.getElementById("email");
    if (!form || !name || !email) return;

    name.addEventListener("input", () => {
        email.value = name.value.toLowerCase().replace(/\s+/g, "") + "@gmail.com";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = form.querySelector("textarea").value.trim();
        if (!name.value.trim() || !email.value.trim() || !message) {
            return alert("Please fill all fields");
        }
        const alertBox = document.getElementById("customAlert");
        if (alertBox) {
            alertBox.classList.remove("hidden");
            setTimeout(() => { alertBox.classList.add("hidden"); form.submit(); }, 2000);
        } else {
            form.submit();
        }
    });
}


// ---- Confirm-password live check (register page) ----
function initPasswordMatch() {
    const pwd     = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const note    = document.getElementById("pwd-note");
    if (!pwd || !confirm || !note) return;

    function check() {
        if (!confirm.value.length) { note.textContent = ""; return; }
        if (pwd.value === confirm.value) {
            note.textContent = "✓ Passwords match";
            note.className   = "text-green-600 text-xs mt-1";
        } else {
            note.textContent = "✗ Passwords do not match";
            note.className   = "text-red-600 text-xs mt-1";
        }
    }
    pwd.addEventListener("input", check);
    confirm.addEventListener("input", check);
}
