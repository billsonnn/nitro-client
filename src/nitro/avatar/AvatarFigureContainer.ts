import { IDownloadable } from '../../core/asset/download/IDownloadable';
import { NitroConfiguration } from '../../NitroConfiguration';
import { Direction } from '../../room/utils/Direction';
import { NitroInstance } from '../NitroInstance';
import { RoomObjectModelKey } from '../room/object/RoomObjectModelKey';
import { AvatarManager } from './AvatarManager';
import * as DrawOrder from './draworder.json';
import { IFigurePart } from './structure/figure/interfaces/IFigurePart';

export class AvatarFigureContainer implements IDownloadable
{
    private _avatarManager: AvatarManager;

    private _figure: string;
    private _figureParts: IFigurePart[];
    private _figurePartsHidden: string[];
    private _figureColors: { [index: string]: { [index: string]: number } };

    private _handItem: IFigurePart;
    private _sign: IFigurePart;

    private _isDownloaded: boolean;

    constructor(manager: AvatarManager, figure: string)
    {
        this._avatarManager     = manager;

        this._figure            = figure || '';
        this._figureParts       = [];
        this._figurePartsHidden = [];
        this._figureColors      = {};

        this._handItem          = null;

        this._isDownloaded  = false;

        this.parseFigure(figure);
    }

    public dispose(): void
    {
        this._figure            = null;
        this._figureParts       = [];
        this._figurePartsHidden = [];
        this._figureColors      = {};
    }

    public setRightItem(itemType: number): void
    {
        if(!itemType)
        {
            if(this._handItem)
            {
                const index = this._figureParts.indexOf(this._handItem);

                if(index >= 0) this._figureParts.splice(index, 1);

                this._handItem = null;
            }

            return;
        }

        const part: IFigurePart = {
            id: itemType,
            type: 'ri',
            breed: 0,
            index: 0,
            colorLayerIndex: 0,
            paletteMapId: 0,
            library: 'hh_human_item'
        };

        this._figureParts.push(part);

        this._handItem = part;
    }

    public setLeftItem(itemType: number): void
    {
        if(itemType)
        {
            if(this._sign)
            {
                const index = this._figureParts.indexOf(this._sign);

                if(index >= 0) this._figureParts.splice(index, 1);

                this._sign = null;
            }

            return;
        }

        const part: IFigurePart = {
            id: itemType,
            type: 'li',
            breed: 0,
            index: 0,
            colorLayerIndex: 0,
            paletteMapId: 0,
            library: 'hh_human_item'
        };

        this._figureParts.push(part);

        this._sign = part;
    }

    private parseFigure(figure: string): void
    {
        if(!figure) return;

        const parts = figure.split('.');

        if(!parts) return;

        const pendingParts: IFigurePart[] = [];

        for(let part of parts)
        {
            const partData = part.split('-');

            if(!partData) continue;

            const partDataLength = partData.length;

            if(!partDataLength) continue;

            if(partDataLength < 2) continue;

            const type      = partData[0];
            const setId     = partData[1];
            const colors    = [];

            for(let i = 2; i < partDataLength; i++) colors.push(parseInt(partData[i]));

            const set = this._avatarManager.structure.getSet(type);

            if(!set) continue;

            const partSet = set.getPartSet(setId);

            if(!partSet) continue;

            const totalHiddenLayers = partSet.hiddenLayers.length;

            if(totalHiddenLayers)
            {
                for(let i = 0; i < totalHiddenLayers; i++)
                {
                    const hiddenLayer = partSet.hiddenLayers[i];

                    if(!hiddenLayer) continue;

                    if(this._figurePartsHidden.indexOf(hiddenLayer) === -1) this._figurePartsHidden.push(hiddenLayer);
                }
            }

            const totalParts = partSet.parts.length;

            if(!totalParts) continue;

            if(partSet.isColorable)
            {
                const palette = this._avatarManager.structure.getPalette(set.paletteId);

                if(palette)
                {
                    const totalColors = colors.length;

                    if(totalColors)
                    {
                        for(let i = 0; i < totalColors; i++)
                        {
                            const color = palette.getColor(colors[i]);

                            colors[i] = color ? color.color : 0xFFFFFF;
                        }
                    }
                }
            }

            for(let i = totalParts - 1; i >= 0; i--)
            {
                const part = partSet.parts[i];

                if(!part) continue;

                if(this._figurePartsHidden.indexOf(part.type) >= 0) continue;

                if(pendingParts.indexOf(part) >= 0) continue;

                if(!part.library)
                {
                    const partType = part.type === 'hrb' ? 'hr' : part.type;

                    let library = this._avatarManager.libraryManager.findLibrary(partType, part.id);

                    if(!library)
                    {
                        if(partType === 'ls' || partType === 'rs' || type === 'lc' || type === 'rc') library = 'hh_human_shirt';
                        else continue;
                    }

                    part.library = library;
                }

                if(this._figureColors[part.type] === undefined) this._figureColors[part.type] = {};

                this._figureColors[part.type][part.id.toString()] = colors[part.colorLayerIndex - 1] || 0xFFFFFF;

                pendingParts.push(part);
            }
        }

        const totalParts = pendingParts.length;

        if(!totalParts) return;

        for(let i = 0; i < totalParts; i++)
        {
            const part = pendingParts[i];

            if(!part) continue;

            if(this._figurePartsHidden.indexOf(part.type) >= 0) continue;

            this._figureParts.push(part);
        }
    }

    public getColorForPart(partId: number, partType: string): number
    {
        if(!partId || !partType) return 0xFFFFFF;

        const existing = this._figureColors[partType];

        if(existing)
        {
            const result = existing[partId.toString()];

            if(result) return result;
        }

        return 0xFFFFFF;
    }

    public download(cb: Function): void
    {
        if(!cb) return;

        if(this._isDownloaded) return cb(true);

        const partsToDownload: string[] = [];

        const totalParts = this._figureParts.length;

        if(!totalParts) return;

        for(let i = 0; i < totalParts; i++)
        {
            const part = this._figureParts[i];

            if(!part) continue;

            if(!part.library)
            {
                const library = this._avatarManager.libraryManager.findLibrary(part.type, part.id);

                if(!library) continue;

                part.library = library;
            }

            const asset = NitroInstance.instance.core.asset.getAsset(part.library);

            if(asset) continue;

            const path = NitroConfiguration.ASSET_URL + `/figure/${ part.library }/${ part.library }.json`;

            if(partsToDownload.indexOf(path) !== -1) continue;

            partsToDownload.push(path);
        }

        if(!partsToDownload.length) return this.onDownloaded(cb);

        NitroInstance.instance.core.asset.downloadAssets(partsToDownload, () => this.onDownloaded(cb));
    }

    public sortParts(action: string = 'std', direction: number = Direction.NORTH): void
    {
        //@ts-ignore
        const drawOrder = DrawOrder.default[action];

        if(!drawOrder)
        {
            if(action === RoomObjectModelKey.STD) return;

            return this.sortParts(RoomObjectModelKey.STD, direction);
        }

        const drawOrderDirection = drawOrder[direction.toString()] as string[];

        if(!drawOrderDirection)
        {
            if(direction < Direction.NORTH) direction = Direction.NORTH;

            if(action === RoomObjectModelKey.STD && direction === Direction.NORTH) return;

            return this.sortParts(RoomObjectModelKey.STD, direction);
        }

        const results: IFigurePart[] = [];

        const totalParts    = this._figureParts.length;
        const totalOrders   = drawOrderDirection.length;

        if(totalOrders)
        {
            for(let i = 0; i < totalOrders; i++)
            {
                const order = drawOrderDirection[i];

                if(!order) continue;

                for(let j = 0; j < totalParts; j++)
                {
                    const part = this._figureParts[j];

                    if(!part) continue;

                    if(part.type !== order) continue;

                    results.push(part);
                }
            }
        }

        if(!results.length) return;

        this._figureParts = results;
    }

    public onDownloaded(cb: Function): void
    {
        this._isDownloaded = true;

        return cb(true);
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get figureParts(): IFigurePart[]
    {
        return this._figureParts;
    }

    public get handItem(): IFigurePart
    {
        return this._handItem;
    }
}