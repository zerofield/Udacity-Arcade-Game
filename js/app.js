const STATE_IDLE = 0;
const STATE_MOVING = 1;

const DEBUG = false;

const GRID_WIDTH = 101;
const GRID_HEIGHT = 83;

const GRID_H_COUNT = 5;
const GRID_V_COUNT = 6;

const Y_OFFSET = 23;

const DIRECTION_LEFT = -1;
const DIRECTION_RIGHT = 1;

class Rect {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    width() {
        return this.right - this.left;
    }

    height() {
        return this.bottom - this.top;
    }

    isIntersectedWith(other) {
        return this.left < other.right &&
            other.left < this.right &&
            this.top < other.bottom &&
            other.top < this.bottom;
    }
}

class GameObject {
    constructor(x = 0, y = 0, sprite, collistionBounds) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.collistionBounds = collistionBounds;
    }

    update(dt) {

    }

    render() {
        if (DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

            ctx.fillRect(this.x + this.collistionBounds.left,
                this.y + this.collistionBounds.top,
                this.collistionBounds.width(),
                this.collistionBounds.height());
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    getBoundingBox() {
        return new Rect(this.x + this.collistionBounds.left,
            this.y + this.collistionBounds.top,
            this.x + this.collistionBounds.right,
            this.y + this.collistionBounds.bottom);
    }
}


class Enemy extends GameObject {

    constructor(x, y, xSpeed, direction) {
        super(x, y, 'images/enemy-bug.png', new Rect(0, 73, 101, 153));
        this.direction = direction;
        this.xSpeed = xSpeed * (this.direction == DIRECTION_LEFT ? -1 : 1);
    }

    update(dt) {
        this.x += dt * this.xSpeed;
        const canvasElem = document.querySelector('canvas');

        if (this.x > canvasElem.width) {
            this.x = -this.collistionBounds.width();
        } else if (this.x + this.collistionBounds.width() < 0) {
            this.x = canvasElem.width;
        }
    }

    render() {

        if (this.direction == DIRECTION_LEFT) {
            // DRAW FLIPPED sprite
            const canvasElem = document.querySelector('canvas');
            const canvasWidth = canvasElem.width;
            const canvasHeight = canvasElem.height;

            ctx.save();
            ctx.scale(this.direction, 1);
            ctx.translate(-(this.x + 101), 0);

            if (DEBUG) {
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                ctx.fillRect(this.collistionBounds.left,
                    this.y + this.collistionBounds.top,
                    this.collistionBounds.width(),
                    this.collistionBounds.height());
            }
            ctx.drawImage(Resources.get(this.sprite), 0, this.y);
            ctx.restore();
        } else {
            GameObject.prototype.render.call(this);
        }
    }

}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
class Player extends GameObject {

    constructor(x, y, moveSpeed) {
        super(x, y, 'images/char-boy.png', new Rect(17, 80, 84, 153))
        this.targetX = x;
        this.targetY = y;
        this.moveSpeed = moveSpeed;
        this.state = STATE_IDLE;

    }

    update(dt) {

        if (this.targetX == this.x && this.targetY == this.y) {
            this.state = STATE_IDLE;

            if (this.y <= 0) {
                hitGoal();
            }

            return;
        }

        const moveAmount = this.moveSpeed * dt;
        const dy = this.targetY - this.y;
        const dx = this.targetX - this.x;

        const distance = Math.sqrt(dy * dy + dx * dx);
        if (distance < moveAmount) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.state = STATE_IDLE;
        } else {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * moveAmount;
            this.y += Math.sin(angle) * moveAmount;
        }
    }

    handleInput(key) {
        if (this.state === STATE_MOVING) {
            return;
        }

        console.log(`key = ${key}`);
        const canvasElem = document.querySelector('canvas');
        const canvasWidth = canvasElem.width;
        const canvasHeight = canvasElem.height;

        if (key === 'left') {
            if (this.x > 0) {
                this.targetX = this.x - GRID_WIDTH;
                this.state = STATE_MOVING;
            }
        } else if (key === 'right') {
            if (this.x < 4 * GRID_WIDTH) {
                this.targetX = this.x + GRID_WIDTH;
                this.state = STATE_MOVING;
            }
        } else if (key === 'up') {
            if (this.y > 0) {
                this.targetY = this.y - GRID_HEIGHT;
                this.state = STATE_MOVING;
            }
        } else if (key === 'down') {
            if (this.y < 4 * GRID_HEIGHT) {
                this.targetY = this.y + GRID_HEIGHT;
                this.state = STATE_MOVING;
            }
        }
    }
}


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

var allEnemies = [];
for (let i = 0; i < 3; ++i) {
    //random speed
    const enemySpeed = 300 + (Math.random() - 0.5) * 100;
    //random direction
    const direction = Math.random() < 0.5 ? DIRECTION_LEFT : DIRECTION_RIGHT;

    const enemy = new Enemy(0 + Math.random() * 505,
        GRID_HEIGHT * (i + 1) - Y_OFFSET,
        enemySpeed,
        direction);
    allEnemies.push(enemy);
}


const playerX = GRID_WIDTH * Math.floor(GRID_H_COUNT / 2);
const playerY = GRID_HEIGHT * (GRID_V_COUNT - 1) - Y_OFFSET;
const playerSpeed = 300;
const player = new Player(playerX, playerY, playerSpeed);


function hitGoal() {
    resetPlayer();
}


function resetPlayer() {
    player.x = playerX;
    player.y = playerY;
    player.targetX = playerX;
    player.targetY = playerY;
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});