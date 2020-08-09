﻿import { IAnimation } from './IAnimation';
import { ISpriteDataContainer } from './ISpriteDataContainer';

export class SpriteDataContainer implements ISpriteDataContainer
{
    private _animation: IAnimation;
    private _id: string;
    private _ink: number;
    private _member: string;
    private _hasDirections: boolean;
    private _hasStaticY: boolean;
    private _dx: number[];
    private _dy: number[];
    private _dz: number[];

    constructor(k: IAnimation, _arg_2: any)
    {
        this._animation     = k;
        this._id            = _arg_2.id;
        this._ink           = _arg_2.ink;
        this._member        = _arg_2.member;
        this._hasStaticY    = _arg_2.staticY ? true : false;
        this._hasDirections = _arg_2.directions ? true : false;
        this._dx            = [];
        this._dy            = [];
        this._dz            = [];

        const directions = _arg_2.directionList;

        if(directions && directions.length)
        {
            for(let direction of directions)
            {
                const id = direction.id;

                if(id === undefined) continue;

                this._dx[id] = (direction.dx || 0);
                this._dy[id] = (direction.dy || 0);
                this._dz[id] = (direction.dz || 0);
            }
        }
    }

    public _Str_809(k: number): number
    {
        if(k < this._dx.length) return this._dx[k]

        return 0;
    }

    public _Str_739(k: number): number
    {
        if(k < this._dy.length) return this._dy[k];

        return 0;
    }

    public _Str_839(k: number): number
    {
        if(k < this._dz.length) return this._dz[k];
        
        return 0;
    }

    public get animation(): IAnimation
    {
        return this._animation;
    }

    public get id(): string
    {
        return this._id;
    }

    public get ink(): number
    {
        return this._ink;
    }

    public get member(): string
    {
        return this._member;
    }

    public get _Str_949(): boolean
    {
        return this._hasDirections;
    }

    public get _Str_767(): boolean
    {
        return this._hasStaticY;
    }
}