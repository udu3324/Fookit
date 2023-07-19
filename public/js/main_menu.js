const mmJoinBtn = document.getElementById('mm-join-btn')
const mmCreateBtn = document.getElementById('mm-create-btn')

const mmJoinKitchenDiv = document.getElementById('mm-join-div')
const mmCloseJoinKitchenBtn = document.getElementById('mm-join-close-btn')

//const mmDisplayCode1 = document.getElementById('mm-dc-1')
//const mmDisplayCode2 = document.getElementById('mm-dc-2')
//const mmDisplayCode3 = document.getElementById('mm-dc-3')
//const mmDisplayCode4 = document.getElementById('mm-dc-4')
//const mmDisplayCode5 = document.getElementById('mm-dc-5')

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

function addToCode(number) {
    //take length of current code & see if its more than display
    const index = currentCode.length
    if (index < displayCode.length) {
        console.log("ran!")
        //set the empty display to the set number
        displayCode[index].innerHTML = number

        currentCode += number
    }

    console.log(number)
    console.log(currentCode)
}

function handleCodeClick(event) {
    const buttonId = event.target.id
    const number = buttonId.substring(5)

    addToCode(number)
}

// Add click event listeners to all buttons
for (let i = 0; i <= 9; i++) {
    const button = document.getElementById("mm-c-" + i);
    button.addEventListener("click", handleCodeClick);
}



//create kitchen stuff
mmCreateBtn.addEventListener("click", function() {
    console.log("test2");
});