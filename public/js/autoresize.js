console.log(`starting size: ${window.innerWidth}x${window.innerHeight}`)

//start off with one run
resizeCanvas()

//remove warning on touch
warning.on('pointerdown', () => {
    warning.parent.removeChild(warning);
});

//check if user is portrait
function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

// resize it
function resizeCanvas() {
    if (isPortraitMode()) {
        console.log("user is portrait!!!")
        app.stage.addChild(warning)

        for (let i = 0; i < SpriteScreenAlign.length; i++) {
            const sprite = SpriteScreenAlign[i];
            sprite.y = app.screen.height / 2
        }
    } else {
        app.stage.removeChild(warning)

        for (let i = 0; i < SpriteScreenAlign.length; i++) {
            const sprite = SpriteScreenAlign[i];
            sprite.x = app.screen.width / 2
        }
    }

    console.log(`Resizing to ${window.innerWidth}x${window.innerHeight}!`)
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    app.renderer.resize(width, height);
    
    // Resize and reposition any game elements that depend on the canvas size
    // ...
}

// debounce resizing every 0.250 seconds so it takes less resources
const debouncedResizeCanvas = debounce(resizeCanvas, 250);

// add window listeners to resize
window.addEventListener('resize', debouncedResizeCanvas);
window.addEventListener('fullscreenchange', debouncedResizeCanvas);
window.addEventListener('webkitfullscreenchange', debouncedResizeCanvas);
window.addEventListener('mozfullscreenchange', debouncedResizeCanvas);