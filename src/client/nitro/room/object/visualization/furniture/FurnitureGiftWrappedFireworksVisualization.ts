import { FurnitureFireworksVisualization } from './FurnitureFireworksVisualization';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { RoomObjectVariable } from '../../RoomObjectVariable';

export class FurnitureGiftWrappedFireworksVisualization extends FurnitureFireworksVisualization
{
    private static readonly PRESENT_DEFAULT_STATE:number = 0;
    private static readonly MAX_PACKET_TYPE_VALUE:number = 9;
    private static readonly MAX_RIBBON_TYPE_VALUE:number = 11;

    private _packetType:number = 0;
    private  _ribbonType:number = 0;

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean)
    {
        this._Str_16942();
        super.update(geometry, time, update, skipUpdate);
    }

    private _Str_16942(): void
    {
        if(!this.object) return;

        const local2 = this.object.model;
        if(!local2) return;

        const local3 = 1000;
        const local4 = <string>local2.getValue(RoomObjectVariable.FURNITURE_EXTRAS);

        const local5 = Number.parseInt(local4);
        const local6 = Math.floor((local5 / local3));
        const local7 = (local5 % local3);

        this._packetType = ((local6 > FurnitureGiftWrappedFireworksVisualization.MAX_PACKET_TYPE_VALUE) ? 0 : local6);
        this._ribbonType = ((local7 > FurnitureGiftWrappedFireworksVisualization.MAX_RIBBON_TYPE_VALUE) ? 0 : local7);
    }

    public getFrameNumber(scale: number, layerId: number): number
    {
        if(this._state == FurnitureGiftWrappedFireworksVisualization.PRESENT_DEFAULT_STATE)
        {
            if(layerId <= 1)
            {
                return this._packetType;
            }
            if(layerId == 2)
            {
                return this._ribbonType;
            }
        }
        return super.getFrameNumber(scale, layerId);
    }

    public  getSpriteAssetName(scale: number, layerId: number): string
    {
        const local3 = this.getValidSize(scale);
        let local4 = this._type;
        let local5 = '';

        if(layerId < (this.spriteCount -1))
        {
            local5 = String.fromCharCode(('a'.charCodeAt(0) + layerId));
        }
        else
        {
            local5 = 'sd';
        }

        const local6 = this.getFrameNumber(scale, layerId);
        local4 = (local4 + ((((('_' + local3) + '_') + local5) + '_') + this.direction));
        local4 = (local4 + ('_' + local6));
        return local4;

    }
}
