const mmCreateBtn = document.getElementById('mm-create-btn')
const mmCreateKitchenDiv = document.getElementById('mm-create-div')
const mmCreateCancelBtn = document.getElementById('mm-create-cancel-btn')


const mmJoinBtn = document.getElementById('mm-join-btn')
const mmJoinKitchenDiv = document.getElementById('mm-join-div')
const mmCloseJoinKitchenBtn = document.getElementById('mm-join-close-btn')
const mmCodeErrText = document.getElementById('mm-c-error')
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
    if (currentCode.length < 5) {
        mmCodeErrText.innerHTML = "Too short!"
        return
    }

    if (currentCode.length > 5) {
        mmCodeErrText.innerHTML = "Too long..?"
        return
    }

    socket.emit("join_kitchen_code", currentCode)
});

socket.on("join_kitchen_code_response", (response) => {
    console.log('join_kitchen_code_response:', response);
    if (response !== "good") {
        mmCodeErrText.innerHTML = response
    } else {
        mmCodeErrText.innerHTML = response
    }
});

//create kitchen stuff
let createKitchenOpen = false;
mmCreateBtn.addEventListener("click", function() {
    if (createKitchenOpen) {
        createKitchenOpen = false
        mmCreateKitchenDiv.classList.add('hidden')
    } else {
        createKitchenOpen = true
        mmCreateKitchenDiv.classList.remove('hidden')
    }
});

mmCreateCancelBtn.addEventListener("click", function() {
    createKitchenOpen = false
    mmCreateKitchenDiv.classList.add('hidden')
});