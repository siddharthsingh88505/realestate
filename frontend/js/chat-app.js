$(document).ready(function () {
    $('.user').each(function () {
        // console.log($(this).attr('id'));
        $(this).on('click', function () {
            let element = $(this);
            $('.user').each(function () {
                $(this).removeClass('active')
            });
            $(this).addClass('active');
            // fetch
            $('#chat-wrapper').load(`/chat-history/${element.attr('id')}`, function () {
                let messageArea = document.querySelector(".message__area");
                // scrollToBottom(messageArea);
                let textarea = document.querySelector("#textarea");
                textarea.addEventListener('keyup', (e) => {
                    if (e.key === "Enter") {
                        if (e.target.value.trim().length > 0) {
                            // sendMessage(e.target.value, textarea);
                            sendText(String(element.attr('id')),e.target.value.trim());
                        }
                        
                    }
                })
                
            });
        })
    })
})

function sendMessage(message,textarea) {
    let msg = {
        message: message.trim()
    }
    // Append
    appendMessage(msg, 'outgoing');
    textarea.value = "";

    // Send to server
    // socket.emit(eventName,dataObject)
    // socket.emit("message", msg);

}
function appendMessage(msg, type) {
    let messageArea = document.querySelector(".message__area");
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");

    let markup = `
        <p>${msg}</p>
    `
    messageArea.appendChild(mainDiv);
    mainDiv.innerHTML = markup;
    
    scrollToBottom(messageArea);
}

// scroll down
function scrollToBottom(messageArea) {
    messageArea.scrollTop = messageArea.scrollHeight;
}

// async code
async function sendText(id,message) {
    const response = await fetch("/save-chat/" + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: message
        })
    });
    appendMessage(message, 'outgoing');
    textarea.value = "";
    console.log("saved")
}
