const menu = new PIXI.Container();
app.stage.addChild(menu);

//logo
const fookit = PIXI.Sprite.from('../img/fookit.png');
fookit.anchor.set(0.5)
fookit.scale.set(1.3)
fookit.x = app.screen.width / 2
fookit.y = app.screen.height / 5
fookit.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

menu.addChild(fookit)
SpriteScreenAlign.push(fookit)

//join kitchen button
const join = PIXI.Sprite.from('../img/join.png');
join.anchor.set(0.5)
join.scale.set(3)
join.x = app.screen.width / 2
join.y = app.screen.height / 2.2
join.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

menu.addChild(join)
SpriteScreenAlign.push(join)

//create kitchen button
const create = PIXI.Sprite.from('../img/create.png');
create.anchor.set(0.5)
create.scale.set(2.3)
create.x = app.screen.width / 2
create.y = app.screen.height / 1.8
create.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

menu.addChild(create)
SpriteScreenAlign.push(create)