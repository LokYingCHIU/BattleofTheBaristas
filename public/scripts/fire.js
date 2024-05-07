const Fire = function(ctx, x, y) {
    const sequences = { x: 0, y: 16, width: 16, height: 16, count: 8, timing: 200, loop: true }

        // This is the sprite object of the player created from the Sprite module.
        const sprite = Sprite(ctx, x, y);

        // The sprite object is configured for the player sprite here.
        sprite.setSequence(sequences)
              .setScale(2)
              .setShadowScale({ x: 0.75, y: 0.20 })
              .useSheet("./images/object_sprites.png");


    return {
        draw: sprite.draw,
        update: sprite.update
    };
};



