import { Texture } from 'pixi.js';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { Nitro } from '../../../../client/nitro/Nitro';
import { IGetImageListener } from '../../../../client/nitro/room/IGetImageListener';
import { ImageResult } from '../../../../client/nitro/room/ImageResult';
import { IRoomEngine } from '../../../../client/nitro/room/IRoomEngine';
import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';
import { FurniCategory } from './FurniCategory';
import { FurnitureItem } from './FurnitureItem';

export class GroupItem implements IGetImageListener
{
    private static INVENTORY_THUMB_XML: string = 'inventory_thumb_xml';
    private static _Str_4072: number = 0xCCCCCC;
    private static _Str_4169: number = 10275685;

    private _Str_18094: number = 1;
    private _Str_18535: number = 0.2;

    private _type: number;
    private _category: number;
    private _roomEngine: IRoomEngine;
    private _stuffData: IObjectData;
    private _extra: number;
    private _isWallItem: boolean;
    private _iconUrl: string;
    private _name: string;
    private _description: string;
    private _locked: boolean;
    private _selected: boolean;
    private _hasUnseenItems: boolean;
    private _items: AdvancedMap<number, FurnitureItem>;

    constructor(type: number, category: number, roomEngine: IRoomEngine, stuffData: IObjectData, extra: number)
    {
        this._type              = type;
        this._category          = category;
        this._roomEngine        = roomEngine;
        this._stuffData         = stuffData;
        this._extra             = extra;
        this._isWallItem        = false;
        this._iconUrl           = null;
        this._name              = null;
        this._description       = null;
        this._locked            = false;
        this._selected          = false;
        this._hasUnseenItems    = false;
        this._items             = new AdvancedMap();
    }

    public prepareGroup(): void
    {
        this.setIcon();
        this.setName();
        this.setDescription();
    }

    public dispose(): void
    {
        
    }

    public getItemByIndex(index: number): FurnitureItem
    {
        return this._items.getWithIndex(index);
    }

    public getItemById(id: number): FurnitureItem
    {
        return this._items.getValue(id);
    }

    public push(item: FurnitureItem, unseen: boolean = false): void
    {
        const existing = this._items.getValue(item.id);

        if(!existing)
        {
            this._items.add(item.id, item);
        }
        else
        {
            existing.locked = false;
        }

        if(this._items.length === 1) this.prepareGroup();
    }

    public pop(): FurnitureItem
    {
        let item: FurnitureItem = null;

        if(this._items.length > 0)
        {
            item = this._items.getWithIndex((this._items.length - 1));

            this._items.remove(item.id);
        }

        return item;
    }

    public remove(k: number): FurnitureItem
    {
        const item = this._items.getValue(k);

        if(item)
        {
            this._items.remove(k);

            return item;
        }

        return null;
    }

    public getTotalCount(): number
    {
        var k: number = 0;

        if(this._category === FurniCategory._Str_12351)
        {
            let count   = 0;
            let i       = 0;
            
            while(i < this._items.length)
            {
                const item = this._items.getWithIndex(i);
                
                count = (count + parseInt(item.stuffData.getLegacyString()));

                i++;
            }

            return count;
        }

        return this._items.length;
    }

    public getUnlockedCount(): number
    {
        if(this.category === FurniCategory._Str_12351) return this.getTotalCount();

        let count = 0;

        let i = 0;

        while(i < this._items.length)
        {
            const item = this._items.getWithIndex(i);

            if(!item.locked) count++;

            i++;
        }

        return count;
    }

    public getLastItem(): FurnitureItem
    {
        if(!this._items.length) return null;

        const item = this._items.getWithIndex((this._items.length - 1));

        return item;
    }

    public unlockAllItems(): void
    {
        let didUnlock = false;

        if(this._items.length)
        {
            for(let item of this._items.getValues())
            {
                if(item && item.locked)
                {
                    item.locked = false;
                }
            }
        }
    }

    private setName(): void
    {
        const k = this.getLastItem();

        if(!k)
        {
            this._name = '';

            return;
        }

        let key = '';
        
        switch (this._category)
        {
            case FurniCategory._Str_5186:
                key = (('poster_' + k.stuffData.getLegacyString()) + '_name');
                break;
            case FurniCategory._Str_9125:
                this._name = 'SONG_NAME';
                return;
            default:
                if(this.isWallItem)
                {
                    key = ('wallItem.name.' + k.type);
                }
                else
                {
                    key = ('roomItem.name.' + k.type);
                }
        }

        this._name = Nitro.instance.getLocalization(key);
    }

    private setDescription(): void
    {
        this._description = '';
    }

    private setIcon(): void
    {
        if(this._iconUrl) return;

        let imageResult: ImageResult = null;

        if(this.isWallItem)
        {
            imageResult = this._roomEngine.getFurnitureWallIcon(this._type, this, this._stuffData.getLegacyString());
        }
        else
        {
            imageResult = this._roomEngine.getFurnitureFloorIcon(this._type, this, (this._extra.toString()), this._stuffData);
        }

        if(imageResult.image || imageResult.data)
        {
            if(!imageResult.image)
            {
                this.setIconUrl(imageResult.getImage().src);
            }
            else
            {
                this.setIconUrl(imageResult.image.src);
            }
        }
    }

    private setIconUrl(url: string): void
    {
        if(!url) return;
        
        this._iconUrl = url;
    }

    public imageReady(id: number, texture: Texture, image: HTMLImageElement = null): void
    {
        if((id === -1) || !image) return;

        const url = image.src;

        if((this._iconUrl && this._iconUrl.length) && (url === this._iconUrl)) return;

        this.setIconUrl(image.src);
    }

    public imageFailed(id: number): void
    {
        
    }

    public get type(): number
    {
        return this._type;
    }

    public get category(): number
    {
        return this._category;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public get extra(): number
    {
        return this._extra;
    }

    public get iconUrl(): string
    {
        return this._iconUrl;
    }

    public get name(): string
    {
        return this._name;
    }

    public get description(): string
    {
        return this._description;
    }

    public get hasUnseenItems(): boolean
    {
        return this._hasUnseenItems;
    }

    public set hasUnseenItems(flag: boolean)
    {
        this._hasUnseenItems = flag;
    }

    public get locked(): boolean
    {
        return this._locked;
    }

    public set locked(flag: boolean)
    {
        this._locked = flag;
    }

    public get selected(): boolean
    {
        return this._selected;
    }

    public set selected(flag: boolean)
    {
        this._selected = flag;
    }

    public get isWallItem(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.isWallItem : false);
    }

    public get isGroupable(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.isGroupable : false);
    }

    public get items(): AdvancedMap<number, FurnitureItem>
    {
        return this._items;
    }
}