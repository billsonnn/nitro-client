import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { FurnitureAnimatedVisualization } from '../furniture/FurnitureAnimatedVisualization';
import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { PetVisualizationData } from './PetVisualizationData';

export class PetVisualization extends FurnitureAnimatedVisualization
{
    public static TYPE: string = ObjectVisualizationType.PET_ANIMATED;

    protected _data: PetVisualizationData;

    private _posture: string;
    private _gesture: string;
    private _isSleeping: boolean;
    private _headDirection: number;
    private _color: number;

    constructor()
    {
        super();

        this._data          = null;

        this._posture       = '';
        this._gesture       = '';
        this._isSleeping    = false;
        this._headDirection = -1;
        this._color         = 0xFFFFFF;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof PetVisualizationData)) return false;

        return super.initialize(data);
    }

    protected updateModel(): boolean
    {
        const model = this.object && this.object.model;

        if(!model) return false;

        if(this.updateModelCounter === model.updateCounter) return false;

        let posture = model.getValue(RoomObjectModelKey.FIGURE_POSTURE);
        let gesture = model.getValue(RoomObjectModelKey.FIGURE_GESTURE);

        const postureAnimation = this._data.postureToAnimation(posture);

        this.object.setState(postureAnimation);

        this._isSleeping = model.getValue(RoomObjectModelKey.FIGURE_SLEEP) > 0;

        const headDirection = model.getValue(RoomObjectModelKey.HEAD_DIRECTION);

        if(!isNaN(headDirection)) this._headDirection = headDirection;

        const color = model.getValue(RoomObjectModelKey.PET_COLOR);

        if(!isNaN(color) && this._color !== color) this._color = color;

        let alphaMultiplier = model.getValue(RoomObjectModelKey.FURNITURE_ALPHA_MULTIPLIER);

        if(isNaN(alphaMultiplier)) alphaMultiplier = 1;
        
        if(this._alphaMultiplier !== alphaMultiplier)
        {
            this._alphaMultiplier = alphaMultiplier;

            this._needsAlphaUpdate = true;
        }

        this.updateModelCounter = model.updateCounter;

        return true;
    }

    protected setPostureAndGesture(posture: string, gesture: string): void
    {
        if(posture !== this._posture)
        {
            this._posture = posture;
        }
    }

    protected getLayerColor(colorId: number, layerId: number): number
    {
        return this._color;
    }

    protected getAdditionalLayerCount(): number
    {
        return super.getAdditionalLayerCount();
    }
}