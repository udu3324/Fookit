const mm = document.getElementById('mm');
const mmCreateBtn = document.getElementById('mm-create-btn');
const mmCreateKitchenDiv = document.getElementById('mm-create-div');
const mmCreateStartBtn = document.getElementById('mm-create-start-btn');
const mmCreateCancelBtn = document.getElementById('mm-create-cancel-btn');
const mmCreateCountText = document.getElementById('mm-chef-count');

const mmCreateDisplayCode = [
    document.getElementById('mm-create-dc-1'),
    document.getElementById('mm-create-dc-2'),
    document.getElementById('mm-create-dc-3'),
    document.getElementById('mm-create-dc-4'),
    document.getElementById('mm-create-dc-5')
];



const mmWaitDiv = document.getElementById('mm-wait-div');
const mmWaitCounterText = document.getElementById('mm-wait-counter');
const mmWaitLeaveBtn = document.getElementById('mm-wait-leave-btn');

const mmWaitDisplayCode = [
    document.getElementById('mm-wait-dc-1'),
    document.getElementById('mm-wait-dc-2'),
    document.getElementById('mm-wait-dc-3'),
    document.getElementById('mm-wait-dc-4'),
    document.getElementById('mm-wait-dc-5')
];



const mmJoinBtn = document.getElementById('mm-join-btn');
const mmJoinKitchenDiv = document.getElementById('mm-join-div');
const mmCloseJoinKitchenBtn = document.getElementById('mm-join-close-btn');
const mmCodeErrText = document.getElementById('mm-c-error');
const mmSubmitCodeBtn = document.getElementById('mm-c-submit');
const mmRemoveCodeBtn = document.getElementById('mm-c-remove');

const mmJoinDisplayCode = [
    document.getElementById('mm-dc-1'),
    document.getElementById('mm-dc-2'),
    document.getElementById('mm-dc-3'),
    document.getElementById('mm-dc-4'),
    document.getElementById('mm-dc-5')
];

//join kitchen stuff join kitchen stuff join kitchen stuff join kitchen stuff join kitchen stuff join kitchen stuff 
let currentCode = "";

function showJoinKitchen(bool) {
    const hiddenClassAction = bool ? 'remove' : 'add';
    mmJoinKitchenDiv.classList[hiddenClassAction]('hidden');
    mmCreateBtn.disabled = bool;
    mmJoinBtn.disabled = bool;
    if (!bool) {
        mmCodeErrText.innerHTML = "";

        //reset the display code
        currentCode = "";
        for (let i = 0; i < 5; i++) {
            mmJoinDisplayCode[i].innerHTML = "";
        }
    }
};
mmJoinBtn.addEventListener("click", function() {
    showJoinKitchen(true);
});
mmCloseJoinKitchenBtn.addEventListener("click", function() {
    showJoinKitchen(false);
});

//entering code buttons
function handleCodeClick(event) {
    const buttonId = event.target.id
    const number = buttonId.substring(5)

    //take length of current code & see if its more than display
    const index = currentCode.length
    if (index < mmJoinDisplayCode.length) {
        //set the empty display to the set number
        mmJoinDisplayCode[index].innerHTML = number
        mmWaitDisplayCode[index].innerHTML = number

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

// send a request to join kitchen
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
            mmCodeErrText.innerHTML = callback;
        } else {
            // good 
            // hide join kitchen div, show waiting div
            mmWaitDiv.classList.remove('hidden');
            showJoinKitchen(false);
        }
    });
});

//wait kitchen stuff wait kitchen stuff wait kitchen stuff wait kitchen stuff wait kitchen stuff wait kitchen stuff 
mmWaitLeaveBtn.addEventListener("click", function() {
    //reset wait div
    for (let i = 0; i < 5; i++) {
        mmWaitDisplayCode[i].innerHTML = "";
    }

    mmWaitDiv.classList.add('hidden');

    socket.emit("leave_kitchen_code", callback => {
        console.log('leave_kitchen_code:', callback);
    });
})

//kitchen ended while waiting bruh
socket.on("kitchen_wait_stop", () => {
    //reset wait div
    for (let i = 0; i < 5; i++) {
        mmWaitDisplayCode[i].innerHTML = ""
    }

    mmWaitDiv.classList.add('hidden')

    //todo notice of kitchen ending
});

//create kitchen stuff create kitchen stuff create kitchen stuff create kitchen stuff create kitchen stuff
let serverCreatedCode = ""
function showCreateKitchen(bool) {
    const hiddenClassAction = bool ? 'remove' : 'add';
    mmCreateKitchenDiv.classList[hiddenClassAction]('hidden');
    mmCreateBtn.disabled = bool;
    mmJoinBtn.disabled = bool;
}

//main button that opens div and requests server
mmCreateBtn.addEventListener("click", function() {
    socket.emit("create_kitchen_code", callback => {
        console.log('create_kitchen_code:', callback);
        if (callback.includes("good")) {
            showCreateKitchen(true)

            //create the display
            serverCreatedCode = callback.substring(4)
            for (let i = 0; i < 5; i++) {
                mmCreateDisplayCode[i].innerHTML = serverCreatedCode.charAt(i)
            }
        } else {
            //todo fallback
        }
    });
});

//start the kitchen cooking!
mmCreateStartBtn.addEventListener("click", function() {
    socket.emit("start_kitchen_code", callback => {
        console.log('start_kitchen_code:', callback);
        //todo fallback
    });
});

//cancel kitchen creation
mmCreateCancelBtn.addEventListener("click", function() {
    showCreateKitchen(false)

    socket.emit("delete_kitchen_code", callback => {
        console.log('delete_kitchen_code:', callback);
        //todo fallback
    });
});

//kitchen joined count change
socket.on("kitchen_count_change", (count) => {
    mmCreateCountText.innerHTML = count
    mmWaitCounterText.innerHTML = count
});

//kitchen has started!
socket.on("kitchen_started_code", () => {
    //hide everything
    showCreateKitchen(false)
    showJoinKitchen(false)

    mm.classList.add('hidden');
    kitchen.classList.remove('hidden');

    console.log("kitchen started")
    //show the kitchen!
});