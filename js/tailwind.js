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
setInterval(nextSlide, 3000); //  slideبيجيب اللي بعده

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