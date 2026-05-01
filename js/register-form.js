/* register-form.js — show error / success boxes from URL params after the register fragment loads */

document.addEventListener("page:loaded", e => {
    if (e.detail.name !== "register") return;

    const params = new URLSearchParams(location.search);
    const errors = {
        mismatch: "Passwords do not match.",
        taken:    "Username already taken.",
        failed:   "Could not create account, please try again.",
    };

    const errorKey = params.get("error");
    if (errorKey && errors[errorKey]) {
        const t = document.getElementById("error-text");
        const b = document.getElementById("error-box");
        if (t) t.textContent = errors[errorKey];
        if (b) b.classList.remove("hidden");
    }
    if (params.get("ok")) {
        const s = document.getElementById("success-box");
        if (s) s.classList.remove("hidden");
    }
});
