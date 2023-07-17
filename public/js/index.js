const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0FA123
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

//sprite alignment stuff
const SpriteScreenAlign = [];

// warning that pops up when user is portrait mode
const warning = PIXI.Sprite.from('../img/rotate.png');

warning.anchor.set(0.5)
warning.scale.set(3)
warning.x = app.screen.width / 2
warning.y = app.screen.height / 10
warning.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
warning.interactive = true