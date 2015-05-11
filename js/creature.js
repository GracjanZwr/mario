var creature = [];

function Creature(sprite, x, y, sx , sy, width, height, speed, distance) {
    this.sprite  = new Image();
    this.sprite.src = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = sx;
    this.sy = sy;
    this.speed = speed;
    this.distance = distance;
    this.original_x = this.x;
    this.original_y = this.y;
    this.turn = false;
    this.count = 0;
    this.dead = false;
}
Creature.prototype.die = function die() {
    this.dead = true;
    this.sx = this.width*2;
}
Creature.prototype.walk = function walk() {    
    if (!this.dead){
        if (!this.turn) {
             this.sx = 0;
            this.x += this.speed;
            this.count += this.speed;;
            if (this.count >= this.distance) {
                this.turn = true;
            }
        }
    
        if (this.turn) {
            this.sx = this.width;
            this.x -= this.speed;
            this.count -= this.speed;;
            if (this.count <= this.distance - this.distance) {
                this.turn = false;
            }
        }
    }if(this.dead) {
        if (this.y < canvas.height + 100) {
            this.y += 9;
        }
    } 
}
// Platform instances (objects)

$.getJSON('levels/creature.json', function(data) {
    for( i in data ) {
        creature[i] = new Creature(data[i].img ,data[i].x , data[i].y , data[i].sx, data[i].sy, data[i].width, data[i].height, data[i].speed, data[i].distance);
    };
});
