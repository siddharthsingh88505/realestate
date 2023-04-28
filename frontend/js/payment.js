$('.cc-number').payment('formatCardNumber');
$('.cc-exp').payment('formatCardExpiry');
$('.cc-cvc').payment('formatCardCVC');
const form = document.querySelector('form');
const cardNumberElement = document.querySelector('#cc-number');
const cardExpiryElement = document.querySelector('#cc-exp');
const cardCvcElement = document.querySelector('#cc-cvc');
const cardHolderElement = document.querySelector('.cc-holder');

function validateCardNumber() {
    const errorElement = document.querySelector('.card-error');
    errorElement.style.visibility = "hidden";
    cardNumberElement.classList.remove("is-invalid");
    if (String(cardNumberElement.value).length === 0) {
        cardNumberElement.classList.add("is-invalid");
        errorElement.innerHTML = "Please provide card number";
        errorElement.style.visibility = "visible";
        return false;
    }
    if (String(cardNumberElement.value).length < 19) {
        cardNumberElement.classList.add("is-invalid");
        errorElement.innerHTML = "Please provide valid card number";
        errorElement.style.visibility = "visible";
        return false;
    }
    errorElement.style.visibility = "hidden";
    cardNumberElement.classList.remove("is-invalid");
    return true;
}

function validateCardExpiry() {
    const errorElement = document.querySelector('.expiry-error');
    errorElement.style.visibility = "hidden";
    cardExpiryElement.classList.remove("is-invalid");
    if (String(cardExpiryElement.value).length === 0) {
        cardExpiryElement.classList.add("is-invalid");
        errorElement.innerHTML = "Please provide card expiry";
        errorElement.style.visibility = "visible";
        return false;
    }
    if (String(cardExpiryElement.value).length === 7 || String(cardExpiryElement.value).length === 9) {
        cardExpiryElement.classList.remove("is-invalid");
        errorElement.style.visibility = "hidden";
        return true;
    }
    else {
        cardExpiryElement.classList.add("is-invalid");
        errorElement.innerHTML = "Please provide valid card expiry";
        errorElement.style.visibility = "visible";
        return false;
    }
}

function validateCardCVC() {
    const errorElement = document.querySelector('.cvc-error');
    errorElement.style.visibility = "hidden";
    cardCvcElement.classList.remove("is-invalid");
    if (cardCvcElement.value.length == 0) {
        cardCvcElement.classList.add("is-invalid");
        errorElement.innerHTML = "Please provide card CVC";
        errorElement.style.visibility = "visible";
        return false;
    }
    if (cardCvcElement.value.length < 3) {
        cardCvcElement.classList.add("is-invalid");
        errorElement.innerHTML = "Please provide valid card CVC";
        errorElement.style.visibility = "visible";
        return false;
    }
    cardCvcElement.classList.remove("is-invalid");
    errorElement.style.visibility = "hidden";
    return true;
}

function validateCardHolder() {
    const errorElement = document.querySelector('.card-name-error');
    const validate = /^([A-Za-z]{3,})\s([A-Za-z]{3,})$/;
    cardHolderElement.classList.remove("is-invalid");
    if (!validate.test(cardHolderElement.value.trim())) {
        if ((cardHolderElement.value.trim()).length === 0) {
            cardHolderElement.classList.add("is-invalid");
            errorElement.innerHTML = "Please provide card holder name";
            errorElement.style.visibility = "visible";
            return;
        }
        else {
            cardHolderElement.classList.add("is-invalid");
            errorElement.innerHTML = "Name and Sername must be atleast 3 characters long";
            errorElement.style.visibility = "visible";
            return;
        }
    }
    cardHolderElement.classList.remove("is-invalid");
    errorElement.style.visibility = "hidden";
    return true;
}

function allowOnlyLetters(nameElement,errorElement,event) {
    const characters = [" ","a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (let x of characters) {
        if ((event.key).toLowerCase() == x) {
            nameElement.classList.remove("is-invalid");
            errorElement.style.visibility = "hidden";
            return true;
        }
    }
    event.preventDefault();
    nameElement.classList.add("is-invalid");
    errorElement.innerText = "Please provide alphabets only in card holder name";
    errorElement.style.visibility = "visible";
    return;
};

// event listeners
cardNumberElement.addEventListener('keyup', (e) => {
    validateCardNumber();
})
cardExpiryElement.addEventListener('keyup', (e) => {
    validateCardExpiry();
})
cardCvcElement.addEventListener('keyup', (e) => {
    validateCardCVC();
})
cardHolderElement.addEventListener('keypress', (e) => {
    if (allowOnlyLetters(cardHolderElement, document.querySelector('.card-name-error'), e)) {
        validateCardHolder();
    }
})
cardHolderElement.addEventListener('keyup', (e) => {
    validateCardHolder();
})

function scrollToInvalid(form) {
  const invalidInputs = Array.from(form.querySelectorAll('.is-invalid'));    // set up so you can use any custom invalid classes you're adding to your elements, as well
  invalidInputs.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);                      // sort inputs by offset from top of viewport (handles issues with multi-column layouts, where the first element in the markup isn't necessarily the highest on the page)
  invalidInputs[0].scrollIntoView({ block: 'center', behavior: 'smooth' });                                         // scroll first (top) input into center of view, using smooth animation
}
const submitBtn = document.querySelector('#submit-btn');
submitBtn.addEventListener('click', (e) => {
    if (validateCardNumber())
    {
        if (validateCardNumber()) {
            if (validateCardExpiry()) {
                if (validateCardCVC()) {
                    if (validateCardHolder())
                    {
                        return true;
                    }
                    e.preventDefault();
                    scrollToInvalid(form);
                }
                e.preventDefault();
                scrollToInvalid(form);
            }
            e.preventDefault();
            scrollToInvalid(form);
        }
        e.preventDefault();
        scrollToInvalid(form);
    }
    e.preventDefault();
    scrollToInvalid(form);
})