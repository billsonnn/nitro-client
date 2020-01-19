﻿import { NitroConfiguration } from '../../NitroConfiguration';
import { IVector3D } from './IVector3D';

export class Vector3d implements IVector3D 
{
    private _x: number;
    private _y: number;
    private _z: number;
    private _length: number;

    private _isScreen: boolean;

    constructor(x: number = 0, y: number = 0, z: number = 0, isScreen: boolean = false)
    {
        this._x         = x;
        this._y         = y;
        this._z         = z;
        this._length    = NaN;

        this._isScreen = isScreen;
    }

    public static compare(vector1: IVector3D, vector2: IVector3D): boolean
    {
        if(!vector1 || !vector2) return false;

        if((vector1.x !== vector2.x) || (vector1.y !== vector2.y) || (vector1.z !== vector2.z)) return false;

        return true;
    }

    public toScreen(): IVector3D
    {
        const vector = new Vector3d();

        const z = Math.floor((this._z * NitroConfiguration.Z_SCALE) * NitroConfiguration.TILE_HEIGHT);

        vector.x = ((this._x * NitroConfiguration.TILE_WIDTH) - (this._y * NitroConfiguration.TILE_WIDTH));
        vector.y = ((this._x * NitroConfiguration.TILE_HEIGHT) + (this._y * NitroConfiguration.TILE_HEIGHT)) - z;
        vector.z = 0;

        return vector;
    }

    public add(vector: IVector3D): void
    {
        if(!vector) return;

        this._x        += vector.x;
        this._y        += vector.y;
        this._z        += vector.z;
        this._length    = NaN;
    }

    public subtract(vector: IVector3D): void
    {
        if(!vector) return;

        this._x        -= vector.x;
        this._y        -= vector.y;
        this._z        -= vector.z;
        this._length    = NaN;
    }

    public multiply(amount: number): void
    {
        this._x        *= amount;
        this._y        *= amount;
        this._z        *= amount;
        this._length    = NaN;
    }

    public set(vector: IVector3D): void
    {
        if(!vector) return;

        this._x         = vector.x;
        this._y         = vector.y;
        this._z         = vector.z;
        this._length    = NaN;
    }

    public get x(): number
    {
        return this._x;
    }

    public set x(k: number)
    {
        this._x         = k;
        this._length    = NaN;
    }

    public get y(): number
    {
        return this._y;
    }

    public set y(k: number)
    {
        this._y         = k;
        this._length    = NaN;
    }

    public get z(): number
    {
        return this._z;
    }

    public set z(k: number)
    {
        this._z         = k;
        this._length    = NaN;
    }

    public get length(): number
    {
        if(isNaN(this._length))
        {
            this._length = Math.sqrt(((this._x * this._x) + (this._y * this._y)) + (this._z * this._z));
        }

        return this._length;
    }

    public get isScreen(): boolean
    {
        return this._isScreen;
    }

    public set isScreen(flag: boolean)
    {
        this._isScreen = flag;
    }
}