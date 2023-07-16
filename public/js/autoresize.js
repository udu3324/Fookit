console.log(`starting size: ${window.innerWidth}x${window.innerHeight}`)

// resize it
function resizeCanvas() {
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