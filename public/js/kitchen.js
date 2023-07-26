const kitchen = document.getElementById('kitchen');

//kitchen has ended
socket.on("kitchen_return_menu", () => {
    mm.classList.remove('hidden');
    kitchen.classList.add('hidden');

    console.log("kitchen has stopped")
});

dragElement(document.getElementById('toast'))

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
        if (pxToInt(elmnt.style.top) > window.innerHeight - 129) {
            elmnt.style.top = (window.innerHeight - 129) + "px";
        }
        if (pxToInt(elmnt.style.left) < 0) {
            elmnt.style.left = "0px";
        }
        if (pxToInt(elmnt.style.left) > window.innerWidth - 129) {
            elmnt.style.left = (window.innerWidth - 129) + "px";
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