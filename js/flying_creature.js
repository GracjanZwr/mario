var flying_creature = [];
// like moving clouds or birds
function Flying_Creature(sprite, x, y, width, height, sx, sy) {
    this.sprite  = new Image();
    this.sprite.src = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = sx;
    this.sy = sy;
    this.vel_x = 0;
    this.speed = 3;
}

Flying_Creature.prototype.fly = function fly() {
    
    this.x -= this.speed;
    this.sx -= 63.75;
    if (this.sx <= 0) {
        this.sx = 446.25;
    }

    if (this.x + this.width <= canvas.width - canvas.width) {
        this.x = canvas.width*3;
    }
}

flying_creature[0] = new Flying_Creature('img/level1/flappy-flying-bird.png',1500, 50, 65, 45, 510, 0);