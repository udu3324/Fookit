const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000
});

// Debounce function to control the rate at which the resizeCanvas function is called
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Add the PixiJS canvas to the HTML document
document.body.appendChild(app.view);

// Create a sprite and add it to the stage
const sprite = PIXI.Sprite.from('../img/test.png');
sprite.x = 10;
sprite.y = 10;
app.stage.addChild(sprite);