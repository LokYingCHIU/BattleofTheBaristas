const Ingredient = function(ctx, x, y, item) {
    const sequences = {
        water:  { x: 336, y:  0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        matchap: { x: 144, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        milk: { x: 240, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        choco: { x: 48, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        lemon: { x: 192, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        tea: { x: 288, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        coffee: { x: 0, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true },
        icecream: { x: 96, y: 0, width: 48, height: 50, count: 1, timing: 200, loop: true }
    };

        // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

        // The sprite object is configured for the player sprite here.
    sprite.setSequence(sequences[item])
        .setScale(1)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("./images/drink_sprites.png");

    
    const setItem = function(item) {
                sprite.setSequence(sequences[item]);
                birthTime = performance.now();
    };

    const calibrate = function(area) {
        /* Randomize the color */
        // const item = ["water", "matchap", "milk", "choco", "lemon", "tea", "coffee", "ice"];
        // setItem(item[Math.floor(Math.random() * 8)]);

        // /* Randomize the position */
        // const {x, y} = area.randomPoint();
        sprite.setXY(320, 270);
    };


    return {
        draw: sprite.draw,
        getXY: sprite.getXY,
        update: sprite.update,
        setItem: setItem,
    };
};