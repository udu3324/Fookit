const kitchen = document.getElementById('kitchen');
const kitchenWorkspace = document.getElementById('kitchen-workspace');

const kitchenPlate = document.getElementById('kitchen-plate');

dragElement(kitchenPlate);
//set plate middle (temp)
kitchenPlate.style.left = (window.innerWidth / 2 - 64) + "px";
kitchenPlate.style.top = (window.innerHeight / 2 - 64) + "px";

//adds the objective from the server
let dishObjective = [];
let currentStack = [];
socket.on("kitchen_add_objective", (objective) => {
    console.log(objective)

    dishObjective = objective;
});

//finish the objective
function finishObjective() {
    socket.emit("kitchen_finished_objective", callback => {
        console.log('kitchen_finished_objective:', callback);
    });
}

//temp
function countOccurrences(arr) {
    const occurrences = {};
    for (const item of arr) {
      occurrences[item] = (occurrences[item] || 0) + 1;
    }
    return occurrences;
  }
  
  function checkArraysContainSameQuantities(arr1, arr2) {
    const occurrences1 = countOccurrences(arr1);
    const occurrences2 = countOccurrences(arr2);
  
    // Compare the occurrences of each element in Array 1 with those in Array 2
    for (const item of Object.keys(occurrences1)) {
      if (occurrences2[item] !== occurrences1[item]) {
        return false;
      }
    }
  
    // If we reach this point, it means all elements in Array 1 have the same occurrences in Array 2
    return true;
  }
//temp

//gets new ingredients and display/animate on screen
let itemID = 1;
socket.on("kitchen_add_ingredient", (ingredient, slide) => {
    console.log(ingredient, slide)

    var item = document.createElement('div');

    item.id = itemID;
    item.classList.add('sprite');
    item.classList.add(ingredient);

    kitchenWorkspace.appendChild(item);
    dragElement(item);

    itemID++;
});

//kitchen has ended
socket.on("kitchen_return_menu", () => {
    mm.classList.remove('hidden');
    kitchen.classList.add('hidden');

    console.log("kitchen has stopped");
});

//stack ingredient onto dish
let allowedToSubmit = false;
function stackIngredient(element) {
    //check if the ingredient is in the next objective item
    let current = currentStack.length;
    if (dishObjective[current] !== element.classList[1]) return;

    //push to array
    currentStack.push(element.classList[1]);

    //remove original item and create new one in dish div
    var item = document.createElement('div');
    item.classList.add('sprite');
    item.classList.add(element.classList[1]);

    kitchenPlate.appendChild(item);

    element.remove();

    //check if submitting is allowed
    if (currentStack.toString() == dishObjective.toString()) {
        console.log("allowed to submit!");
        allowedToSubmit = true;
    }
}

//simple drag div function - ty w3schools and gpt
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, touchX = 0, touchY = 0;

    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").addEventListener("mousedown", dragMouseDown);
        document.getElementById(elmnt.id + "header").addEventListener("touchstart", dragTouchStart);
    } else {
        elmnt.addEventListener("mousedown", dragMouseDown);
        elmnt.addEventListener("touchstart", dragTouchStart, { passive: false });
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos1 = e.clientX;
        pos2 = e.clientY;
        document.addEventListener("mouseup", closeDragElement);
        document.addEventListener("mousemove", elementDrag, { passive: false });
    }

    function dragTouchStart(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        touchX = touch.clientX;
        touchY = touch.clientY;
        document.addEventListener("touchend", closeDragElement, { passive: false });
        document.addEventListener("touchmove", elementDrag, { passive: false });
    }

    function elementDrag(e) {
        e.preventDefault();
        if (e.type === "touchmove") {
            const touch = e.changedTouches[0];
            const diffX = touch.clientX - touchX;
            const diffY = touch.clientY - touchY;
            touchX = touch.clientX;
            touchY = touch.clientY;
            elmnt.style.top = (elmnt.offsetTop + diffY) + "px";
            elmnt.style.left = (elmnt.offsetLeft + diffX) + "px";
        } else {
            const diffX = pos1 - e.clientX;
            const diffY = pos2 - e.clientY;
            pos1 = e.clientX;
            pos2 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - diffY) + "px";
            elmnt.style.left = (elmnt.offsetLeft - diffX) + "px";
        }

        //check for out of bounds
        if (pxToInt(elmnt.style.top) < 0) {
            elmnt.style.top = "0px";

            //if user is dragging finished plate to top
            if (allowedToSubmit && elmnt == kitchenPlate) {
                console.log("finishing objective");
                finishObjective();
                allowedToSubmit = false;
            }
        } //top
        if (pxToInt(elmnt.style.top) > window.innerHeight - 128) {
            elmnt.style.top = (window.innerHeight - 128) + "px";
        } //bottom
        if (pxToInt(elmnt.style.left) < 0) {
            elmnt.style.left = "0px";
        } //left
        if (pxToInt(elmnt.style.left) > window.innerWidth - 128) {
            elmnt.style.left = (window.innerWidth - 128) + "px";
        } //right

        //check for collision between item and plate
        if (isColliding(kitchenPlate, elmnt) && elmnt !== kitchenPlate) {
            stackIngredient(elmnt);
        }
    }

    function closeDragElement() {
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
        document.removeEventListener("touchend", closeDragElement);
        document.removeEventListener("touchmove", elementDrag);
    }
}

// detect collision (ty https://stackoverflow.com/a/59435080)
function isColliding(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    const isInHoriztonalBounds =
      rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
      rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
  }

// 32px -> 32
function pxToInt(string) {
    return parseInt(string.substring(0, string.length - 2));
}