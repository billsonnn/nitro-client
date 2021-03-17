import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { RoomObjectCategory } from 'nitro-renderer/src/nitro/room/object/RoomObjectCategory';
import { IRoomObject } from 'nitro-renderer/src/room/object/IRoomObject';
import { IRoomObjectSpriteVisualization } from 'nitro-renderer/src/room/object/visualization/IRoomObjectSpriteVisualization';
import { BLEND_MODES, Filter } from 'pixi.js';
import { WiredMainComponent } from './components/main/main.component';
import { WiredSelectionFilter } from './WiredSelectionFilter';

export class WiredSelectionVisualizer
{
    private _component: WiredMainComponent;
    private _selectionShader: Filter;

    constructor(component: WiredMainComponent)
    {
        this._component = component;

        const shader = new WiredSelectionFilter([ 1, 1, 1 ], [ 0.6, 0.6, 0.6 ]);

        this._selectionShader = shader;
    }

    public show(furniId: number): void
    {
        this.applySelectionShader(this.getRoomObject(furniId));
    }

    public hide(furniId: number): void
    {
        this.clearSelectionShader(this.getRoomObject(furniId));
    }

    public clearSelectionShaderFromFurni(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            this.clearSelectionShader(this.getRoomObject(furniId));
        }
    }

    public applySelectionShaderToFurni(furniIds: number[]): void
    {
        for(const furniId of furniIds)
        {
            this.applySelectionShader(this.getRoomObject(furniId));
        }
    }

    private getRoomObject(objectId: number): IRoomObject
    {
        if(!this._component) return null;

        return Nitro.instance.roomEngine.getRoomObject(this._component.roomId, objectId, RoomObjectCategory.FLOOR);
    }

    private applySelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites)
        {
            if(sprite.blendMode === BLEND_MODES.ADD) continue;

            sprite.filters = [ this._selectionShader ];
        }
    }

    private clearSelectionShader(roomObject: IRoomObject): void
    {
        if(!roomObject) return;

        const visualization = (roomObject.visualization as IRoomObjectSpriteVisualization);

        if(!visualization) return;

        for(const sprite of visualization.sprites)
        {
            sprite.filters = [];
        }
    }
}
