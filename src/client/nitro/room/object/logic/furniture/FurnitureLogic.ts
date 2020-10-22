import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../../../../../room/object/IRoomObjectController';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { IVector3D } from '../../../../../room/utils/IVector3D';
import { Vector3d } from '../../../../../room/utils/Vector3d';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectStateChangedEvent } from '../../../events/RoomObjectStateChangedEvent';
import { RoomObjectWidgetRequestEvent } from '../../../events/RoomObjectWidgetRequestEvent';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { ObjectHeightUpdateMessage } from '../../../messages/ObjectHeightUpdateMessage';
import { ObjectItemDataUpdateMessage } from '../../../messages/ObjectItemDataUpdateMessage';
import { ObjectMoveUpdateMessage } from '../../../messages/ObjectMoveUpdateMessage';
import { ObjectSelectedMessage } from '../../../messages/ObjectSelectedMessage';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class FurnitureLogic extends MovingObjectLogic
{
    private static BOUNCING_STEPS: number   = 8;
    private static BOUNCING_Z: number       = 0.0625;

    private _sizeX: number;
    private _sizeY: number;
    private _sizeZ: number;
    private _centerX: number;
    private _centerY: number;
    private _centerZ: number;

    private _directions: number[];

    private _mouseOver: boolean;

    private _locationOffset: IVector3D;
    private _bouncingStep: number;
    private _storedRotateMessage: RoomObjectUpdateMessage;
    private _directionInitialized: boolean;

    constructor()
    {
        super();

        this._sizeX                 = 0;
        this._sizeY                 = 0;
        this._sizeZ                 = 0;
        this._centerX               = 0;
        this._centerY               = 0;
        this._centerZ               = 0;

        this._directions            = [];

        this._mouseOver             = false;

        this._locationOffset        = new Vector3d();
        this._bouncingStep          = 0;
        this._storedRotateMessage   = null;
        this._directionInitialized  = false;
    }

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectStateChangedEvent.STATE_CHANGE, RoomObjectMouseEvent.CLICK, RoomObjectMouseEvent.MOUSE_DOWN ];

        if(this.widget) types.push(RoomObjectWidgetRequestEvent.OPEN_WIDGET, RoomObjectWidgetRequestEvent.CLOSE_WIDGET);

        if(this.contextMenu) types.push(RoomObjectWidgetRequestEvent.OPEN_FURNI_CONTEXT_MENU, RoomObjectWidgetRequestEvent.CLOSE_FURNI_CONTEXT_MENU);

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public initialize(asset: IAssetData): void
    {
        if(!asset) return;

        const model = this.object && this.object.model;

        if(!model) return;

        const dimensions = asset.dimensions;

        if(!dimensions) return;

        this._sizeX = dimensions.x;
        this._sizeY = dimensions.y;
        this._sizeZ = dimensions.z;
        
        this._centerX   = (this._sizeX / 2);
        this._centerY   = (this._sizeY / 2);
        this._centerZ   = (this._sizeZ / 2);

        const directions = asset.directions;

        if(directions && directions.length)
        {
            for(let direction of directions) this._directions.push(direction);

            this._directions.sort((a, b) => { return a - b });
        }

        model.setValue(RoomObjectVariable.FURNITURE_SIZE_X, this._sizeX);
        model.setValue(RoomObjectVariable.FURNITURE_SIZE_Y, this._sizeY);
        model.setValue(RoomObjectVariable.FURNITURE_SIZE_Z, this._sizeZ);
        model.setValue(RoomObjectVariable.FURNITURE_CENTER_X, this._centerX);
        model.setValue(RoomObjectVariable.FURNITURE_CENTER_Y, this._centerY);
        model.setValue(RoomObjectVariable.FURNITURE_CENTER_Z, this._centerZ);
        model.setValue(RoomObjectVariable.FURNITURE_ALLOWED_DIRECTIONS, this._directions);
        model.setValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER, 1);
    }

    public dispose(): void
    {
        super.dispose();

        this._storedRotateMessage   = null;
        this._directions            = null;
    }

    public setObject(object: IRoomObjectController): void
    {
        super.setObject(object);

        if(object && object.getLocation().length) this._directionInitialized = true;
    }

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return model.getValue<string>(RoomObjectVariable.FURNITURE_AD_URL);
    }

    public update(time: number): void
    {
        super.update(time);

        if(this._bouncingStep > 0)
        {
            this._bouncingStep++;

            if(this._bouncingStep > FurnitureLogic.BOUNCING_STEPS) this._bouncingStep = 0;
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(message instanceof ObjectDataUpdateMessage)
        {
            this.processDataUpdateMessage(message);

            return;
        }

        if(message instanceof ObjectHeightUpdateMessage)
        {
            this.processObjectHeightUpdateMessage(message);

            return;
        }

        if(message instanceof ObjectItemDataUpdateMessage)
        {
            this.processItemDataUpdateMessage(message);

            return;
        }

        this._mouseOver = false;

        if(message.location && message.direction)
        {
            if(!(message instanceof ObjectMoveUpdateMessage))
            {
                const direction = this.object.getDirection();
                const location  = this.object.getLocation();

                if((direction.x !== message.direction.x) && this._directionInitialized)
                {
                    if((location.x === message.location.x) && (location.y === message.location.y) && (location.z === message.location.z))
                    {
                        this._bouncingStep          = 1;
                        this._storedRotateMessage   = new RoomObjectUpdateMessage(message.location, message.direction);

                        message = null;
                    }
                }
            }

            this._directionInitialized = true;
        }

        if(message instanceof ObjectSelectedMessage)
        {
            if(this.contextMenu && this.eventDispatcher && this.object)
            {
                const eventType = (message.selected) ? RoomObjectWidgetRequestEvent.OPEN_FURNI_CONTEXT_MENU : RoomObjectWidgetRequestEvent.CLOSE_FURNI_CONTEXT_MENU;

                this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(eventType, this.object));
            }
        }

        super.processUpdateMessage(message);
    }

    private processDataUpdateMessage(message: ObjectDataUpdateMessage): void
    {
        if(!message) return;

        this.object.setState(message.state, 0);
        
        if(message.data) message.data.writeRoomObjectModel(this.object.model);

        this.object.model.setValue(RoomObjectVariable.FURNITURE_EXTRAS, message.extra);
        this.object.model.setValue(RoomObjectVariable.FURNITURE_STATE_UPDATE_TIME, this.lastUpdateTime);
    }

    private processObjectHeightUpdateMessage(message: ObjectHeightUpdateMessage): void
    {
        if(!message) return;
        
        this.object.model.setValue(RoomObjectVariable.FURNITURE_SIZE_Z, message.height);
    }

    private processItemDataUpdateMessage(message: ObjectItemDataUpdateMessage): void
    {
        if(!message) return;

        this.object.model.setValue(RoomObjectVariable.FURNITURE_ITEMDATA, message.data);
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        const adUrl = this.getAdClickUrl(this.object.model);

        switch(event.type)
        {
            case MouseEventType.MOUSE_MOVE:
                if(this.eventDispatcher)
                {
                    const mouseEvent = new RoomObjectMouseEvent(RoomObjectMouseEvent.MOUSE_MOVE, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown);

                    mouseEvent.localX           = event.localX;
                    mouseEvent.localY           = event.localY;
                    mouseEvent.spriteOffsetX    = event.spriteOffsetX;
                    mouseEvent.spriteOffsetY    = event.spriteOffsetY;

                    this.eventDispatcher.dispatchEvent(mouseEvent);
                }
                return;
            case MouseEventType.ROLL_OVER:
                if(!this._mouseOver)
                {
                    if(this.eventDispatcher)
                    {
                        const mouseEvent = new RoomObjectMouseEvent(RoomObjectMouseEvent.MOUSE_ENTER, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown);

                        mouseEvent.localX           = event.localX;
                        mouseEvent.localY           = event.localY;
                        mouseEvent.spriteOffsetX    = event.spriteOffsetX;
                        mouseEvent.spriteOffsetY    = event.spriteOffsetY;

                        this.eventDispatcher.dispatchEvent(mouseEvent);
                    }

                    this._mouseOver = true;
                }
                return;
            case MouseEventType.ROLL_OUT:
                if(this._mouseOver)
                {
                    if(this.eventDispatcher)
                    {
                        const mouseEvent = new RoomObjectMouseEvent(RoomObjectMouseEvent.MOUSE_LEAVE, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown);

                        mouseEvent.localX           = event.localX;
                        mouseEvent.localY           = event.localY;
                        mouseEvent.spriteOffsetX    = event.spriteOffsetX;
                        mouseEvent.spriteOffsetY    = event.spriteOffsetY;

                        this.eventDispatcher.dispatchEvent(mouseEvent);
                    }

                    this._mouseOver = false;
                }
                return;
            case MouseEventType.DOUBLE_CLICK:
                this.useObject();
                return;
            case MouseEventType.MOUSE_CLICK:
                if(this.eventDispatcher)
                {
                    const mouseEvent = new RoomObjectMouseEvent(RoomObjectMouseEvent.CLICK, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown);

                    mouseEvent.localX           = event.localX;
                    mouseEvent.localY           = event.localY;
                    mouseEvent.spriteOffsetX    = event.spriteOffsetX;
                    mouseEvent.spriteOffsetY    = event.spriteOffsetY;

                    this.eventDispatcher.dispatchEvent(mouseEvent);
                }

                if(this.eventDispatcher && this.object && this.contextMenu)
                {
                    this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.OPEN_FURNI_CONTEXT_MENU, this.object));
                }
                return;
            case MouseEventType.MOUSE_DOWN:
                if(this.eventDispatcher)
                {
                    const mouseEvent = new RoomObjectMouseEvent(RoomObjectMouseEvent.MOUSE_DOWN, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown);

                    this.eventDispatcher.dispatchEvent(mouseEvent);
                }
                return;
        }
    }

    protected getLocationOffset(): IVector3D
    {
        if(this._bouncingStep <= 0) return null;

        this._locationOffset.x  = 0;
        this._locationOffset.y  = 0;

        if(this._bouncingStep <= (FurnitureLogic.BOUNCING_STEPS / 2))
        {
            this._locationOffset.z = FurnitureLogic.BOUNCING_Z * this._bouncingStep;
        }
        else
        {
            if(this._bouncingStep <= FurnitureLogic.BOUNCING_STEPS)
            {
                if(this._storedRotateMessage)
                {
                    super.processUpdateMessage(this._storedRotateMessage);

                    this._storedRotateMessage = null;
                }

                this._locationOffset.z = FurnitureLogic.BOUNCING_Z * (FurnitureLogic.BOUNCING_STEPS - this._bouncingStep);
            }
        }

        return this._locationOffset;
    }

    public useObject(): void
    {
        if(!this.object) return;

        const adUrl = this.getAdClickUrl(this.object.model);

        if(this.eventDispatcher)
        {
            if(this.widget) this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.OPEN_WIDGET, this.object));
            
            this.eventDispatcher.dispatchEvent(new RoomObjectStateChangedEvent(RoomObjectStateChangedEvent.STATE_CHANGE, this.object));
        }
    }

    public tearDown(): void
    {
        if(this.widget && (this.object.model.getValue(RoomObjectVariable.FURNITURE_REAL_ROOM_OBJECT) === 1))
        {
            this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.CLOSE_WIDGET, this.object));
        }
        
        super.tearDown();
    }
}