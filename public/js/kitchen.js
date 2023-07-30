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
function stackIngredient(element) {
    var item = document.createElement('div');
    item.classList.add('sprite');
    item.classList.add(element.classList[1]);

    kitchenPlate.appendChild(item);

    element.remove();
    
    //move this to a diff function
    //let current = currentStack.length;

    //if (dishObjective[current] == element.classList[1])
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
        }
        if (pxToInt(elmnt.style.top) > window.innerHeight - 128) {
            elmnt.style.top = (window.innerHeight - 128) + "px";
        }
        if (pxToInt(elmnt.style.left) < 0) {
            elmnt.style.left = "0px";
        }
        if (pxToInt(elmnt.style.left) > window.innerWidth - 128) {
            elmnt.style.left = (window.innerWidth - 128) + "px";
        }
    }

    function closeDragElement() {
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
        document.removeEventListener("touchend", closeDragElement);
        document.removeEventListener("touchmove", elementDrag);
    }
}

// 32px -> 32
function pxToInt(string) {
    return parseInt(string.substring(0, string.length - 2));
}