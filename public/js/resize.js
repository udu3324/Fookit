console.log(`starting size: ${window.innerWidth}x${window.innerHeight}`)

//start off with one run
resizeCanvas()

// resize it
function resizeCanvas() {
    console.log(`Resizing to ${window.innerWidth}x${window.innerHeight}!`)
    
    //basic check if window is portrait
    const mainMenu = document.getElementById('mm-layout');
    if (window.innerHeight > window.innerWidth) {
        console.log("user is portrait")

        mainMenu.classList.remove('grid-cols-5');
        mainMenu.classList.add('grid-rows-5');
    } else {
        console.log("user is landscape")

        mainMenu.classList.remove('grid-rows-5');
        mainMenu.classList.add('grid-cols-5');
    }

    //check if any ingredients are out of screen
    let midW = (window.innerWidth / 2 - 64) + "px";
    let midH = (window.innerHeight / 2 - 64) + "px";

    const ingredients = document.getElementsByClassName('sprite');
    
    Array.from(ingredients).forEach(function(e) {
        let width = pxToInt(e.style.left);
        let height = pxToInt(e.style.top);

        if (width < 0 || height < 0) {
            e.style.left = midW;
            e.style.top = midH;
        }
        if (width > window.innerWidth - 129 || height > window.innerHeight - 129) {
            e.style.left = midW;
            e.style.top = midH;
        }
    });
}

// debounce resizing every 0.250 seconds so it takes less resources
const debouncedResizeCanvas = debounce(resizeCanvas, 250);

// add window listeners to resize
window.addEventListener('resize', debouncedResizeCanvas);
window.addEventListener('fullscreenchange', debouncedResizeCanvas);
window.addEventListener('webkitfullscreenchange', debouncedResizeCanvas);
window.addEventListener('mozfullscreenchange', debouncedResizeCanvas);