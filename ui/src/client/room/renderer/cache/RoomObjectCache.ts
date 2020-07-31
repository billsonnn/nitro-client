import { RoomObjectSpriteData } from '../../data/RoomObjectSpriteData';
import { RoomObjectSpriteType } from '../../object/enum/RoomObjectSpriteType';
import { RoomObjectCacheItem } from './RoomObjectCacheItem';

export class RoomObjectCache 
{
    private static MAX_SIZE_FOR_AVG_COLOR: number = 200;

    private _data: Map<string, RoomObjectCacheItem>;
    private _roomObjectVariableAccurateZ: string;

    constructor(accurateZ: string)
    {
        this._data                          = new Map();
        this._roomObjectVariableAccurateZ   = accurateZ;
    }

    public dispose(): void
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

    public getObjectCache(k: string): RoomObjectCacheItem
    {
        let existing = this._data.get(k);

        if(!existing)
        {
            existing = new RoomObjectCacheItem(this._roomObjectVariableAccurateZ);

            this._data.set(k, existing);
        }

        return existing;
    }

    public removeObjectCache(k: string): void
    {
        const existing = this._data.get(k);

        if(!existing) return;

        this._data.delete(k);

        existing.dispose();
    }

    public getSortableSpriteList(): RoomObjectSpriteData[]
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
                    data.flipH      = sprite.sprite.flipH;
                    data.alpha      = sprite.sprite.alpha;
                    data.color      = sprite.sprite.color.toString();
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
}