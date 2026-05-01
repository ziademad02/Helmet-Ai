/* =============================================================
 * auth-state.js — flips the layout-shell header between guest and
 * logged-in based on api/session.php.
 *
 * Markup contract (in index.html):
 *   - guest pills start `class="auth-guest is-hidden"`
 *   - user  pills start `class="auth-user  is-hidden"`
 *   - element with id="auth-username" gets the user's full name
 *
 * Both sets start hidden so the page never flashes the wrong one
 * during the round-trip to api/session.php. After the response,
 * exactly one set has its `is-hidden` removed.
 *
 * Why `is-hidden` and not Tailwind's `hidden`:
 *   Tailwind responsive utilities like `md:inline-block` override
 *   `hidden` at the md+ breakpoint, so toggling `hidden` from JS
 *   does nothing on desktop. `.is-hidden { display:none !important }`
 *   (in css/style.css) wins regardless of breakpoint.
 * ============================================================= */

(function () {
    fetch("api/session.php", { credentials: "same-origin" })
        .then(r => r.json())
        .then(d => d.ok ? showLoggedIn(d.user) : showGuest())
        .catch(() => showGuest());  // offline / API down → fall back to guest UI

    function showGuest() {
        document.querySelectorAll(".auth-guest").forEach(el => el.classList.remove("is-hidden"));
    }

    function showLoggedIn(user) {
        document.querySelectorAll(".auth-user").forEach(el => el.classList.remove("is-hidden"));
        const nameEl = document.getElementById("auth-username");
        if (nameEl) nameEl.textContent = user.full_name || user.username || "";
    }
})();
