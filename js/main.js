var keys = [];
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

$(window).load(function() {
    $('.start').click(function() {
        $(this).slideUp();
        init();
    });
    
    $('.restart').click(function() {
        $(this).slideUp();
        gravity = 0.978;
        player.vel_x = 0;
        player.vel_y = 0;
        player.dead = false;
        player.x = player.original_x;
        player.y = player.original_y-150;
        platform_bckg.x = platform_bckg.original_x;
        
        for (var i=0; i < platformBlock.length; i++) {
            platformBlock[i].x = platformBlock[i].original_x;
            platformBlock[i].y = platformBlock[i].original_y;
            platformBlock[i].sy = platformBlock[i].original_sy;
            platformBlock[i].height = platformBlock[i].original_height;
            platformBlock[i].hit = false;
            // platformBlock[i].specEat = false;
        }
        for (var i=0; i < creature.length; i++) {
            creature[i].x = creature[i].original_x;
            creature[i].y = creature[i].original_y;
            creature[i].count = 0;
            creature[i].dead = false;
        }
    });
});

function init() {
    // VARIABLES
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    soundJump = new Audio('audio/jump.wav');
    soundBackground = new Audio('audio/background.mp3');
    gravity = 0.978;
    firstTime = false;
    friction = 0.65;
    // soundBackground.play();
    // soundBackground.loop = true;
    mainLoop();
}

//MAIN LOOP

function mainLoop() {
    // if (player.dead) {
//         return;
//     }
    // -------- VARIABLES ADJUSTMENTS + SCROLLING EFFECT ---------
        // scrolling effect
    update();
    
    // -------------------- RENDERING & DRAWING -------------------
    
    // place the rAF *before* the render() to assure as close to
    // 60fps with the setTimeout fallback.
    requestAnimFrame(mainLoop);
    
    render();
}
function update() {
    if (!player.dead) {
        // ---------------------  KEYBOARD EVENTS  -----------------------
        
        // Player run Right
        if (keys[39]) {
            player.sy = 0;
            player.run();
            if (player.vel_x < player.speed) {
                player.vel_x += 0.8;
            }
        }
        // Player run Left
        if (keys[37]) {
            player.sy = player.height;
            player.run();
            if (player.vel_x > -player.speed) {
                player.vel_x -= 0.8 ;
            }
        }
        // up arrow or space
        if (keys[38] || keys[32]) {
            player.jump();
        }
        // down arrow
        //      if (keys[40]) {
            //          player.sx = player.width*7;
            //        }
        // if right or left arrow
        // stand
        if (!keys[38] && !keys[32] && !keys[37] && !keys[39] && !keys[40] && !player.jumps) {
            player.sx = 0 ;
        }
        if (!keys[39] && !keys[37])  player.vel_x *= friction;
        
        playerCollisions();
      
  } //end of if player is not dead  
    //that mean that everything after } will be executed after player is dead
  
  // ---------------------  LOGIC  -----------------------
  
    platform_bckg.x += -player.vel_x;
    player.y += player.vel_y;
    player.vel_y += gravity;

    for (var i = 0; i< platformBlock.length; i++) {
        platformBlock[i].x += -player.vel_x;
    }
    for (var i = 0; i< creature.length; i++) {
        creature[i].x += -player.vel_x;
        creature[i].walk();
    }
    for (var i = 0; i< flying_creature.length; i++) {
        flying_creature[i].x -= player.vel_x;
        flying_creature[i].fly();
    }

    if ( player.y <= canvas.width - canvas.width  && player.dead) {
        player.vel_y = 0;
    }
    //Player gravity fall down Sprite
    if (player.vel_y > 2) {
        player.sx = 318;
        player.width = 44.5;
        firstTime = true;
    }
}

function playerCollisions() {
        // ---  Player COLLISIONS with Platform Objects
    for (var i=0; i < platformBlock.length; i++) {
        if ( player.collision(platformBlock[i]) ) {
            // colision down
            if ( player.y + player.height < platformBlock[i].y + player.vel_y )  {
                player.y = platformBlock[i].y - player.height;
                player.width = 34;
                player.vel_y = 0;
                player.jumps = false;
                if (firstTime) {
                    player.sx = 0;
                    firstTime = false;
                }
                if (platformBlock[i].hit && platformBlock[i].type != "steel" ) {
                    platformBlock[i].EATcomeOutFromBlock();
                }
            }
            // colision up
            if ( player.y - player.vel_y + gravity > platformBlock[i].y + platformBlock[i].height  )  {
                player.y = platformBlock[i].y + platformBlock[i].height;
                player.vel_y = 0;
                if (!platformBlock[i].specEat && !platformBlock[i].hit && platformBlock[i].type != "steel" ) {
                    platformBlock[i].comeOutFromBlock();
                }
            }
            
            if ( player.y + player.height > platformBlock[i].y ) {
                
                // colision right
                if ( player.x + player.width < platformBlock[i].x + player.vel_x ) {
                    player.x = platformBlock[i].x - player.width;
                    player.vel_x = 0;
                    if ( platformBlock[i].hit && platformBlock[i].type != "steel" && player.y + player.height <= platformBlock[i].y + platformBlock[i].height/2 ) {
                        platformBlock[i].EATcomeOutFromBlock();
                    }
                }
                // colision left
                if ( player.x - player.vel_x > platformBlock[i].x + platformBlock[i].width ) {
                    player.x = platformBlock[i].x + platformBlock[i].width;
                    player.vel_x = 0;
                    if (platformBlock[i].hit && platformBlock[i].type != "steel" && player.y + player.height <= platformBlock[i].y + platformBlock[i].height/2 ) {
                        platformBlock[i].EATcomeOutFromBlock();
                    }
                }
            }
        }
    }
         // ---  Player collision with Creature Objects
    for (var i=0; i < creature.length; i++) {
        if (player.collision(creature[i]) &&  player.y + player.height < creature[i].y + player.vel_y)  {
             player.y = creature[i].y - player.height;
             player.jumpAttack();
             creature[i].die();
        } 
        if ( player.collision(creature[i]) && player.x < creature[i].x + player.vel_x && creature[i].y < player.y + player.height) {
            player.die();
        }
        if ( player.collision(creature[i]) && player.x > creature[i].x + player.vel_x && creature[i].y < player.y + player.height) {
           player.die();
        }
    }
         // ---  Player collision with down part of Canvas
        if (player.y + player.height >= canvas.height && !player.dead) {
            player.die();
        }
}

function render() {
    
    ctx.clearRect(0,0,canvas.width,600);
    
    ctx.drawImage(platform_bckg.img,platform_bckg.x,platform_bckg.y);
    
    for (var i=0; i < platformBlock.length; i++) {
        ctx.drawImage(
            platformBlock[i].sprite, 
            platformBlock[i].sx, 
            platformBlock[i].sy, 
            platformBlock[i].width, 
            platformBlock[i].height, 
            platformBlock[i].x, 
            platformBlock[i].y, 
            platformBlock[i].width, 
            platformBlock[i].height
        );
    }
    for (var i=0; i < player.lifes; i++) {
        ctx.drawImage(player.sprite, 318, 0, 44.5, 65, i * 30, 0, 29.667, 43.333);
    }
    
    for (var i=0; i < creature.length; i++) {
        ctx.drawImage(
            creature[i].sprite, 
            creature[i].sx, 
            creature[i].sy, 
            creature[i].width, 
            creature[i].height, 
            creature[i].x, 
            creature[i].y, 
            creature[i].width, 
            creature[i].height
        );
    }
    
    for (var i=0; i < flying_creature.length; i++) {
        ctx.drawImage(
            flying_creature[i].sprite, 
            flying_creature[i].sx, 
            flying_creature[i].sy, 
            flying_creature[i].width, 
            flying_creature[i].height, 
            flying_creature[i].x, 
            flying_creature[i].y,
            flying_creature[i].width, 
            flying_creature[i].height
        );
    }
    
    //the context drawn the las will always be in upfront position in CANVAS
    ctx.drawImage(player.sprite, player.sx, player.sy, player.width, player.height, player.x, player.y, player.width, player.height);
}
    // -------------------- EVENT LISTENERS -------------------
    
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});