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
  disable: function () {
    return window.innerWidth < 768;
  }
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
// setInterval(nextSlide, 20000); //  slideبيجيب اللي بعده

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