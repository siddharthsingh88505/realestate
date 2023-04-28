// Modifying input type file
let inputImage = document.getElementById("input-image");
let inputVideo = document.getElementById("input-video");
let imageName = document.getElementById("image-name");
let videoName = document.getElementById("video-name");

// event listener for image input
inputImage.addEventListener('change', () => {
    let total_files = document.querySelector("#input-image").files
    let new_list = document.createElement("ul");
    for (let i = 0; i < total_files.length; i++){
        let new_item = document.createElement("li");
        new_item.innerHTML = total_files[i].name;
        new_list.appendChild(new_item);
    }
    imageName.append(new_list);
});

// event listener for video input
inputVideo.addEventListener('change', () => {
    let total_files = document.querySelector("#input-video").files
    let new_list = document.createElement("ul");
    for (let i = 0; i < total_files.length; i++){
        let new_item = document.createElement("li");
        new_item.innerHTML = total_files[i].name;
        new_list.appendChild(new_item);
    }
    videoName.append(new_list);
});

// Getting the access to the form and its respective input elements
const name = document.querySelector("input[name='name']");
const plocation = document.querySelector("input[name='location']");
const description = document.querySelector("#description");
const price = document.querySelector("input[name='price']");
const area = document.querySelector("input[name='area']");
const bedroom = document.querySelector("input[name='bedroom']");
const bathroom = document.querySelector("input[name='bathroom']");
const owner = document.querySelector("input[name='owner']");
const type = document.querySelector("select[name='type']");
const notic = document.querySelector("select[name='noticType']");
const city = document.querySelector("select[name='city']");
const image = document.querySelector("input[name='image']");
const video = document.querySelector("input[name='video']");
const submitBtn = document.querySelector(".submit-btn");

// Getting the access to the form error elements
const nameError = document.querySelector(".name-error");
const locationError = document.querySelector(".location-error");
const contactError = document.querySelector(".contact-error");
const descError = document.querySelector(".desc-error");
const priceError = document.querySelector(".price-error");
const areaError = document.querySelector(".area-error");
const bedroomError = document.querySelector(".bedroom-error");
const bathroomError = document.querySelector(".bathroom-error");
const ownerError = document.querySelector(".owner-error");
const typeError = document.querySelector(".type-error");
const noticError = document.querySelector(".notic-error");
const cityError = document.querySelector(".city-error");
const imageError = document.querySelector(".image-error");

// Property name validation
function nameValidation() {
    const nameSyntax = /^([a-zA-Z0-9\s]{2,30})$/;
    if (nameSyntax.test(name.value)) {
        nameError.style.visibility = "hidden";
        return true;
    }
    else {
        if (name.value.length === 0) {
            nameError.innerText = "Please provide property name";
            nameError.style.visibility = "visible";
        }
        else if(name.value.length < 2) {
            nameError.innerText = "Please provide atleast two characters name";
            nameError.style.visibility = "visible";
        }
        else if (name.value.length > 30) {
            nameError.innerText = "Please provide atmost thirty characters name";
            nameError.style.visibility = "visible";
            }
        else {
            nameError.innerText = "Please provide alphabetical name";
            nameError.style.visibility = "visible";
        }
    }
}

// Location validation
function locationValidation() {
    const locationSyntax = /^([a-zA-Z0-9\s]{2,30})$/;
    if (locationSyntax.test(plocation.value)) {
        locationError.style.visibility = "hidden";
        return true;
    }
    else {
        if (plocation.value.length === 0) {
            locationError.innerText = "Please provide property location";
            locationError.style.visibility = "visible";
        }
        else if(plocation.value.length < 2) {
            locationError.innerText = "Please provide atleast two characters property location";
            locationError.style.visibility = "visible";
        }
        else if (plocation.value.length > 30) {
            locationError.innerText = "Please provide atmost thirty characters property location";
            locationError.style.visibility = "visible";
            }
        else {
            locationError.innerText = "Please provide alphabetical property location";
            locationError.style.visibility = "visible";
        }
    }
}

// Description validation
function descValidation() {
    if (description.value.trim().length === 0) {
        descError.innerHTML = "Please provide description.";
        descError.style.visibility = "visible";
    }
    else if(description.value.trim().length < 20){
        descError.innerHTML = "Please provide atleast 20 characters description.";
        descError.style.visibility = "visible";
    }
    else {
        descError.style.visibility = "hidden";
        return true;
    }
}

// length validation for some fields
function priceValidation() {
    if (String(price.value).trim().length === 0) {
        priceError.innerText = "Please provide property price";
        priceError.style.visibility = "visible";
    }
    else {
        priceError.style.visibility = "hidden";
        return true;
    }
}
function areaValidation() {
    if (String(area.value).trim().length === 0) {
        areaError.innerText = "Please provide property area";
        areaError.style.visibility = "visible";
    }
    else {
        areaError.style.visibility = "hidden";
        return true;
    }
}
function bedroomValidation() {
    if (String(bedroom.value).trim().length === 0) {
        bedroomError.innerText = "Please provide no. of bedroom";
        bedroomError.style.visibility = "visible";
    }
    else {
        bedroomError.style.visibility = "hidden";
        return true;
    }
}
function bathroomValidation() {
    if (String(bathroom.value).trim().length === 0) {
        bathroomError.innerText = "Please provide no. of bathroom";
        bathroomError.style.visibility = "visible";
    }
    else {
        bathroomError.style.visibility = "hidden";
        return true;
    }
}

// owner validation
function ownerValidation() {
    if (String(owner.value).trim().length === 0) {
        ownerError.innerText = "Please provide owner name";
        ownerError.style.visibility = "visible";
    }
    else {
        ownerError.style.visibility = "hidden";
        return true;
    }
}

// property type validation
function propertyTypeValidation() {
    if (parseInt(type.value) < 1) {
        typeError.innerText = "Please select property type";
        typeError.style.visibility = "visible";
        return;
    }
    typeError.style.visibility = "hidden";
    return true;
}

// city validation
function cityValidation() {
    if (parseInt(city.value) < 1) {
        cityError.innerText = "Please select city";
        cityError.style.visibility = "visible";
        return;
    }
    cityError.style.visibility = "hidden";
    return true;
}

// city validation
function noticValidation() {
    if (parseInt(notic.value) < 1) {
        noticError.innerText = "Please select notic type";
        noticError.style.visibility = "visible";
        return;
    }
    noticError.style.visibility = "hidden";
    return true;
}

// image input validation
function imageValidation() {
    if (image.files.length === 0) {
        imageError.innerText = "Please select atleast one property image";
        imageError.style.visibility = "visible";
    }
    else {
        imageError.style.visibility = "hidden";
        return true;
    }
}

// function for only allowing numbers
function allowOnlyNumbers(errorElement,event) {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    console.log(event.key)
    for (let num of numbers) {
        if (parseInt(event.key) === num) {
            errorElement.style.visibility = "hidden";
            return true;
        }
    }
    event.preventDefault();
    errorElement.innerText = "Please provide digits only";
    errorElement.style.visibility = "visible";
    return;
};

// function for onlu allowing alphabets
function allowOnlyLetters(errorElement,event) {
    const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (let x of characters) {
        if ((event.key).toLowerCase() == x) {
            errorElement.style.visibility = "hidden";
            return true;
        }
    }
    event.preventDefault();
    errorElement.innerText = "Please provide alphabets only in owner name";
    errorElement.style.visibility = "visible";
    return;
};

// event listerners for field accepting only numbers
price.addEventListener('keypress', (e) => {
    allowOnlyNumbers(priceError, e);
})
area.addEventListener("keypress", (e) => {
    allowOnlyNumbers(areaError, e);
})
bedroom.addEventListener("keypress", (e) => {
    allowOnlyNumbers(bedroomError, e);
})
bathroom.addEventListener("keypress", (e) => {
    allowOnlyNumbers(bathroomError, e);
})

// event listener for fields only accepting alphabets
owner.addEventListener('keypress', (e) => {
    allowOnlyLetters(ownerError, e);
});

// event listener for type
type.addEventListener('change', (e) => {
    if (type.value!=="-1") {
        typeError.style.visibility = "hidden";
    }
});

// event listener for city
type.addEventListener('change', (e) => {
    if (city.value!=="-1") {
        cityError.style.visibility = "hidden";
    }
});

// event listener for input image
image.addEventListener("change", (e) => {
    if (image.files.length) {
        imageError.style.visibility = "hidden";
    }
})


// styles on submit btn
submitBtn.addEventListener('mouseover', (e) => {
    submitBtn.classList.add('submit-btn-hover');
})
submitBtn.addEventListener('mouseout', (e) => {
    submitBtn.classList.remove('submit-btn-hover');
})

// handling event on form submit
submitBtn.addEventListener('click', (e) => {
    if (nameValidation()) {
        if (locationValidation()) {
            if (descValidation()) {
                if (priceValidation()) {
                    if (areaValidation()) {
                        if (bedroomValidation()) {
                            if (bathroomValidation()) {
                                if (ownerValidation()) {
                                    if (propertyTypeValidation()) {
                                        if (cityValidation()) {
                                            if (noticValidation()) {
                                                if (imageValidation()) {
                                                    return true;
                                                }
                                                e.preventDefault();
                                            }
                                            e.preventDefault();
                                        }
                                        e.preventDefault();
                                    }
                                    e.preventDefault();
                                }
                                e.preventDefault();
                            }
                            e.preventDefault();
                        }
                        e.preventDefault();
                    }
                    e.preventDefault();
                }
                e.preventDefault();
            }
            e.preventDefault();
        }
        e.preventDefault();
    }
    e.preventDefault();
});