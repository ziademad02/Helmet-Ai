/* =============================================================
 * chat.js — Helmet AI chat widget
 * Talks to the PHP endpoint at api/chat.php,
 * which proxies to the Groq LLM API.
 * Bindings are element-id based — no inline onclick anywhere.
 * ============================================================= */

(function () {
    let language = "en";
    const history = [];

    const SYSTEM_PROMPT = `
You are an expert AI assistant for a graduation project called:

"Smart AR Safety Helmet + AI Mental Health Assistant"

🌍 LANGUAGE MODE
- Default: English
- If user says "اتكلم عربي" → reply ONLY in Arabic
- If user says "english" → reply ONLY in English

🎯 YOUR JOB
- Answer ANY question about the project
- Explain like a professional engineer

🪖 PROJECT DETAILS

HELMET FEATURES:
1) Object Detection — camera + YOLO/MobileNet SSD
2) Gas Detection — MQ-2 sensor
3) Temperature — BMP280 / MLX90614
4) Distance — VL53L0X
5) Fall Detection — MPU6050 (>2.5g triggers fall)
6) Tilt Monitoring
7) Alerts — SAFE / WARNING / DANGER
8) OLED HUD display
9) Live camera stream
10) Raspberry Pi main device

🧠 AI MENTAL HEALTH SYSTEM:
- Voice input (3–5 s)
- MFCC features + CNN
- Detects: stress, fatigue, mood
- Recommendations: take a break, drink water, contact supervisor

👨‍💻 TEAM:
- Mustafa Ahmed (Team Leader)
- Sara Mohamed (Embedded Systems Engineer)
- Emy Said (AI Engineer)
- Donia Khaled (UI / UX Designer)
- Hager Mahmoud (Frontend Developer)
- Nada Samy (Data Analyst)
- Salma Nagi (Backend Developer)
- Mohamed Ashraf (Software Developer)
- Hassan Mahmoud (Hardware Engineer)
- Ziad Emad (Software Developer)

⚠️ RULES:
- Only answer about this project. Politely decline unrelated questions.
- "Who is X?" → role + what they do
`;

    function $(id) { return document.getElementById(id); }

    function appendUser(text) {
        $("messages").innerHTML +=
            '<div class="text-right">' +
                '<div class="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-xl max-w-[80%]">' +
                    text +
                '</div>' +
            '</div>';
    }

    function appendBot(text) {
        const messages = $("messages");
        const div = document.createElement("div");
        div.className = "bg-gray-200 dark:bg-slate-700 text-black dark:text-white p-3 rounded-xl shadow";
        messages.appendChild(div);
        let i = 0;
        const t = setInterval(() => {
            div.innerHTML += text[i++] || "";
            if (i >= text.length) clearInterval(t);
        }, 10);
    }

    function welcomeMessage() {
        $("messages").innerHTML +=
            '<div class="bg-gray-200 dark:bg-slate-700 text-black dark:text-white p-3 rounded-xl shadow">' +
                '👋 Welcome! Ask me about Helmet AI' +
            '</div>';
    }

    function toggleChat() {
        const box = $("chatBox");
        if (!box) return;
        box.classList.toggle("hidden");
        if (box.dataset.opened !== "true") {
            welcomeMessage();
            box.dataset.opened = "true";
        }
    }

    async function sendMessage() {
        const input = $("input");
        const msg = input.value.trim();
        if (!msg) return;

        appendUser(msg);
        input.value = "";

        if (msg.includes("اتكلم عربي")) { language = "ar"; return appendBot("تم التحويل للعربية"); }
        if (msg.toLowerCase().includes("english")) { language = "en"; return appendBot("Switched to English"); }

        history.push({ role: "user", content: msg });

        try {
            const res = await fetch("api/chat.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        ...history
                    ]
                })
            });
            const data = await res.json();
            if (!data.choices) return appendBot("API Error");

            const reply = data.choices[0].message.content;
            history.push({ role: "assistant", content: reply });
            appendBot(reply);
        } catch (err) {
            console.error(err);
            appendBot("Network error");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".chat-toggle").forEach(b =>
            b.addEventListener("click", toggleChat)
        );
        const sendBtn = $("chat-send");
        if (sendBtn) sendBtn.addEventListener("click", sendMessage);

        const input = $("input");
        if (input) input.addEventListener("keydown", e => {
            if (e.key === "Enter") sendMessage();
        });
    });
})();
