const mmJoinBtn = document.getElementById('mm-join-btn')
const mmCreateBtn = document.getElementById('mm-create-btn')

const mmJoinKitchenDiv = document.getElementById('mm-join-div')
const mmCloseJoinKitchenBtn = document.getElementById('mm-join-close-btn')

const mmSubmitCodeBtn = document.getElementById('mm-c-submit')
const mmRemoveCodeBtn = document.getElementById('mm-c-remove')

const displayCode = [
    document.getElementById('mm-dc-1'),
    document.getElementById('mm-dc-2'),
    document.getElementById('mm-dc-3'),
    document.getElementById('mm-dc-4'),
    document.getElementById('mm-dc-5')
];

//join kitchen stuff
let joinKitchenUIOpen = false;
mmJoinBtn.addEventListener("click", function() {
    if (joinKitchenUIOpen) {
        joinKitchenUIOpen = false
        mmJoinKitchenDiv.classList.add('hidden')
    } else {
        joinKitchenUIOpen = true
        mmJoinKitchenDiv.classList.remove('hidden')
    }
});

mmCloseJoinKitchenBtn.addEventListener("click", function() {
    joinKitchenUIOpen = false
    mmJoinKitchenDiv.classList.add('hidden')
});

//entering code buttons
let currentCode = ""

function handleCodeClick(event) {
    const buttonId = event.target.id
    const number = buttonId.substring(5)

    //take length of current code & see if its more than display
    const index = currentCode.length
    if (index < displayCode.length) {
        //set the empty display to the set number
        displayCode[index].innerHTML = number

        currentCode += number
    }
}

// Add click event listeners to all display buttons
for (let i = 0; i <= 9; i++) {
    const button = document.getElementById("mm-c-" + i);
    button.addEventListener("click", handleCodeClick);
}

//removes one from the code
mmRemoveCodeBtn.addEventListener("click", function() {
    if (currentCode.length > 0) {
        displayCode[currentCode.length-1].innerHTML = ""
        currentCode = currentCode.substring(0, currentCode.length-1)
    }
});

// send a request
mmSubmitCodeBtn.addEventListener("click", function() {
    console.log("ye")
    socket.emit("join_kitchen_enter_code", currentCode)
});

//create kitchen stuff
mmCreateBtn.addEventListener("click", function() {
    console.log("test2");
});