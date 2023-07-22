const mmCreateBtn = document.getElementById('mm-create-btn')
const mmCreateKitchenDiv = document.getElementById('mm-create-div')
const mmCreateCancelBtn = document.getElementById('mm-create-cancel-btn')
const mmCreateCountText = document.getElementById('mm-chef-count')

const mmCreateDisplayCode = [
    document.getElementById('mm-create-dc-1'),
    document.getElementById('mm-create-dc-2'),
    document.getElementById('mm-create-dc-3'),
    document.getElementById('mm-create-dc-4'),
    document.getElementById('mm-create-dc-5')
];



const mmJoinBtn = document.getElementById('mm-join-btn')
const mmJoinKitchenDiv = document.getElementById('mm-join-div')
const mmCloseJoinKitchenBtn = document.getElementById('mm-join-close-btn')
const mmCodeErrText = document.getElementById('mm-c-error')
const mmSubmitCodeBtn = document.getElementById('mm-c-submit')
const mmRemoveCodeBtn = document.getElementById('mm-c-remove')

const mmJoinDisplayCode = [
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
    if (index < mmJoinDisplayCode.length) {
        //set the empty display to the set number
        mmJoinDisplayCode[index].innerHTML = number

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
        mmJoinDisplayCode[currentCode.length-1].innerHTML = ""
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

    socket.emit("join_kitchen_code", currentCode, callback => {
        console.log('join_kitchen_code:', callback);
        if (callback !== "good") {
            // error!
            mmCodeErrText.innerHTML = callback
        } else {
            // continue on
            mmCodeErrText.innerHTML = callback
        }
    });
});

//create kitchen stuff
let createKitchenOpen = false
let serverCreatedCode = ""

mmCreateBtn.addEventListener("click", function() {
    if (createKitchenOpen) {
        //close
        createKitchenOpen = false
        mmCreateKitchenDiv.classList.add('hidden')

        leaveCreatedKitchen()
    } else {
        //open
        socket.emit("create_kitchen_code", callback => {
            console.log('create_kitchen_code:', callback);
            if (callback.includes("good")) {
                //show the div
                createKitchenOpen = true
                mmCreateKitchenDiv.classList.remove('hidden')

                //create the display
                serverCreatedCode = callback.substring(4)
                for (let i = 0; i < 5; i++) {
                    mmCreateDisplayCode[i].innerHTML = serverCreatedCode.charAt(i)
                }
            }
        });
    }
});

//cancel kitchen creation
mmCreateCancelBtn.addEventListener("click", function() {
    createKitchenOpen = false
    mmCreateKitchenDiv.classList.add('hidden')

    leaveCreatedKitchen()
});

function leaveCreatedKitchen() {
    socket.emit("delete_kitchen_code", callback => {
        console.log('delete_kitchen_code:', callback);
    });
}

//kitchen joined count change
socket.on("join_kitchen_count_change", (count) => {
    console.log(count + "/8")
    mmCreateCountText.innerHTML = count + "/8"
});
