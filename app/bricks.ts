import { Sprite } from './sprite';

export class Brick extends Sprite {
    lifeLeft: number = 1;
    oneLifeLeft()  {
        this.sprite.classList.remove('doublebrick');
    }
    wasHit(): boolean {
        return --this.lifeLeft < 1;
    }
}

export class DoubleBrick extends Brick {
    lifeLeft: number = 2;
    
}

export class ImmortalBrick extends DoubleBrick {
    wasHit (): boolean {
        return false;
    }
}