import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { IGetImageListener } from '../../../../client/nitro/room/IGetImageListener';
import { ImageResult } from '../../../../client/nitro/room/ImageResult';
import { IRoomEngine } from '../../../../client/nitro/room/IRoomEngine';
import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';
import { FurniCategory } from '../enum/FurniCategory';
import { InventoryFurniGridItemComponent } from '../furni/grid/griditem/component';
import { InventoryFurniService } from '../services/inventory.furni.service';
import { FurnitureItem } from './FurnitureItem';

export class GroupItem implements IGetImageListener
{
    private static INVENTORY_THUMB_XML: string = "inventory_thumb_xml";
    private static _Str_4072: number = 0xCCCCCC;
    private static _Str_4169: number = 10275685;

    private _Str_18094: number = 1;
    private _Str_18535: number = 0.2;

    private _inventoryService: InventoryFurniService;
    private _view: InventoryFurniGridItemComponent;
    private _type: number;
    private _category: number;
    private _roomEngine: IRoomEngine;
    private _stuffData: IObjectData;
    private _extra: number;
    private _isWallItem: boolean;
    private _iconUrl: string;
    private _name: string;
    private _description: string;
    private _unseeen: boolean;
    private _items: AdvancedMap<number, FurnitureItem>;

    constructor(inventoryService: InventoryFurniService, type: number, category: number, roomEngine: IRoomEngine, stuffData: IObjectData, extra: number)
    {
        this._inventoryService  = inventoryService;
        this._view              = null;
        this._type              = type;
        this._category          = category;
        this._roomEngine        = roomEngine;
        this._stuffData         = stuffData;
        this._extra             = extra;
        this._isWallItem        = false;
        this._iconUrl           = null;
        this._name              = null;
        this._description       = null;
        this._unseeen           = false;
        this._items             = new AdvancedMap();
    }

    public init(): void
    {
        this.setIcon();
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

    public push(k: FurnitureItem, _arg_2: boolean = false): void
    {
        const existing = this._items.getValue(k.id);

        if(!existing)
        {
            this._items.add(k.id, k);
        }
        else
        {
            existing.locked = false;
        }

        if(!this._name || !this._name.length) this.setName();

        if(!this._description || !this._description.length) this.setDescription();
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

    private setName(): void
    {
        this._name = '';
    }

    private setDescription(): void
    {
        this._description = '';
    }

    private setIcon(): void
    {
        if(this._iconUrl) return;

        let imageResult: ImageResult = null;

        if(this._isWallItem)
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

        if(this._view) this._view.markForCheck();
    }

    public imageReady(id: number, texture: PIXI.Texture, image: HTMLImageElement = null): void
    {
        if(id === -1) return;

        if(!image) return;

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

    public get unseen(): boolean
    {
        return this._unseeen;
    }

    public set unseen(flag: boolean)
    {
        this._unseeen = flag;
    }

    public get isWallItem(): boolean
    {
        return false;
    }

    public get isGroupable(): boolean
    {
        return true;
    }

    public get items(): AdvancedMap<number, FurnitureItem>
    {
        return this._items;
    }

    public get view(): InventoryFurniGridItemComponent
    {
        return this._view;
    }

    public set view(view: InventoryFurniGridItemComponent)
    {
        this._view = view;
    }
}