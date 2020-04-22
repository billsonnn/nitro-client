﻿export class AnimationItem 
{
    private _x: number = 0;
    private _y: number = 0;
    private _speedX: number = 0;
    private _speedY: number = 0;
    private _bitmapData: PIXI.Graphics;

    constructor(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: PIXI.Graphics)
    {
        this._x             = k;
        this._y             = _arg_2;
        this._speedX        = _arg_3;
        this._speedY        = _arg_4;
        this._bitmapData    = _arg_5;

        if(isNaN(this._x)) this._x = 0;

        if(isNaN(this._y)) this._y = 0;

        if(isNaN(this._speedX)) this._speedX = 0;

        if(isNaN(this._speedY)) this._speedY = 0;
    }

    public get bitmapData(): PIXI.Graphics
    {
        return this._bitmapData;
    }

    public dispose(): void
    {
        this._bitmapData = null;
    }

    public _Str_6729(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: number): PIXI.Point
    {
        let _local_6 = this._x;
        let _local_7 = this._y;

        if(_arg_3 > 0) _local_6 = (_local_6 + (((this._speedX / _arg_3) * _arg_5) / 1000));

        if(_arg_4 > 0) _local_7 = (_local_7 + (((this._speedY / _arg_4) * _arg_5) / 1000));

        const _local_8 = ((_local_6 % 1) * k);
        const _local_9 = ((_local_7 % 1) * _arg_2);

        return new PIXI.Point(_local_8, _local_9);
    }
}