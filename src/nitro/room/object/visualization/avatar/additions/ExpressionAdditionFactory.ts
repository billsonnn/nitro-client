import { AvatarVisualization } from '../AvatarVisualization';
import { ExpressionAddition } from './ExpressionAddition';
import { FloatingHeart } from './FloatingHeart';
import { IExpressionAddition } from './IExpressionAddition';

export class ExpressionAdditionFactory
{
    public static WAVE: number  = 1;
    public static BLOW: number  = 2;
    public static LAUGH: number = 3;
    public static CRY: number   = 4;
    public static IDLE: number  = 5;

    public static getExpressionAddition(id: number, type: number, visualization: AvatarVisualization): IExpressionAddition
    {
        switch(type)
        {
            case this.BLOW: return new FloatingHeart(id, this.BLOW, visualization);
            default: return new ExpressionAddition(id, type, visualization);
        }
    }
}