// Hamburger menu
const toggleBtn = document.querySelector('.nav-switch');
const toggleBars = document.querySelector('.togglebars');

let count = 0;
// Event listener
toggleBtn.addEventListener('click', (e) => {
    if (!count) {
        toggleBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
        count++;
    }
    else {
        toggleBtn.innerHTML = '<i class="fa fa-bars"></i>';
        count--;
    }
    if (toggleBars.style.maxHeight) {
        toggleBars.style.maxHeight = null;
    }
    else {
        toggleBars.style.maxHeight = toggleBars.scrollHeight + "px";
    }
})