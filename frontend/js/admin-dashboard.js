// all remove buttons
let remove__btns;

function setInactive() {
    $("#dashboard").removeClass("active");
    $("#users").removeClass("active");
    $("#property").removeClass("active");
    $("#orders").removeClass("active");
}
$(document).ready(function () {
    // show confirmation

    // load dashboard
    $("#dashboard").click(function () {
        setInactive();
        $("#dashboard").addClass("active");
    })
    // load users
    $("#users").click(function () {
        setInactive();
        $("#users").addClass("active");
        $("#dashWrapper").load("/user-list");
        setTimeout(() => {
            remove__btns = document.querySelectorAll(".remove-btn");
            console.log(remove__btns);
            addListener(remove__btns);
        }, 1000);
        
    });
    $(".col-md-4.totalCards.users").click(function () {
        setInactive();
        $("#users").addClass("active");
        $("#dashWrapper").load("/user-list");
        setTimeout(() => {
            remove__btns = document.querySelectorAll(".remove-btn");
            console.log(remove__btns);
            addListener(remove__btns);
        }, 1000);
        
    });
    // load properties
    $("#property").click(function () {
        setInactive();
        $("#property").addClass("active");
        $("#dashWrapper").load("/property-list");
        setTimeout(() => {
            remove__btns = document.querySelectorAll(".remove-btn");
            console.log(remove__btns);
            addListener(remove__btns);
        }, 1000);
        
    });
    $(".col-md-4.totalCards.property").click(function () {
        setInactive();
        $("#property").addClass("active");
        $("#dashWrapper").load("/property-list");
        setTimeout(() => {
            remove__btns = document.querySelectorAll(".remove-btn");
            console.log(remove__btns);
            addListener(remove__btns);
        }, 1000);
        
    });
    // load orders
    $("#orders").click(function () {
        setInactive();
        $("#orders").addClass("active");
        $("#dashWrapper").load("/order-list");
    });
    $(".col-md-4.totalCards.orders").click(function () {
        setInactive();
        $("#orders").addClass("active");
        $("#dashWrapper").load("/order-list");
    });
});


function addListener(elements) {
    elements.forEach(element => {
        element.addEventListener('click', e => {
            let isTrue = confirm("Press OK to delete");
            if (isTrue) {
                return true;
            }
            else {
                e.preventDefault();
            }
        })
    })
}