// MARIO instance
var player = new Player('img/player_sprite.png', 200, 435, 34, 65, 0, 0);
// MARIO CONSTRUCTOR
function Player(sprite, x, y, width, height, sx, sy) {
    this.sprite  = new Image();
    this.sprite.src = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = sx;
    this.sy = sy;
    this.vel_x = 0;
    this.vel_y = 0;
    // this.weight = 2.6;
    this.speed = 4;
    this.original_x = this.x;
    this.original_y = this.y;
    this.jumps = false;
    this.lifes = 3;
    this.dead;
    //change sprite frame every .2 sec.
    this.frames = 100;
    this.count = 0;
}
Player.prototype.collision = function collision(obj) {
    if (this.x > obj.x + obj.width) return false;
    if (this.x + this.width < obj.x) return false;
    if (this.y > obj.y + obj.height) return false;
    if (this.y + this.height < obj.y) return false;
    return true;
}
Player.prototype.jump = function jump() {
    for (var i=0; i < platformBlock.length; i++) {
        // if player touch the ground
        if (player.collision(platformBlock[i])) {
            if(!this.jumps) {
                this.jumps = true;
                // soundJump.play();
                this.vel_y = -16;
                this.sx = 274;
                this.width = 44.5;
            }
        }
    }
}
Player.prototype.jumpAttack = function jumpAttack() {
    player.vel_y = -8;
    player.y += player.vel_y;
    this.sx = 274;
    this.width = 44.5;
    soundJump.play();
}
Player.prototype.run = function run() {

    // Changing Sprites
    for (var i=0; i < platformBlock.length; i++) {
        // if player touch the ground
        if ( !player.jumps ) {

            if (player.sx == 0) {
                    player.sx = player.width;
            }
            if (player.count < player.frames) {
                player.count ++;
            }
            if (player.count >= player.frames) {
                player.sx += player.width;
                player.count = 0;
            }
            //end of sprite animation
            if (player.sx == player.width * 6) {
                    player.sx = player.width;
            }
        }
    }
}
Player.prototype.die = function die() {
    // $('.restart').slideDown();
    gravity = 0;
    this.vel_y = 0;
    this.vel_y -= 1;
    this.vel_x = 0;
    this.sx = 364;
    this.width = 47;
    this.dead = true;
    this.lifes -= 1;
    if (player.lifes >= 0) {
        $('.restart').slideDown();
    }
    if (this.lifes < 0) {
        $('.game-over').slideDown();
    }
}
Player.prototype.level_finished = function level_finished() {
  $('.level_finished').slideDown();
}
