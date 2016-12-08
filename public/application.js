(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var vector_1 = require('./vector');
var obstacle_1 = require('./obstacle');
var enums_1 = require('./enums');
var ball_1 = require('./ball');
var paddle_1 = require('./paddle');
var bricks_1 = require('./bricks');
var Game = (function () {
    function Game(ballElement, paddle, bricks, boardElement, livesLabel, scoreLabel, newGameBtn) {
        var _this = this;
        this.livesLabel = livesLabel;
        this.scoreLabel = scoreLabel;
        this.newGameBtn = newGameBtn;
        this.loopInterval = 10;
        this.bricks = [];
        this.keyMap = {};
        this.gameState = enums_1.GameState.Running;
        this.paddle = new paddle_1.Paddle(paddle, boardElement.offsetWidth);
        this.ball = new ball_1.Ball(ballElement, new vector_1.Vector(3, -3));
        for (var i = 0; i < bricks.length; i++) {
            if (bricks[i].classList.contains('doublebrick')) {
                this.bricks.push(new bricks_1.DoubleBrick(bricks[i]));
            }
            else if (bricks[i].classList.contains('immortal')) {
                this.bricks.push(new bricks_1.ImmortalBrick(bricks[i]));
            }
            else {
                this.bricks.push(new bricks_1.Brick(bricks[i]));
            }
        }
        this.createWalls(this.ball.radius, boardElement.offsetWidth, boardElement.offsetHeight);
        this.newGame();
        this.newGameBtn.addEventListener('click', function () { return _this.newGame(); });
    }
    Game.prototype.createWalls = function (radius, maxX, maxY) {
        this.wallLeft = new obstacle_1.Obstacle(-radius, -radius, 0, maxY + radius);
        this.wallTop = new obstacle_1.Obstacle(-radius, -radius, maxX + radius, 0);
        this.wallRight = new obstacle_1.Obstacle(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new obstacle_1.Obstacle(-radius, maxY, maxX + radius, maxY + radius);
    };
    Game.prototype.newGame = function () {
        this.newGameBtn.style.display = 'none';
        this.score = 0;
        this.livesLeft = 3;
        this.livesLabel.innerText = '' + this.livesLeft;
        this.score = 0;
        this.scoreLabel.innerText = '' + this.score;
        this.ball.show();
        this.ball.bounceWithAngle(60);
        var ballPosition = this.ball.clone();
        ballPosition.moveCenterXTo(this.paddle.centerX());
        ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
        this.ball.moveTo(ballPosition);
        this.gameState = enums_1.GameState.Running;
    };
    Game.prototype.lostLive = function () {
        if (--this.livesLeft) {
            this.ball.bounceWithAngle(60);
            var ballPosition = this.ball.clone();
            ballPosition.moveCenterXTo(this.paddle.centerX());
            ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
            this.ball.moveTo(ballPosition);
        }
        else {
            this.gameState = enums_1.GameState.GameOver;
            this.ball.hide();
            this.newGameBtn.style.display = 'block';
        }
        this.livesLabel.innerText = '' + this.livesLeft;
    };
    Game.prototype.run = function () {
        var _this = this;
        document.addEventListener('keyup', function (e) { return _this.keyMap[e.keyCode] = false; });
        document.addEventListener('keydown', function (e) { return _this.keyMap[e.keyCode] = true; });
        setInterval(function () {
            if (_this.gameState !== enums_1.GameState.Running) {
                return;
            }
            var newBallPosition = _this.ball.calculateNewPosition();
            if (_this.keyMap[enums_1.KeyCodes.LEFT]) {
                _this.paddle.moveLeft(5);
            }
            else if (_this.keyMap[enums_1.KeyCodes.RIGHT]) {
                _this.paddle.moveRight(5);
            }
            if (_this.wallBottom.checkCollision(newBallPosition)) {
                _this.lostLive();
                return;
            }
            if (_this.wallLeft.checkCollision(newBallPosition) || _this.wallRight.checkCollision(newBallPosition)) {
                _this.ball.bounceVertical();
            }
            if (_this.wallTop.checkCollision(newBallPosition)) {
                _this.ball.bounceHorizontal();
            }
            for (var _i = 0, _a = _this.bricks; _i < _a.length; _i++) {
                var brick = _a[_i];
                var wasHit = false;
                switch (brick.checkCollision(newBallPosition)) {
                    case (enums_1.Side.Left):
                    case (enums_1.Side.Right):
                        _this.ball.bounceVertical();
                        wasHit = true;
                        break;
                    case (enums_1.Side.Top):
                    case (enums_1.Side.Bottom):
                        _this.ball.bounceHorizontal();
                        wasHit = true;
                }
                if (wasHit) {
                    if (brick.wasHit()) {
                        brick.hide();
                    }
                    else {
                        brick.oneLifeLeft();
                    }
                    _this.score += 20;
                    _this.scoreLabel.innerText = '' + _this.score;
                    break;
                }
            }
            if (_this.paddle.checkCollision(newBallPosition)) {
                _this.ball.bounceWithAngle(_this.paddle.calculateHitAngle(_this.ball.centerX(), _this.ball.radius));
            }
            _this.ball.moveTo(_this.ball.calculateNewPosition());
        }, this.loopInterval);
    };
    return Game;
}());
console.log('Hello from BrickBuster !!!');
var game = new Game(document.getElementsByClassName("ball")[0], document.getElementsByClassName("paddle")[0], document.getElementsByClassName("brick"), document.getElementsByClassName("game-board")[0], document.getElementById('lives'), document.getElementById('score'), document.getElementById('newGame'));
game.run();
},{"./ball":2,"./bricks":3,"./enums":4,"./obstacle":5,"./paddle":6,"./vector":10}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sprite_1 = require('./sprite');
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(sprite, dir) {
        var radius = parseInt(getComputedStyle(sprite)['border-top-left-radius']);
        _super.call(this, sprite, sprite.offsetLeft, sprite.offsetTop, sprite.offsetLeft + 2 * radius, sprite.offsetTop + 2 * radius);
        this.sprite = sprite;
        this.radius = radius;
        this.velocity = 5;
        this.dir = dir;
    }
    Ball.prototype.calculateNewPosition = function () {
        var newPosition = this.clone();
        newPosition.add(this.dir);
        return newPosition;
    };
    Ball.prototype.bounceHorizontal = function () {
        this.dir.flipY();
    };
    Ball.prototype.bounceVertical = function () {
        this.dir.flipX();
    };
    Ball.prototype.bounceWithAngle = function (angle) {
        angle = angle * (Math.PI / 180);
        this.dir.x = Math.cos(angle) * this.velocity;
        this.dir.y = -Math.sin(angle) * this.velocity;
    };
    return Ball;
}(sprite_1.Sprite));
exports.Ball = Ball;
},{"./sprite":9}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sprite_1 = require('./sprite');
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick() {
        _super.apply(this, arguments);
        this.lifeLeft = 1;
    }
    Brick.prototype.oneLifeLeft = function () {
        this.sprite.classList.remove('doublebrick');
    };
    Brick.prototype.wasHit = function () {
        return --this.lifeLeft < 1;
    };
    return Brick;
}(sprite_1.Sprite));
exports.Brick = Brick;
var DoubleBrick = (function (_super) {
    __extends(DoubleBrick, _super);
    function DoubleBrick() {
        _super.apply(this, arguments);
        this.lifeLeft = 2;
    }
    return DoubleBrick;
}(Brick));
exports.DoubleBrick = DoubleBrick;
var ImmortalBrick = (function (_super) {
    __extends(ImmortalBrick, _super);
    function ImmortalBrick() {
        _super.apply(this, arguments);
    }
    ImmortalBrick.prototype.wasHit = function () {
        return false;
    };
    return ImmortalBrick;
}(DoubleBrick));
exports.ImmortalBrick = ImmortalBrick;
},{"./sprite":9}],4:[function(require,module,exports){
"use strict";
(function (Side) {
    Side[Side["None"] = 0] = "None";
    Side[Side["Left"] = 1] = "Left";
    Side[Side["Top"] = 2] = "Top";
    Side[Side["Right"] = 3] = "Right";
    Side[Side["Bottom"] = 4] = "Bottom";
})(exports.Side || (exports.Side = {}));
var Side = exports.Side;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["GameOver"] = 1] = "GameOver";
})(exports.GameState || (exports.GameState = {}));
var GameState = exports.GameState;
(function (KeyCodes) {
    KeyCodes[KeyCodes["LEFT"] = 37] = "LEFT";
    KeyCodes[KeyCodes["RIGHT"] = 39] = "RIGHT";
})(exports.KeyCodes || (exports.KeyCodes = {}));
var KeyCodes = exports.KeyCodes;
},{}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rect_1 = require('./rect');
var enums_1 = require('./enums');
var Obstacle = (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle() {
        _super.apply(this, arguments);
    }
    Obstacle.prototype.checkCollision = function (anotherRect) {
        var w = 0.5 * (this.width() + anotherRect.width());
        var h = 0.5 * (this.height() + anotherRect.height());
        var dx = this.centerX() - anotherRect.centerX();
        var dy = this.centerY() - anotherRect.centerY();
        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                return wy > -hx ? enums_1.Side.Top : enums_1.Side.Left;
            }
            else {
                return wy > -hx ? enums_1.Side.Right : enums_1.Side.Bottom;
            }
        }
        else {
            return enums_1.Side.None;
        }
    };
    return Obstacle;
}(rect_1.Rect));
exports.Obstacle = Obstacle;
},{"./enums":4,"./rect":8}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sprite_1 = require('./sprite');
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle(sprite, maxRight) {
        _super.call(this, sprite);
        this.maxRight = maxRight;
    }
    Paddle.prototype.moveLeft = function (step) {
        var newPosition = this.clone();
        newPosition.moveLeft(step);
        if (newPosition.topLeft.x >= 0) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.moveRight = function (step) {
        var newPosition = this.clone();
        newPosition.moveRight(step);
        if (newPosition.bottomRight.x <= this.maxRight) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.calculateHitAngle = function (ballX, ballRadius) {
        var hitSpot = ballX - this.topLeft.x;
        var maxPaddle = this.width() + ballRadius;
        var minPaddle = -ballRadius;
        var paddleRange = maxPaddle - minPaddle;
        var minAngle = 160;
        var maxAngle = 20;
        var angleRange = maxAngle - minAngle;
        return ((hitSpot * angleRange) / paddleRange) + minAngle;
    };
    return Paddle;
}(sprite_1.Sprite));
exports.Paddle = Paddle;
},{"./sprite":9}],7:[function(require,module,exports){
"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (point) {
        this.x += point.x;
        this.y += point.y;
    };
    return Point;
}());
exports.Point = Point;
},{}],8:[function(require,module,exports){
"use strict";
var point_1 = require('./point');
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.topLeft = new point_1.Point(left, top);
        this.bottomRight = new point_1.Point(right, bottom);
    }
    Rect.prototype.clone = function () {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    };
    Rect.prototype.add = function (point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    };
    Rect.prototype.moveTo = function (rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    };
    Rect.prototype.moveCenterXTo = function (centerX) {
        var left = centerX - this.width() / 2;
        var right = left + this.width();
        this.topLeft.x = left;
        this.bottomRight.x = right;
    };
    Rect.prototype.moveBottomTo = function (bottom) {
        this.topLeft.y = bottom - this.height();
        this.bottomRight.y = bottom;
    };
    Rect.prototype.width = function () {
        return this.bottomRight.x - this.topLeft.x;
    };
    Rect.prototype.height = function () {
        return this.bottomRight.y - this.topLeft.y;
    };
    Rect.prototype.centerX = function () {
        return (this.topLeft.x + this.bottomRight.x) / 2;
    };
    Rect.prototype.centerY = function () {
        return (this.topLeft.y + this.bottomRight.y) / 2;
    };
    Rect.prototype.moveLeft = function (step) {
        this.topLeft.x -= step;
        this.bottomRight.x -= step;
    };
    Rect.prototype.moveRight = function (step) {
        this.topLeft.x += step;
        this.bottomRight.x += step;
    };
    return Rect;
}());
exports.Rect = Rect;
},{"./point":7}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var obstacle_1 = require('./obstacle');
var enums_1 = require('./enums');
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(sprite, left, top, right, bottom) {
        bottom = bottom || sprite.offsetTop + sprite.offsetHeight;
        right = right || sprite.offsetLeft + sprite.offsetWidth;
        top = top || sprite.offsetTop;
        left = left || sprite.offsetLeft;
        _super.call(this, left, top, right, bottom);
        this.sprite = sprite;
        this.isVisible = true;
    }
    Sprite.prototype.moveTo = function (rect) {
        _super.prototype.moveTo.call(this, rect);
        var _a = this.topLeft, posX = _a.x, posY = _a.y;
        this.sprite.style.left = posX + 'px';
        this.sprite.style.top = posY + 'px';
    };
    Sprite.prototype.hide = function () {
        this.sprite.style.display = 'none';
        this.isVisible = false;
    };
    Sprite.prototype.show = function () {
        this.sprite.style.display = 'block';
        this.isVisible = true;
    };
    Sprite.prototype.checkCollision = function (anotherRect) {
        if (!this.isVisible) {
            return enums_1.Side.None;
        }
        return _super.prototype.checkCollision.call(this, anotherRect);
    };
    return Sprite;
}(obstacle_1.Obstacle));
exports.Sprite = Sprite;
},{"./enums":4,"./obstacle":5}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var point_1 = require('./point');
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector() {
        _super.apply(this, arguments);
    }
    Vector.prototype.flipX = function () {
        this.x *= -1;
    };
    Vector.prototype.flipY = function () {
        this.y *= -1;
    };
    return Vector;
}(point_1.Point));
exports.Vector = Vector;
},{"./point":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBsaWNhdGlvbi50cyIsImJhbGwudHMiLCJicmlja3MudHMiLCJlbnVtcy50cyIsIm9ic3RhY2xlLnRzIiwicGFkZGxlLnRzIiwicG9pbnQudHMiLCJyZWN0LnRzIiwic3ByaXRlLnRzIiwidmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0NBLHVCQUF1QixVQUFVLENBQUMsQ0FBQTtBQUVsQyx5QkFBeUIsWUFBWSxDQUFDLENBQUE7QUFDdEMsc0JBQTBDLFNBQVMsQ0FBQyxDQUFBO0FBRXBELHFCQUFxQixRQUFRLENBQUMsQ0FBQTtBQUM5Qix1QkFBdUIsVUFBVSxDQUFDLENBQUE7QUFDbEMsdUJBQWtELFVBQVUsQ0FBQyxDQUFBO0FBRTdEO0lBaUJJLGNBQVksV0FBeUIsRUFBRSxNQUFtQixFQUFFLE1BQXNCLEVBQUUsWUFBMEIsRUFBUyxVQUF3QixFQUNwSSxVQUF1QixFQUFTLFVBQXVCO1FBbEJ0RSxpQkFtSkM7UUFsSTBILGVBQVUsR0FBVixVQUFVLENBQWM7UUFDcEksZUFBVSxHQUFWLFVBQVUsQ0FBYTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQWE7UUFqQmxFLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBSTFCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxFQUFFLENBQUM7UUFZUixJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFTLENBQUMsT0FBTyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksV0FBSSxDQUNoQixXQUFXLEVBQ1gsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQ3BCLENBQUM7UUFFRixHQUFHLENBQUMsQ0FBQyxJQUFJLENB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QUE0Qiw4QkFBSztJQVFqQyxDQUFDO0lBUEcsc0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELHNCQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFDTCxhQUFDO0FBQUQsQ0FSQSxBQVFDLENBUjJCLGFBQUssR0FRaEM7QUFSWSxjQUFNLFNBUWxCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL3BvaW50JztcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gJy4vdmVjdG9yJztcbmltcG9ydCB7IFJlY3QgfSBmcm9tICcuL3JlY3QnO1xuaW1wb3J0IHsgT2JzdGFjbGUgfSBmcm9tICcuL29ic3RhY2xlJztcbmltcG9ydCB7IFNpZGUsIEdhbWVTdGF0ZSwgS2V5Q29kZXMgfSBmcm9tICcuL2VudW1zJztcbmltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4vc3ByaXRlJztcbmltcG9ydCB7IEJhbGwgfSBmcm9tICcuL2JhbGwnO1xuaW1wb3J0IHsgUGFkZGxlIH0gZnJvbSAnLi9wYWRkbGUnO1xuaW1wb3J0IHsgQnJpY2ssIERvdWJsZUJyaWNrLCBJbW1vcnRhbEJyaWNrIH0gZnJvbSAnLi9icmlja3MnO1xuXG5jbGFzcyBHYW1lIHtcbiAgICBsb29wSW50ZXJ2YWw6IG51bWJlciA9IDEwO1xuICAgIGdhbWVTdGF0ZTogR2FtZVN0YXRlO1xuICAgIGJhbGw6IEJhbGw7XG4gICAgcGFkZGxlOiBQYWRkbGU7XG4gICAgYnJpY2tzOiBBcnJheTxCcmljaz4gPSBbXTtcblxuICAgIGtleU1hcCA9IHt9O1xuXG4gICAgd2FsbExlZnQgOiBPYnN0YWNsZTtcbiAgICB3YWxsVG9wOiBPYnN0YWNsZTtcbiAgICB3YWxsUmlnaHQ6IE9ic3RhY2xlO1xuICAgIHdhbGxCb3R0b206IE9ic3RhY2xlOyAgICBcblxuICAgIGxpdmVzTGVmdCA6IG51bWJlcjtcbiAgICBzY29yZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoYmFsbEVsZW1lbnQgOiBIVE1MRWxlbWVudCwgcGFkZGxlOiBIVE1MRWxlbWVudCwgYnJpY2tzOiBIVE1MQ29sbGVjdGlvbiwgYm9hcmRFbGVtZW50IDogSFRNTEVsZW1lbnQsIHB1YmxpYyBsaXZlc0xhYmVsIDogSFRNTEVsZW1lbnQsXG4gICAgICAgIHB1YmxpYyBzY29yZUxhYmVsOiBIVE1MRWxlbWVudCwgcHVibGljIG5ld0dhbWVCdG46IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLlJ1bm5pbmc7XG4gICAgICAgIHRoaXMucGFkZGxlID0gbmV3IFBhZGRsZShwYWRkbGUsIGJvYXJkRWxlbWVudC5vZmZzZXRXaWR0aCk7XG5cbiAgICAgICAgdGhpcy5iYWxsID0gbmV3IEJhbGwoXG4gICAgICAgICAgICBiYWxsRWxlbWVudCwgICAgICAgICAgICBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IoMywgLTMpIFxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnJpY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZihicmlja3NbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkb3VibGVicmljaycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgRG91YmxlQnJpY2soPEhUTUxFbGVtZW50PmJyaWNrc1tpXSkpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJyaWNrc1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ltbW9ydGFsJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBJbW1vcnRhbEJyaWNrKDxIVE1MRWxlbWVudD5icmlja3NbaV0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayg8SFRNTEVsZW1lbnQ+YnJpY2tzW2ldKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlV2FsbHModGhpcy5iYWxsLnJhZGl1cywgYm9hcmRFbGVtZW50Lm9mZnNldFdpZHRoLCBib2FyZEVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICB0aGlzLm5ld0dhbWUoKTtcblxuICAgICAgICB0aGlzLm5ld0dhbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLm5ld0dhbWUoKSk7XG4gICAgfSAgICBcblxuICAgIGNyZWF0ZVdhbGxzKHJhZGl1cyA6IG51bWJlciwgbWF4WCA6IG51bWJlciwgbWF4WSA6IG51bWJlcikge1xuICAgICAgICB0aGlzLndhbGxMZWZ0ID0gbmV3IE9ic3RhY2xlKC1yYWRpdXMsIC1yYWRpdXMsIDAsIG1heFkgKyByYWRpdXMpO1xuICAgICAgICB0aGlzLndhbGxUb3AgPSBuZXcgT2JzdGFjbGUoLXJhZGl1cywgLXJhZGl1cywgbWF4WCArIHJhZGl1cywgMCk7XG4gICAgICAgIHRoaXMud2FsbFJpZ2h0ID0gbmV3IE9ic3RhY2xlKG1heFgsIC1yYWRpdXMsIG1heFggKyByYWRpdXMsIG1heFkgKyByYWRpdXMpO1xuICAgICAgICB0aGlzLndhbGxCb3R0b20gPSBuZXcgT2JzdGFjbGUoLXJhZGl1cywgbWF4WSwgbWF4WCArIHJhZGl1cywgbWF4WSArIHJhZGl1cyk7ICAgICAgICBcbiAgICB9XG5cbiAgICBuZXdHYW1lKCkge1xuICAgICAgICB0aGlzLm5ld0dhbWVCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMubGl2ZXNMZWZ0ID0gMztcbiAgICAgICAgdGhpcy5saXZlc0xhYmVsLmlubmVyVGV4dCA9ICcnICsgdGhpcy5saXZlc0xlZnQ7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuaW5uZXJUZXh0ID0gJycgKyB0aGlzLnNjb3JlO1xuICAgICAgICB0aGlzLmJhbGwuc2hvdygpO1xuICAgICAgICB0aGlzLmJhbGwuYm91bmNlV2l0aEFuZ2xlKDYwKTtcbiAgICAgICAgdmFyIGJhbGxQb3NpdGlvbiA9IHRoaXMuYmFsbC5jbG9uZSgpO1xuICAgICAgICBiYWxsUG9zaXRpb24ubW92ZUNlbnRlclhUbyh0aGlzLnBhZGRsZS5jZW50ZXJYKCkpO1xuICAgICAgICBiYWxsUG9zaXRpb24ubW92ZUJvdHRvbVRvKHRoaXMucGFkZGxlLnRvcExlZnQueSAtIDQpO1xuICAgICAgICB0aGlzLmJhbGwubW92ZVRvKGJhbGxQb3NpdGlvbik7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLlJ1bm5pbmc7XG4gICAgfVxuXG4gICAgbG9zdExpdmUoKSB7XG4gICAgICAgIGlmICgtLXRoaXMubGl2ZXNMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmJhbGwuYm91bmNlV2l0aEFuZ2xlKDYwKTtcbiAgICAgICAgICAgIHZhciBiYWxsUG9zaXRpb24gPSB0aGlzLmJhbGwuY2xvbmUoKTtcbiAgICAgICAgICAgIGJhbGxQb3NpdGlvbi5tb3ZlQ2VudGVyWFRvKHRoaXMucGFkZGxlLmNlbnRlclgoKSk7XG4gICAgICAgICAgICBiYWxsUG9zaXRpb24ubW92ZUJvdHRvbVRvKHRoaXMucGFkZGxlLnRvcExlZnQueSAtIDQpO1xuICAgICAgICAgICAgdGhpcy5iYWxsLm1vdmVUbyhiYWxsUG9zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBHYW1lU3RhdGUuR2FtZU92ZXI7XG4gICAgICAgICAgICB0aGlzLmJhbGwuaGlkZSgpOyAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGl2ZXNMYWJlbC5pbm5lclRleHQgPSAnJyArIHRoaXMubGl2ZXNMZWZ0O1xuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4gdGhpcy5rZXlNYXBbZS5rZXlDb2RlXSA9IGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB0aGlzLmtleU1hcFtlLmtleUNvZGVdID0gdHJ1ZSk7XG5cbiAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lU3RhdGUgIT09IEdhbWVTdGF0ZS5SdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG5ld0JhbGxQb3NpdGlvbiA9IHRoaXMuYmFsbC5jYWxjdWxhdGVOZXdQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5rZXlNYXBbS2V5Q29kZXMuTEVGVF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZGRsZS5tb3ZlTGVmdCg1KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5rZXlNYXBbS2V5Q29kZXMuUklHSFRdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWRkbGUubW92ZVJpZ2h0KDUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy53YWxsQm90dG9tLmNoZWNrQ29sbGlzaW9uKG5ld0JhbGxQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvc3RMaXZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy53YWxsTGVmdC5jaGVja0NvbGxpc2lvbihuZXdCYWxsUG9zaXRpb24pIHx8IHRoaXMud2FsbFJpZ2h0LmNoZWNrQ29sbGlzaW9uKG5ld0JhbGxQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGwuYm91bmNlVmVydGljYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLndhbGxUb3AuY2hlY2tDb2xsaXNpb24obmV3QmFsbFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFsbC5ib3VuY2VIb3Jpem9udGFsKCk7XG4gICAgICAgICAgICB9ICAgICBcblxuICAgICAgICAgICAgZm9yIChsZXQgYnJpY2sgb2YgdGhpcy5icmlja3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgd2FzSGl0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGJyaWNrLmNoZWNrQ29sbGlzaW9uKG5ld0JhbGxQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAoU2lkZS5MZWZ0KTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAoU2lkZS5SaWdodCk6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGwuYm91bmNlVmVydGljYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhc0hpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIChTaWRlLlRvcCk6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgKFNpZGUuQm90dG9tKTogICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsLmJvdW5jZUhvcml6b250YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhc0hpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHdhc0hpdCkge1xuICAgICAgICAgICAgICAgICAgICBpZihicmljay53YXNIaXQoKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJpY2suaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJpY2sub25lTGlmZUxlZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29yZUxhYmVsLmlubmVyVGV4dCA9ICcnICsgdGhpcy5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5wYWRkbGUuY2hlY2tDb2xsaXNpb24obmV3QmFsbFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFsbC5ib3VuY2VXaXRoQW5nbGUodGhpcy5wYWRkbGUuY2FsY3VsYXRlSGl0QW5nbGUodGhpcy5iYWxsLmNlbnRlclgoKSwgdGhpcy5iYWxsLnJhZGl1cykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhbGwubW92ZVRvKHRoaXMuYmFsbC5jYWxjdWxhdGVOZXdQb3NpdGlvbigpKTtcbiAgICAgICB9LCB0aGlzLmxvb3BJbnRlcnZhbCkgXG4gICAgfVxufVxuXG5jb25zb2xlLmxvZygnSGVsbG8gZnJvbSBCcmlja0J1c3RlciAhISEnKTtcblxudmFyIGdhbWUgPSBuZXcgR2FtZShcbiAgICA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJhbGxcIilbMF0sXG4gICAgPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYWRkbGVcIilbMF0sXG4gICAgPEhUTUxDb2xsZWN0aW9uPmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJicmlja1wiKSxcbiAgICA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbWUtYm9hcmRcIilbMF0sXG4gICAgPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlcycpLFxuICAgIDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmUnKSxcbiAgICA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ld0dhbWUnKSAgICBcbik7XG5cbmdhbWUucnVuKCk7IiwiaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuL3ZlY3Rvcic7XHJcbmltcG9ydCB7IE9ic3RhY2xlIH0gZnJvbSAnLi9vYnN0YWNsZSc7XHJcbmltcG9ydCB7IFJlY3QgfSBmcm9tICcuL3JlY3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhbGwgZXh0ZW5kcyBTcHJpdGUge1xyXG5cclxuICAgIHJhZGl1cyA6IG51bWJlcjtcclxuICAgIGRpciAgOiBWZWN0b3I7XHJcbiAgICB2ZWxvY2l0eTogbnVtYmVyO1xyXG5cclxuICAgIHdhbGxMZWZ0IDogT2JzdGFjbGU7XHJcbiAgICB3YWxsVG9wOiBPYnN0YWNsZTtcclxuICAgIHdhbGxSaWdodDogT2JzdGFjbGU7XHJcbiAgICB3YWxsQm90dG9tOiBPYnN0YWNsZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzcHJpdGU6IEhUTUxFbGVtZW50LCBkaXIgOiBWZWN0b3IpIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShzcHJpdGUpWydib3JkZXItdG9wLWxlZnQtcmFkaXVzJ10pO1xyXG4gICAgICAgIHN1cGVyKHNwcml0ZSwgc3ByaXRlLm9mZnNldExlZnQsIHNwcml0ZS5vZmZzZXRUb3AsIHNwcml0ZS5vZmZzZXRMZWZ0ICsgMiAqIHJhZGl1cywgc3ByaXRlLm9mZnNldFRvcCArIDIgKiByYWRpdXMpO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSA1OyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5kaXIgPSBkaXI7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBjYWxjdWxhdGVOZXdQb3NpdGlvbigpIDogUmVjdCB7XHJcbiAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIG5ld1Bvc2l0aW9uLmFkZCh0aGlzLmRpcik7XHJcbiAgICAgICAgcmV0dXJuIG5ld1Bvc2l0aW9uOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgYm91bmNlSG9yaXpvbnRhbCgpIHtcclxuICAgICAgICB0aGlzLmRpci5mbGlwWSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGJvdW5jZVZlcnRpY2FsKCkge1xyXG4gICAgICAgIHRoaXMuZGlyLmZsaXBYKCk7XHJcbiAgICB9IFxyXG5cclxuICAgIGJvdW5jZVdpdGhBbmdsZShhbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgYW5nbGUgPSBhbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICB0aGlzLmRpci54ID0gTWF0aC5jb3MoYW5nbGUpICogdGhpcy52ZWxvY2l0eTtcclxuICAgICAgICB0aGlzLmRpci55ID0gLU1hdGguc2luKGFuZ2xlKSAqIHRoaXMudmVsb2NpdHk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuL3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJpY2sgZXh0ZW5kcyBTcHJpdGUge1xyXG4gICAgbGlmZUxlZnQ6IG51bWJlciA9IDE7XHJcbiAgICBvbmVMaWZlTGVmdCgpICB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuY2xhc3NMaXN0LnJlbW92ZSgnZG91YmxlYnJpY2snKTtcclxuICAgIH1cclxuICAgIHdhc0hpdCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gLS10aGlzLmxpZmVMZWZ0IDwgMTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERvdWJsZUJyaWNrIGV4dGVuZHMgQnJpY2sge1xyXG4gICAgbGlmZUxlZnQ6IG51bWJlciA9IDI7XHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEltbW9ydGFsQnJpY2sgZXh0ZW5kcyBEb3VibGVCcmljayB7XHJcbiAgICB3YXNIaXQgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFNpZGUge1xyXG4gICAgTm9uZSxcclxuICAgIExlZnQsXHJcbiAgICBUb3AsXHJcbiAgICBSaWdodCwgXHJcbiAgICBCb3R0b21cclxufVxyXG5cclxuZXhwb3J0IGVudW0gR2FtZVN0YXRlIHtcclxuICAgIFJ1bm5pbmcsXHJcbiAgICBHYW1lT3ZlclxyXG59XHJcblxyXG5leHBvcnQgZW51bSBLZXlDb2RlcyB7XHJcbiAgICBMRUZUID0gMzcsXHJcbiAgICBSSUdIVCA9IDM5XHJcbn0iLCJpbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi9yZWN0JztcclxuaW1wb3J0IHsgU2lkZSB9IGZyb20gJy4vZW51bXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9ic3RhY2xlIGV4dGVuZHMgUmVjdCB7XHJcbiAgICBjaGVja0NvbGxpc2lvbihhbm90aGVyUmVjdCA6IFJlY3QpIDogU2lkZSB7XHJcbiAgICAgICAgdmFyIHcgPSAwLjUgKiAodGhpcy53aWR0aCgpICsgYW5vdGhlclJlY3Qud2lkdGgoKSk7XHJcbiAgICAgICAgdmFyIGggPSAwLjUgKiAodGhpcy5oZWlnaHQoKSArIGFub3RoZXJSZWN0LmhlaWdodCgpKTtcclxuICAgICAgICB2YXIgZHggPSB0aGlzLmNlbnRlclgoKSAtIGFub3RoZXJSZWN0LmNlbnRlclgoKTtcclxuICAgICAgICB2YXIgZHkgPSB0aGlzLmNlbnRlclkoKSAtIGFub3RoZXJSZWN0LmNlbnRlclkoKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA8PSB3ICYmIE1hdGguYWJzKGR5KSA8PSBoKSB7XHJcbiAgICAgICAgICAgIHZhciB3eSA9IHcgKiBkeTtcclxuICAgICAgICAgICAgdmFyIGh4ID0gaCAqIGR4O1xyXG4gICAgICAgICAgICBpZiAod3kgPiBoeCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHd5ID4gLWh4ID8gU2lkZS5Ub3AgOiBTaWRlLkxlZnQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd3kgPiAtaHggPyBTaWRlLlJpZ2h0IDogU2lkZS5Cb3R0b207XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gU2lkZS5Ob25lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFNwcml0ZSB9IGZyb20gJy4vc3ByaXRlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYWRkbGUgZXh0ZW5kcyBTcHJpdGUge1xyXG4gICAgY29uc3RydWN0b3Ioc3ByaXRlOiBIVE1MRWxlbWVudCwgcHVibGljIG1heFJpZ2h0IDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoc3ByaXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTGVmdChzdGVwPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIG5ld1Bvc2l0aW9uLm1vdmVMZWZ0KHN0ZXApO1xyXG5cclxuICAgICAgICBpZiAobmV3UG9zaXRpb24udG9wTGVmdC54ID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlVG8obmV3UG9zaXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb3ZlUmlnaHQoc3RlcD8gOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgbmV3UG9zaXRpb24ubW92ZVJpZ2h0KHN0ZXApO1xyXG5cclxuICAgICAgICBpZiAobmV3UG9zaXRpb24uYm90dG9tUmlnaHQueCA8PSB0aGlzLm1heFJpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKG5ld1Bvc2l0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FsY3VsYXRlSGl0QW5nbGUoYmFsbFggOiBudW1iZXIsIGJhbGxSYWRpdXMgOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICAgICAgICB2YXIgaGl0U3BvdCA9IGJhbGxYIC0gdGhpcy50b3BMZWZ0Lng7XHJcbiAgICAgICAgdmFyIG1heFBhZGRsZSA9IHRoaXMud2lkdGgoKSArIGJhbGxSYWRpdXM7XHJcbiAgICAgICAgdmFyIG1pblBhZGRsZSA9IC1iYWxsUmFkaXVzO1xyXG4gICAgICAgIHZhciBwYWRkbGVSYW5nZSA9IG1heFBhZGRsZSAtIG1pblBhZGRsZTtcclxuXHJcbiAgICAgICAgdmFyIG1pbkFuZ2xlID0gMTYwO1xyXG4gICAgICAgIHZhciBtYXhBbmdsZSA9IDIwO1xyXG4gICAgICAgIHZhciBhbmdsZVJhbmdlID0gbWF4QW5nbGUgLSBtaW5BbmdsZTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoaGl0U3BvdCAqIGFuZ2xlUmFuZ2UpIC8gcGFkZGxlUmFuZ2UpICsgbWluQW5nbGU7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUG9pbnQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZChwb2ludDogUG9pbnQpIHtcclxuICAgICAgICB0aGlzLnggKz0gcG9pbnQueDtcclxuICAgICAgICB0aGlzLnkgKz0gcG9pbnQueTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVjdCB7XHJcbiAgICB0b3BMZWZ0IDogUG9pbnQ7XHJcbiAgICBib3R0b21SaWdodCA6IFBvaW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxlZnQgOiBudW1iZXIsIHRvcDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudG9wTGVmdCA9IG5ldyBQb2ludChsZWZ0LCB0b3ApO1xyXG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQgPSBuZXcgUG9pbnQocmlnaHQsIGJvdHRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUoKSA6IFJlY3Qge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVjdCh0aGlzLnRvcExlZnQueCwgdGhpcy50b3BMZWZ0LnksIHRoaXMuYm90dG9tUmlnaHQueCwgdGhpcy5ib3R0b21SaWdodC55KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGQocG9pbnQ6IFBvaW50KSB7XHJcbiAgICAgICAgdGhpcy50b3BMZWZ0LmFkZChwb2ludCk7XHJcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC5hZGQocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVUbyhyZWN0OiBSZWN0KSB7XHJcbiAgICAgICAgdGhpcy50b3BMZWZ0LnggPSByZWN0LnRvcExlZnQueDtcclxuICAgICAgICB0aGlzLnRvcExlZnQueSA9IHJlY3QudG9wTGVmdC55O1xyXG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueCA9IHJlY3QuYm90dG9tUmlnaHQueDtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnkgPSByZWN0LmJvdHRvbVJpZ2h0Lnk7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUNlbnRlclhUbyhjZW50ZXJYIDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGxlZnQgPSBjZW50ZXJYIC0gdGhpcy53aWR0aCgpIC8gMjtcclxuICAgICAgICB2YXIgcmlnaHQgPSBsZWZ0ICsgdGhpcy53aWR0aCgpO1xyXG4gICAgICAgIHRoaXMudG9wTGVmdC54ID0gbGVmdDtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnggPSByaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlQm90dG9tVG8oYm90dG9tOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnRvcExlZnQueSA9IGJvdHRvbSAtIHRoaXMuaGVpZ2h0KCk7XHJcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC55ID0gYm90dG9tOyBcclxuICAgIH1cclxuXHJcbiAgICB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3R0b21SaWdodC54IC0gdGhpcy50b3BMZWZ0Lng7XHJcbiAgICB9XHJcblxyXG4gICAgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvdHRvbVJpZ2h0LnkgLSB0aGlzLnRvcExlZnQueTtcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXJYKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy50b3BMZWZ0LnggKyB0aGlzLmJvdHRvbVJpZ2h0LngpIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy50b3BMZWZ0LnkgKyB0aGlzLmJvdHRvbVJpZ2h0LnkpIC8gMjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTGVmdChzdGVwOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnRvcExlZnQueCAtPSBzdGVwO1xyXG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueCAtPSBzdGVwO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVSaWdodChzdGVwOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnRvcExlZnQueCArPSBzdGVwO1xyXG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueCArPSBzdGVwO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT2JzdGFjbGUgfSBmcm9tICcuL29ic3RhY2xlJztcclxuaW1wb3J0IHsgU2lkZSB9IGZyb20gJy4vZW51bXMnO1xyXG5pbXBvcnQgeyBSZWN0IH0gZnJvbSAnLi9yZWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBTcHJpdGUgZXh0ZW5kcyBPYnN0YWNsZSB7XHJcbiAgICBzcHJpdGU6IEhUTUxFbGVtZW50O1xyXG4gICAgaXNWaXNpYmxlOiBCb29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNwcml0ZTogSFRNTEVsZW1lbnQsIGxlZnQ/IDogbnVtYmVyLCB0b3A/OiBudW1iZXIsIHJpZ2h0PzogbnVtYmVyLCBib3R0b20/OiBudW1iZXIpIHtcclxuICAgICAgICBib3R0b20gPSBib3R0b20gfHwgc3ByaXRlLm9mZnNldFRvcCArIHNwcml0ZS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgcmlnaHQgPSByaWdodCB8fCBzcHJpdGUub2Zmc2V0TGVmdCArIHNwcml0ZS5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0b3AgPSB0b3AgfHwgc3ByaXRlLm9mZnNldFRvcDtcclxuICAgICAgICBsZWZ0ID0gbGVmdCB8fCBzcHJpdGUub2Zmc2V0TGVmdDtcclxuXHJcbiAgICAgICAgc3VwZXIobGVmdCwgdG9wLCByaWdodCwgYm90dG9tKTtcclxuICAgICAgICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcclxuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVRvKHJlY3QgOiBSZWN0KSB7XHJcbiAgICAgICAgc3VwZXIubW92ZVRvKHJlY3QpO1xyXG5cclxuICAgICAgICBsZXQge3g6IHBvc1gsIHk6IHBvc1l9ID0gdGhpcy50b3BMZWZ0O1xyXG5cclxuXHQgICAgdGhpcy5zcHJpdGUuc3R5bGUubGVmdCA9IHBvc1ggKyAncHgnO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLnN0eWxlLnRvcCA9IHBvc1kgKyAncHgnOyAgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfSAgICBcclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuICAgIH0gICAgXHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oYW5vdGhlclJlY3QgOiBSZWN0KSA6IFNpZGUge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNpZGUuTm9uZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNoZWNrQ29sbGlzaW9uKGFub3RoZXJSZWN0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVjdG9yIGV4dGVuZHMgUG9pbnQge1xyXG4gICAgZmxpcFgoKSB7XHJcbiAgICAgICAgdGhpcy54ICo9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGZsaXBZKCkge1xyXG4gICAgICAgIHRoaXMueSAqPSAtMTtcclxuICAgIH1cclxufVxyXG4iXX0=
