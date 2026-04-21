// typing text yaa abd
const text = `Smart Helmet
Protection Powered
by AI`;

let charPos = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing");
// السرعات (تتحكم فيهم براحتك)
const typingSpeed = 120;    
const deletingSpeed = 80;    
const delayAfterTyping = 5000; 
function type() {
  if (!isDeleting) {
    typingElement.textContent = text.substring(0, charPos + 1);
    charPos++;
    if (charPos === text.length) {
      isDeleting = true;
      setTimeout(type, delayAfterTyping);
      return;
    }
  } else {
    typingElement.textContent = text.substring(0, charPos - 1);
    charPos--;
    if (charPos === 0) {
      isDeleting = false;
    }
  }
  setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
}
type();
// Model vidio ya abd
const menuBtn = document.getElementById("menu-btn")
const sideMenu = document.getElementById("side-menu")
const closeBtn = document.getElementById("close-menu")
let video = document.getElementById("demoVideo");
menuBtn.onclick = () => {
sideMenu.classList.remove("-translate-x-full");
}
closeBtn.onclick = () => {
sideMenu.classList.add("-translate-x-full");
}
function openVideo(){
document.getElementById("videoModal").classList.remove("hidden");
}
function closeVideo(){
video.pause();      
video.currentTime = 0; 
document.getElementById("videoModal").classList.add("hidden");
}

AOS.init({
  duration: 600,
  once: true,
  // disable: function () {
  //   return window.innerWidth < 768;
  // }
});

// carousel
let index = 0;
const carousel = document.getElementById("carousel");
function showSlide() {
carousel.style.transform = `translateX(-${index * 100}%)`;
}
function nextSlide(){
index++;
if(index > 2){index = 0;}
showSlide();
}
function prevSlide(){
index--;
if(index < 0){index = 2;}
showSlide();
}
setInterval(nextSlide, 6000); //  slideبيجيب اللي بعده
// form
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
nameInput.addEventListener("input", function(){
let nameValue = nameInput.value
.toLowerCase()
.replace(/\s+/g,"");
emailInput.value = nameValue + "@gmail.com";
});
form.addEventListener("submit", function(e){
e.preventDefault();
const name = nameInput.value.trim();
const email = emailInput.value.trim();
const message = form.querySelector('textarea').value.trim();
if(name === "" || email === "" || message === ""){
alert("Please fill all fields");
return;
}
const alertBox = document.getElementById("customAlert");
alertBox.classList.remove("hidden");
setTimeout(()=>{
alertBox.classList.add("hidden");
form.submit();   // هنا يتم إرسال البيانات للـ backend
},2000);
});
// Dark Mode
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
    }
    toggleBtn.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        if (document.documentElement.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});

let language = "en";
let chatHistory = [];
function toggleChat(){
  const box = document.getElementById("chatBox");
  box.classList.toggle("hidden");

  if (box.dataset.opened !== "true") {
    welcomeMessage();
    box.dataset.opened = "true";
  }
}

function welcomeMessage(){
  messages.innerHTML += `
    <div class="bg-gray-200 dark:bg-slate-700 text-black dark:text-white p-3 rounded-xl shadow">
      👋 Welcome! Ask me about Helmet AI
    </div>
  `;
}
function addUserMessage(text){
  messages.innerHTML += `
    <div class="text-right">
      <div class="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white  px-4 py-2 rounded-xl max-w-[80%]">
        ${text}
      </div>
    </div>
  `;
}
function addAIMessage(text){
  messages.innerHTML += `
    <div class="text-left">
      <div class="inline-block bg-gray-200 dark:bg-slate-700 
        text-black dark:text-white px-4 py-2 rounded-xl max-w-[80%]">
        ${text}
      </div>
    </div>
  `;
}
function typeText(text){
  const div = document.createElement("div");
  div.className = "bg-gray-200 dark:bg-slate-700 text-black dark:text-white p-3 rounded-xl shadow";
  messages.appendChild(div);
  let i = 0;
  const interval = setInterval(()=>{
    div.innerHTML += text[i];
    i++;
    if(i >= text.length) clearInterval(interval);
  },10);
}

async function sendMessage(){
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if(!msg) return;

  addUserMessage(msg);
  input.value = "";
  // تغيير اللغة
  if(msg.includes("اتكلم عربي")){
    language = "ar";
    typeText("تم التحويل للعربية");
    return;
  }
  if(msg.toLowerCase().includes("english")){
    language = "en";
    typeText("Switched to English");
    return;
  }
  chatHistory.push({ role: "user", content: msg });
  try {
    const res = await fetch("/api/chat",   {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // أخف ومضمون
        messages: [
          {
  role: "system",
  content: `
You are an expert AI assistant for a graduation project called:

"Smart AR Safety Helmet + AI Mental Health Assistant"

==================================
🌍 LANGUAGE MODE
- Default language: English
- If user says "اتكلم عربي" → reply ONLY in Arabic
- If user says "english" → reply ONLY in English
- Continue in the selected language

==================================
🎯 YOUR JOB
- Answer ANY question about the project
- Explain like a professional engineer
- Be clear, smart, and structured
- Use bullet points when needed

==================================
🪖 PROJECT DETAILS

SYSTEM OVERVIEW:
A smart wearable safety helmet that protects workers physically and mentally.

----------------------------------
HELMET FEATURES:

1) Object Detection:
- Uses camera + AI (YOLO / MobileNet SSD)
- Detects humans, vehicles, tools
- Shows bounding boxes

2) Gas Detection:
- Sensor: MQ-2
- Detects toxic gases
- Triggers danger alert

3) Temperature Monitoring:
- Sensors: BMP280 / MLX90614
- Shows temperature on HUD

4) Distance Detection:
- Sensor: VL53L0X
- Warns if obstacle is near

5) Fall Detection:
- Sensor: MPU6050
- If acceleration > 2.5g → fall detected

6) Tilt Monitoring:
- Detects dangerous body angle

7) Alerts System:
- SAFE → normal
- WARNING → risk
- DANGER → high risk
- Uses buzzer + screen

8) Display:
- OLED HUD screen
- Shows live data

9) Video System:
- Live camera stream
- Real-time detection

10) Main Device:
- Raspberry Pi
- Runs automatically on startup

----------------------------------
🧠 AI MENTAL HEALTH SYSTEM:

- Takes voice input (3–5 seconds)
- Extracts features (MFCC)
- Uses CNN model

Detects:
- Stress
- Fatigue
- Mood (happy, sad, angry, fear)

Outputs:
- stress %
- fatigue %
- mood

Recommendations:
- Take a break
- Drink water
- Contact supervisor

----------------------------------
🌐 SYSTEM OUTPUT:

- Alerts on helmet screen (HUD)
- Data sent to dashboard
- Real-time monitoring

----------------------------------
// 👨‍💻 TEAM MEMBERS:

- Mostafa Mohamed (Team Leader)
- Ziad Emad (Software Developer)
- Salma Nagi (Backend Developer)
- Sara Mohamed (Embedded Systems Engineer)
- Amy Said (AI Engineer)
- Donia Mohamed (UI/UX Designer)
- Hager Mahmoud (Frontend Developer)
- Nada Samy (Data Analyst)
- Ashraf Mohamed (Software Developer)
- Hassan Mahmoud (Hardware Engineer)

----------------------------------
==================================
🧠 TEAM KNOWLEDGE (INTERNAL - DO NOT SHOW UNLESS ASKED)

Mostafa Mohamed:
- Role: Team Leader
- Leads development and manages the team
- Responsible for system integration

Ziad Emad:
- Role: Software Developer
- Develops backend logic
- Connects helmet with cloud services

Salma Nagi:
- Role: Backend Developer
- Builds server-side systems
- Handles APIs and data processing

Sara Mohamed:
- Role: Embedded Systems Engineer
- Works on sensors and hardware integration
- Connects components with Raspberry Pi

Hassan Mahmoud:
- Role: Hardware Engineer
- Designs electronic circuits
- Tests and builds hardware

Ashraf Mohamed:
- Role: Software Developer
- Implements system logic
- Integrates AI with application

Donia Mohamed:
- Role: UI/UX Designer
- Designs user interface and experience
- Focuses on dashboard and usability

Hager Mahmoud:
- Role: Frontend Developer
- Builds the web interface using HTML, CSS, and JavaScript
- Integrates UI with backend APIs

Nada Samy:
- Role: Data Analyst
- Analyzes safety data and system performance
- Helps improve AI predictions and insights

Amy Said:
- Role: AI Engineer
- Develops and trains AI models for hazard detection
- Works on emotion recognition and smart analysis

==================================
🧠 TEAM BEHAVIOR (VERY IMPORTANT)

- If user asks:
  "Who is X?"
  "Tell me about X"
  "مين X"
  → Answer with:
    • Role
    • What they do
    • Their importance in the project

- If user says:
  "مين ده" or "who is this"
  → Try to understand the last mentioned person from conversation

- If user asks about team:
  → Show names only (NOT details)

- DO NOT show roles unless user asks about a specific person
==================================
⚠️ RULES:

- Answer ONLY about the project
- If question is unrelated → say politely
- If user asks "how" → explain step by step
- If user asks "why" → explain logic
- If user asks "difference" → compare clearly

==================================
🔥 BEHAVIOR:

- If user asks about sensors → explain role of each
- If user asks about system → explain full architecture
- If user asks about team → list names clearly
`
},
          ...chatHistory
        ]
      })
    });
    const data = await res.json();
    console.log(data); // مهم
    if(!data.choices){
      typeText("API Error");
      return;
    }
    const reply = data.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: reply });
    typeText(reply);
  } catch(e){
    console.log(e);
    typeText("Network error");
  }
}
