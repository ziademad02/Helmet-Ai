/* login-form.js — show error box if URL has ?error=1, after the login fragment loads */

document.addEventListener("page:loaded", e => {
    if (e.detail.name !== "login") return;
    if (!new URLSearchParams(location.search).get("error")) return;
    const box = document.getElementById("error-box");
    if (box) box.classList.remove("hidden");
});
