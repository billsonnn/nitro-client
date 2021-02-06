import { FurnitureVisualization } from './FurnitureVisualization';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';

export class FurnitureGiftWrappedVisualization extends FurnitureVisualization
{
    private _packetType: number = 0;
    private _ribbonType: number = 0;

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        this.setVisualization();
        super.update(geometry, time, update, skipUpdate);
    }

    private setVisualization(): void
    {
        if(!this.object) return;

        const local2 = this.object.model;
        const local3 = 1000;
        const local4 = <string>local2.getValue(RoomObjectVariable.FURNITURE_EXTRAS);
        const local5 = Number.parseInt(local4);

        this._packetType = Math.floor((local5 / local3));
        this._ribbonType = (local5 % local3);
    }

    public  getFrameNumber(scale: number, layerId: number): number
    {
        if(layerId <= 1)
        {
            return this._packetType;
        }
        return this._ribbonType;
    }

    public  getSpriteAssetName(scale: number, layerId: number): string
    {
        const local3 = this.getValidSize(scale);
        let local4 = this._type;
        let local5 = '';

        if(layerId < (this.spriteCount - 1))
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
