import { WallRightTexture } from './WallRightTexture';

export class WallLeftTexture extends WallRightTexture
{
    public static TYPE: string = 'walll';

    protected static getColors(): [ number, number ]
    {
        const [ leftColor, rightColor ] = super.getColors();

        return [ rightColor, leftColor ];
    }
}