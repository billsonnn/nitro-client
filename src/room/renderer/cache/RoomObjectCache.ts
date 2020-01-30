import { RoomObjectSpriteData } from '../../data/RoomObjectSpriteData';
import { RoomObjectSpriteType } from '../../object/enum/RoomObjectSpriteType';
import { RoomObjectCacheItem } from './RoomObjectCacheItem';

export class RoomObjectCache 
{
    private static _Str_14703: number = 200;

    private _data: Map<string, RoomObjectCacheItem>;
    private _roomObjectVariableAccurateZ: string;

    constructor(accurateZ: string)
    {
        this._data                          = new Map();
        this._roomObjectVariableAccurateZ   = accurateZ;
    }

    public dispose():void
    {
        if(this._data)
        {
            for(let [ key, item ] of this._data.entries())
            {
                if(!item) continue;

                this._data.delete(key);

                item.dispose();
            }

            this._data = null;
        }
    }

    public _Str_23830(k: string): RoomObjectCacheItem
    {
        let existing = this._data.get(k);

        if(!existing)
        {
            existing = new RoomObjectCacheItem(this._roomObjectVariableAccurateZ);

            this._data.set(k, existing);
        }

        return existing;
    }

    public _Str_18669(k: string): void
    {
        const existing = this._data.get(k);

        if(!existing) return;

        this._data.delete(k);

        existing.dispose();
    }

    public _Str_15625(): RoomObjectSpriteData[]
    {
        const spriteData: RoomObjectSpriteData[] = [];

        for(let item of this._data.values())
        {
            if(!item) continue;

            const sprites = item.sprites && item.sprites._Str_9272;

            if(!sprites || !sprites.length) continue;

            for(let sprite of sprites)
            {
                if(!sprite) continue;

                if((sprite.sprite.spriteType !== RoomObjectSpriteType._Str_8616) && (sprite.sprite.name !== ''))
                {
                    const data = new RoomObjectSpriteData();

                    data._Str_1577 = item._Str_1577;
                    data.x          = sprite.x;
                    data.y          = sprite.y;
                    data.z          = sprite.z;
                    data.name       = sprite.name || '';
                    //data.flipH      = sprite.sprite.scale.x === -1;
                    data.alpha      = sprite.sprite.alpha;
                    //data.color      = sprite.sprite.tint.toString();
                    data.blendMode  = sprite.sprite.blendMode.toString();
                    data.width      = sprite.sprite.width;
                    data.height     = sprite.sprite.height;
                    
                    spriteData.push(data);
                }
            }
        }

        if(!spriteData || !spriteData.length) return null;

        return spriteData;
    }

    // public _Str_14588(): SortableSprite[]
    // {
    //     const sprites: SortableSprite[] = [];

    //     for(let item of this._data.values())
    //     {
    //         if(!item) continue;

    //         for(let sprite of item._Str_9272._Str_9272)
    //         {
    //             if(!sprite) continue;

    //             if((sprite.sprite.type !== RoomObjectSpriteType._Str_8616)) continue;

    //             sprites.push(sprite);
    //         }
    //     }

    //     if(!sprites || !sprites.length) return null;

    //     return sprites;
    // }
}