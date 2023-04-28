// Acessing input fields
const email = document.querySelector("input[name='email']");
const password = document.querySelector("input[name='password']");
const submitBtn = document.querySelector(".submit-btn");

//Acessing error fields
const emailError = document.querySelector(".email-error");
const passwordError = document.querySelector(".password-error");

// Regex for validation
const emailSyntax = /^([a-zA-Z0-9/.-]+)@[a-zA-Z0-9/.-]+([.]{1})([a-zA-Z]{2,20})(.[a-zA-Z]{2,20})?$/;

// Email Validation
function emailValidate() {
    email.value = email.value.toLowerCase();
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

// Event listener for email field
email.addEventListener('keyup', () => {
    emailValidate();
});

// Event listener for password field
password.addEventListener('keyup', () => {
    passwordValidate(password, passwordError);
});

// styles on submit btn
submitBtn.addEventListener('mouseover', (e) => {
    submitBtn.classList.add('submit-btn-hover');
})
submitBtn.addEventListener('mouseout', (e) => {
    submitBtn.classList.remove('submit-btn-hover');
})

// Event listener on submit button
submitBtn.addEventListener('click', e => {
    if (emailValidate()) {
        if (passwordValidate()) {
            return true;
        }
        e.preventDefault();
    }
    e.preventDefault();
})