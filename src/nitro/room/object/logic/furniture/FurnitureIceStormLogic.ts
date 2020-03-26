import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { LegacyDataType } from '../../data/type/LegacyDataType';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureIceStormLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_ES;

    private _nextState: number;
    private _nextStateTimestamp: number;

    constructor()
    {
        super();

        this._nextState             = 0;
        this._nextStateTimestamp    = 0;
    }

    public update(totalTimeRunning: number): void
    {
        if((this._nextStateTimestamp > 0) && (totalTimeRunning >= this._nextStateTimestamp))
        {
            this._nextStateTimestamp = 0;

            const data = new LegacyDataType();

            data.setString(this._nextState.toString());

            super.processUpdateMessage(new ObjectDataUpdateMessage(this._nextState, data))
        }

        super.update(totalTimeRunning);
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(message instanceof ObjectDataUpdateMessage) return this.processUpdate(message);

        super.processUpdateMessage(message);
    }

    private processUpdate(message: ObjectDataUpdateMessage): void
    {
        if(!message) return;

        const state = message.state / 1000;
        const time  = message.state % 1000;

        if(!time)
        {
            this._nextStateTimestamp = 0;

            const data = new LegacyDataType();

            data.setString(state.toString());

            super.processUpdateMessage(new ObjectDataUpdateMessage(state, data))
        }
        else
        {
            this._nextState             = state;
            this._nextStateTimestamp    = this.time + time;
        }
    }
}