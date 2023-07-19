const mmJoinBtn = document.getElementById('main-menu-join-btn')
const mmCreateBtn = document.getElementById('main-menu-create-btn')

const mmJoinKitchenDiv = document.getElementById('main-menu-join-div')
const mmCloseJoinKitchenBtn = document.getElementById('main-menu-join-close-btn')

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

//create kitchen stuff
mmCreateBtn.addEventListener("click", function() {
    console.log("test2");
});