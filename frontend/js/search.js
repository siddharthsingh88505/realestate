// DOM elements
const formElement = document.querySelector('form');
const locationInput = document.querySelector('#location');
const typeInput = document.querySelector('#type');
const noticInput = document.querySelector('#notic-type');
const priceInput = document.querySelector('#price');
const errorElement = document.querySelector('#filter-error');

// Event Listeners
formElement.addEventListener('submit', (event) => {
    if (locationInput.value.trim().length > 0 || noticInput.value !== '-1' || typeInput.value !== '-1' || priceInput.value !== '-1')
    {
        errorElement.style.visibility = "hidden";
        return true;
    }
    else
    {
        event.preventDefault();
        errorElement.style.visibility = "visible";

    }
})