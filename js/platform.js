// platform Arrays
var platformBlock = [];

// Platform_
function Platform_Background(img, x, y) {
    this.img  = new Image();
    this.img.src = img;
    this.x = x;
    this.y = y;
    this.original_x = this.x;
}
// like bricks castles
function Platform_Object(sprite, sx, sy, x, y, width, height, type) {
    this.sprite  = new Image();
    this.sprite.src = sprite;
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.type = type;
    this.original_x = this.x;
    this.original_y = this.y;
    this.original_sy = this.sy;
    this.original_height = this.height;
    // if mushrooms on special type bricks were used
    this.hit = false;
    this.specEat = false;
}
Platform_Object.prototype.comeOutFromBlock = function comeOutFromBlock() {
    
    if (this.type == 'mushroom') {
        this.y -= 50;
        this.height = 100;
        this.sy = 0;
        this.hit = true;
    }
}
Platform_Object.prototype.EATcomeOutFromBlock = function EATcomeOutFromBlock() {
    this.sy = this.original_sy;
    this.height = this.original_height;
    this.y = this.original_y;
    if (!this.specEat) {
        this.specEat = true;
        if (this.type = "mushroom") {
            player.lifes += 1;
        }
    }
}
// Platform instances (object)
var platform_bckg = new Platform_Background('img/level1/skyBckg.png',-110,0);

$.getJSON('levels/level1.json', function(data) {
    for( i in data ) {
        platformBlock[i] = new Platform_Object(data[i].sprite, data[i].sx, data[i].sy, data[i].x, data[i].y , data[i].width, data[i].height, data[i].type);
    };
});