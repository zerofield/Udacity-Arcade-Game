const STATE_IDLE = 0;
const STATE_MOVING = 1;
const DEBUG = true;

class Rect{
    constructor(left, top, right, bottom){
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    width(){
        return this.right - this.left;
    }

    height(){
        return this.bottom - this.top;
    }
}

class GameObject{
    constructor(x = 0, y = 0, sprite, collistionBounds) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.collistionBounds = collistionBounds;
    }

    update(dt){

    }

    render(){
        if(DEBUG) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
           
            ctx.fillRect(this.x + this.collistionBounds.left, 
                this.y + this.collistionBounds.top,
                this.collistionBounds.width(), 
                this.collistionBounds.height());
        }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


class Enemy extends GameObject {

    constructor(x, y, xSpeed){
        super(x, y, 'images/enemy-bug.png', new Rect(0, 73, 101, 153));
        this.xSpeed = xSpeed;
    }

    update(dt){
        this.x += dt * this.xSpeed;
        console.log(window.ctx.width);
        if (this.x + this.collistionBounds. > window.ctx.width){
            this.x = 0;
        }

    }

}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
class Player extends GameObject {

    constructor(x, y, moveSpeed) {
        super(x, y, 'images/char-boy.png', new Rect(0, 73, 101, 153))
        this.targetX = x;
        this.targetY = y;
        this.moveSpeed = moveSpeed;
        this.state = STATE_IDLE;
    }

    update(dt) {

    }

    handleInput(key) {
        if (this.state === STATE_MOVING) {
            return;
        }

        console.log(`key = ${key}`);
        
        if (key === 'left') {

        } else if(key === 'right') {

        } else if(key === 'up') {

        } else if(key ==='down') {

        }
    }

    setTarget(targetX, targetY){
        this.targetX = targetX;
        this.targetY = targetY;
    }

}


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

var allEnemies = [];
for (let i = 0; i < 3; ++i) {
    const enemy = new Enemy(0, 83 * (i + 1) - 23, 3);
    allEnemies.push(enemy);
}


var player = new Player(101 * 2, 83 * 5 - 23);



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
