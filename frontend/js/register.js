// Getting the access to the form and its respective input elements
const firstName = document.querySelector("input[name='firstName']");
const lastName = document.querySelector("input[name='lastName']");
const userType = document.querySelector("select[name='userType']");
const contact = document.querySelector("input[name='contact']");
const email = document.querySelector("input[name='email']");
const password = document.querySelector("input[name='password']");
const cnfpassword = document.querySelector("input[name='cnfpassword']");
const tc = document.querySelector("input[name='tc']");
const submitBtn = document.querySelector(".submit-btn");

// Getting the access to the form error elements
const nameError = document.querySelector(".name-error");
const userTypeError = document.querySelector(".user-type-error");
const contactError = document.querySelector(".contact-error");
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");
const cpasswordError = document.querySelector(".cpassword-error");
const tcError = document.querySelector(".tc-error");

// Regex for validation
const nameSyntax = /^([a-zA-Z\s]{3,30})$/;
const contactSyntax = /^([6-9][0-9]{9})$/;
const emailSyntax = /^([a-zA-Z0-9/.-]+)@[a-zA-Z0-9/.-]+([.]{1})([a-zA-Z]{2,20})(.[a-zA-Z]{2,20})?$/;

// function for only allowing characters
function allowOnlyLetters(nameElement,errorElement,event) {
    const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (let x of characters) {
        if ((event.key).toLowerCase() == x) {
            errorElement.style.visibility = "hidden";
            return true;
        }
    }
    event.preventDefault();
    if (nameElement === firstName) {
        errorElement.innerText = "Please provide alphabets only in first name";
    }
    else {
        errorElement.innerText = "Please provide alphabets only in last name";
    }
    errorElement.style.visibility = "visible";
    return;
};


// function for only allowing numbers
function allowOnlyNumbers(errorElement,event) {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
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

// Name Validation
function nameValidate(nameElement,errorElement) {
    if (nameSyntax.test(nameElement.value)) {
        errorElement.style.visibility = "hidden";
        return true;
    }
    else {
        if (nameElement.value.length === 0) {
            if (nameElement === firstName) {
                errorElement.innerText = "Please provide first name";
            }
            else {
                errorElement.innerText = "Please provide last name";
            }
            
            errorElement.style.visibility = "visible";
        }
        else if(nameElement.value.length < 3){
            if (nameElement === firstName) {
                errorElement.innerText = "Please provide atleast three characters first name";
            }
            else {
                errorElement.innerText = "Please provide atleast three characters last name";
            }
            errorElement.style.visibility = "visible";
        }
        else if (nameElement.value.length > 30) {
            if (nameElement === firstName) {
                errorElement.innerText = "Please provide atmost thirty characters first name";
            }
            else {
                errorElement.innerText = "Please provide atmost thirty characters last name";
            }
            errorElement.style.visibility = "visible";
            }
        else {
            if (nameElement === firstName) {
                errorElement.innerText = "Please provide alphabetical first name";
            }
            else {
                errorElement.innerText = "Please provide alphabetical last name";
            }
            errorElement.style.visibility = "visible";
        }
    }
}

// User Type Validation
function userTypeValidate() {
    if (parseInt(userType.value) < 1) {
        userTypeError.innerText = "Please select user type";
        userTypeError.style.visibility = "visible";
        return;
    }
    userTypeError.style.visibility = "hidden";
    return true;
}

// Email Validation
function emailValidate() {
    if (emailSyntax.test(email.value)) {
        emailError.style.visibility = "hidden";
        return true;
    }
    else
    {
        if (email.value) {
            emailError.innerText = "Please provide a valid email Example:xxx.@xx.xxx";
            emailError.style.visibility = "visible";
            return false;
        }
        else {
            emailError.style.visibility="visible"
            emailError.innerText = "Please provide a email";
        }
        

    }
}

// Contact Validation
function contactValidate() {
    if (!contactSyntax.test(contact.value)) {
        if (String(contact.value).length < 10) {
            contactError.innerText = "Please provide 10 digits for mobile number";
            contactError.style.visibility = "visible";
        }
        else if (String(contact.value).length > 10) {
            contactError.innerText = "Please provide only 10 digits";
            contactError.style.visibility = "visible";
        }
        else if(String(contact.value.trim())[0]==="6" || String(contact.value.trim())[0]==="7"  || String(contact.value.trim())[0]==="8" || String(contact.value.trim())[0]==="9"    ) {
            contactError.innerHTML = "Please provide valid Contact <br> Ex :- 91XXXXXXXX ";
            contactError.style.visibility = "visible";
        }
        else {
            contactError.innerText = "Please start phone number with 6,7,8 or 9";
            contactError.style.visibility = "visible";
        }
    }
    else {
        contactError.innerHTML = "error";
        contactError.style.visibility = "hidden";
        return true;
    }
}

// Password Validation
function passwordValidate() {
    if (password.value.length < 8) {
        passwordError.innerText="Please provide alteast 8 characters"
        passwordError.style.visibility = "visible";
        return;
    }
    passwordError.style.visibility = "hidden";
    return true;
}

// Confirm Password Validation
function cnfpasswordValidate() {
    if (password.value !== cnfpassword.value) {
        cpasswordError.innerText="Password doen't match"
        cpasswordError.style.visibility = "visible";
        return;
    }
    cpasswordError.style.visibility = "hidden";
    return true;
}

// Terms and conditions validation
function tcValidation() {
    if (!tc.checked) {
        tcError.innerText = "Please check the terms and conditions";
        tcError.style.visibility = "visible";
        return;
    }
    tcError.style.visibility = "hidden";
    return true;
}

// Event listener for first name and last name
firstName.addEventListener('keypress', (event) => {
    allowOnlyLetters(firstName,nameError, event);
});
lastName.addEventListener('keypress', (event) => {
    allowOnlyLetters(lastName,nameError, event)
});

// Event listener for contact field
contact.addEventListener('keypress', (event) => {
    allowOnlyNumbers(contactError, event);
});
// Event listener for email field
email.addEventListener('keyup', () => {
    emailValidate();
});
// Event listener for password field
password.addEventListener('keyup', () => {
    passwordValidate(password, passwordError);
});
// Event listener for confirm password field
cnfpassword.addEventListener('keyup', () => {
    cnfpasswordValidate(password, cnfpassword, cpasswordError);
});
// styles on submit btn
submitBtn.addEventListener('mouseover', (e) => {
    submitBtn.classList.add('submit-btn-hover');
})
submitBtn.addEventListener('mouseout', (e) => {
    submitBtn.classList.remove('submit-btn-hover');
})

// handling event on submit btn
submitBtn.addEventListener('click', (e) => {
    if (nameValidate(firstName, nameError))
    {
        if (nameValidate(lastName, nameError))
        {
            if (userTypeValidate())
            {
                if (contactValidate()) {
                    if (emailValidate()) {
                        if (passwordValidate()) {
                            if (cnfpasswordValidate()) {
                                if (tcValidation()) {
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
});