import { NitroConfiguration } from '../../NitroConfiguration';
import { Direction } from './Direction';

export class Position
{
    private _x: number;
    private _y: number;
    private _z: number;
    private _direction: number;
    private _depth: number;

    private _isScreen: boolean;

    constructor(x: number = 0, y: number = 0, z: number = 0, direction: number = Direction.NORTH, depth: number = 0)
    {
        this._x             = x || 0;
        this._y             = y || 0;
        this._z             = z || 0.00;
        this._direction     = parseInt(<any> direction);
        this._depth         = depth || this.calculatedDepth;

        this._isScreen      = false;
    }

    public copy(): Position
    {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    public toScreenPosition(): Position
    {
        const copy = this.copy();

        copy.x = this.calculateX;
        copy.y = this.calculateY + NitroConfiguration.TILE_HEIGHT - this.calculateZ;

        copy.isScreen = true;

        return copy;
    }

    public toPoint(): PIXI.Point
    {
        return new PIXI.Point(this._x, this._y);
    }
    
    public compare(position: Position): boolean
    {
        return position && this._x === position.x && this._y === position.y;
    }

    public compareStrict(position: Position): boolean
    {
        return position && position.x === this._x && position.y === this._y && position.z === this._z && position.direction === this._direction;
    }

    public get x(): number
    {
        return this._x;
    }

    public set x(x: number)
    {
        this._x = x || 0;
    }

    public get y(): number
    {
        return this._y;
    }

    public set y(y: number)
    {
        this._y = y || 0;
    }

    public get z(): number
    {
        return this._z;
    }

    public set z(z: number)
    {
        this._z = z || 0.00;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public set direction(direction: number)
    {
        this._direction = direction;
    }

    public get depth(): number
    {
        return this._depth;
    }

    public set depth(depth: number)
    {
        this._depth = depth;
    }

    public get calculatedDepth(): number
    {
        return (this._x + this._y) * 1000;
    }

    public get isScreen(): boolean
    {
        return this._isScreen;
    }

    public set isScreen(flag: boolean)
    {
        this._isScreen = flag;
    }

    public get calculateX(): number
    {
        return Position.calculateX(this._x, this._y);
    }

    public static calculateX(x: number, y: number): number
    {
        return (x * NitroConfiguration.TILE_WIDTH) - (y * NitroConfiguration.TILE_WIDTH);
    }

    public get calculateY(): number
    {
        return Position.calculateY(this._x, this._y);
    }

    public static calculateY(x: number, y: number): number
    {
        return (x * NitroConfiguration.TILE_HEIGHT) + (y * NitroConfiguration.TILE_HEIGHT);
    }

    public get calculateZ(): number
    {
        return Position.calculateZ(this._z);
    }

    public static calculateZ(z: number): number
    {
        return Math.floor((z * NitroConfiguration.Z_SCALE) * NitroConfiguration.TILE_HEIGHT);
    }

    public static wallToScreen(position: string): Position
    {
        if(!position) return null;

        const [ wall, local, direction ]    = position.split(' ');
        const [ wallX, wallY ]              = wall.substr(3).split(',').map(p => parseInt(p, 10));
        const [ localX, localY ]            = local.substr(2).split(',').map(p => parseInt(p, 10));

        const wallLocation = this.getWallLocation(wallX, wallY, localX, localY, direction);

        return wallLocation;
    }

    private static getWallLocation(wallX: number, wallY: number, localX: number, localY: number, direction: string): Position
    {
        const scale = 64;

        let x = wallX;
        let y = wallY;
        let z = 1;
        
        if(direction === 'r')
        {
            z -= (localY - (localX / 2)) / (scale / 2);

            x += (localX / ((scale / 2))) - 0.5;
            y += 0.5;
        }
        else
        {
            z -= (localY - (((scale / 2) - localX) / 2)) / (scale / 2);
            
            x += 0.5;
            y += ((((scale / 2) - localX) / (scale / 2)) - 0.5);
        }

        const position = new Position(x, y, z, direction === 'r' ? Direction.SOUTH : Direction.EAST);

        const wall = new Position(position.calculateX, position.calculateY, 0, direction === 'r' ? Direction.SOUTH : Direction.EAST);

        wall.y -= position.calculateZ;

        wall.isScreen = true;

        return wall;
    }
}