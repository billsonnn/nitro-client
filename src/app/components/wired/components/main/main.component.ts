import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActionDefinition } from '../../../../../client/nitro/communication/messages/incoming/roomevents/ActionDefinition';
import { ConditionDefinition } from '../../../../../client/nitro/communication/messages/incoming/roomevents/ConditionDefinition';
import { Triggerable } from '../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { TriggerDefinition } from '../../../../../client/nitro/communication/messages/incoming/roomevents/TriggerDefinition';
import { UpdateActionMessageComposer } from '../../../../../client/nitro/communication/messages/outgoing/roomevents/UpdateActionMessageComposer';
import { UpdateConditionMessageComposer } from '../../../../../client/nitro/communication/messages/outgoing/roomevents/UpdateConditionMessageComposer';
import { UpdateTriggerMessageComposer } from '../../../../../client/nitro/communication/messages/outgoing/roomevents/UpdateTriggerMessageComposer';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { SettingsService } from '../../../../core/settings/service';
import { AlertService } from '../../../../shared/services/alert/service';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredService } from '../../services/wired.service';
import { WiredFurniture } from '../../WiredFurniture';
import { WiredSelectionVisualizer } from '../../WiredSelectionVisualizer';
import { WiredConditionFactory } from '../conditions/WiredConditionFactory';
import { WiredTriggerFactory } from '../triggers/WiredTriggerFactory';

@Component({
	selector: 'nitro-wired-component',
    templateUrl: './main.template.html'
})
export class WiredMainComponent implements OnInit, OnDestroy
{
    public static _Str_5431: number = 0;
    public static _Str_4873: number = 1;
    public static _Str_4991: number = 2;
    public static _Str_5430: number = 3;

    @ViewChild('inputsContainer', { read: ViewContainerRef })
    public inputsContainer: ViewContainerRef;
    
    private _triggerConfs: WiredTriggerFactory;
    //private _actionTypes: ActionTypes;
    private _conditionTypes: WiredConditionFactory;
    private _selectionVisualizer: WiredSelectionVisualizer;

    private _updated: Triggerable = null;
    private _lastComponent: ComponentRef<WiredFurniture> = null;
    private _furniSelectedIds: number[] = [];

    constructor(
        private _settingsService: SettingsService,
        private _alertService: AlertService,
        private _wiredService: WiredService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this._wiredService.component = this;

        this._triggerConfs          = new WiredTriggerFactory();
        //this._actionTypes           = new ActionTypes();
        this._conditionTypes        = new WiredConditionFactory();
        this._selectionVisualizer   = new WiredSelectionVisualizer(this);
    }

    public ngOnDestroy(): void
    {
        this._wiredService.component = null;
    }

    public setupTrigger(k: Triggerable): void
    {
        // this._Str_2755();

        this._updated = k;

        const wired = this._Str_3959();

        this._selectionVisualizer.clearSelectionShaderFromFurni(this._furniSelectedIds);

        this._furniSelectedIds = [ ...this._updated.selectedItems ];

        wired.onEditStart(this._updated);

        this._selectionVisualizer.applySelectionShaderToFurni(this._furniSelectedIds);

        if(this._updated instanceof ActionDefinition)
        {
        //     _local_5 = ActionDefinition(this._updated);
        //     _local_6 = _local_5._Str_25459;
        //     this._delaySlider._Str_2526(_local_6);
        }
    }

    public _Str_19071(): IUserDefinedRoomEventsCtrl
    {
        if(this._updated instanceof TriggerDefinition) return this._triggerConfs;

        //if(this._updated instanceof ActionDefinition) return this._actionTypes;

        if(this._updated instanceof ConditionDefinition) return this._conditionTypes;

        return null;
    }

    private _Str_3959(): WiredFurniture
    {
        const wiredType = this._Str_19071()._Str_15652(this._updated.code);

        if(!wiredType) return null;

        if(this._lastComponent && (this._lastComponent.instance instanceof wiredType)) return this._lastComponent.instance;

        if(this.inputsContainer.length) this.inputsContainer.remove();

        const factory = this._componentFactoryResolver.resolveComponentFactory(wiredType);

        let ref: ComponentRef<WiredFurniture> = null;

        if(factory)
        {
            ref = this.inputsContainer.createComponent(factory);
        }

        this._lastComponent = ref;

        if(ref)
        {
            ref.instance.onInitStart();

            return ref.instance;
        }

        return null;
    }

    public close(): void
    {
        if(this.inputsContainer.length) this.inputsContainer.remove();

        this._selectionVisualizer.clearSelectionShaderFromFurni(this._furniSelectedIds);

        this._updated           = null;
        this._lastComponent     = null;
        this._furniSelectedIds  = [];
    }

    public save(): void
    {
        if(!this.isOwnerOfFurniture(this._updated.id))
        {
            this._alertService.alert('${wiredfurni.nonowner.change.confirm.title}, ${wiredfurni.nonowner.change.confirm.body}');

            // then this.update();

            return;
        }

        this.update();
    }

    public update(): void
    {
        const wired = this._Str_3959();

        const _local_2 = wired.validate();

        if(_local_2)
        {
            this._alertService.alert('Update failed' + _local_2);
            
            return;
        }

        if(this._updated instanceof TriggerDefinition)
        {
            Nitro.instance.communication.connection.send(new UpdateTriggerMessageComposer(this._updated.id, this.readIntegerParams(), this.readStringParam(), this.readFurniSelectionIds(), this.readFurniSelectionCode()));

            return;
        }

        if(this._updated instanceof ActionDefinition)
        {
            Nitro.instance.communication.connection.send(new UpdateActionMessageComposer(this._updated.id, this.readIntegerParams(), this.readStringParam(), this.readFurniSelectionIds(), this.readFurniSelectionCode()));

            return;
        }

        if(this._updated instanceof ConditionDefinition)
        {
            Nitro.instance.communication.connection.send(new UpdateConditionMessageComposer(this._updated.id, this.readIntegerParams(), this.readStringParam(), this.readFurniSelectionIds(), this.readFurniSelectionCode()));

            return;
        }
    }

    private readIntegerParams(): number[]
    {
        const wired = this._Str_3959();

        if(wired)
        {
            return wired.readIntegerParamsFromForm();
        }

        return [];
    }

    private readStringParam(): string
    {
        const wired = this._Str_3959();

        if(wired)
        {
            return wired.readStringParamFromForm();
        }

        return '';
    }

    private readFurniSelectionIds(): number[]
    {
        return [ ...this._furniSelectedIds ];
    }

    private readFurniSelectionCode(): number
    {
        if(!this._updated._Str_21824) return 0;

        const wired = this._Str_3959();

        if(wired && ((wired.requiresFurni === WiredMainComponent._Str_4991) || (wired.requiresFurni === WiredMainComponent._Str_5430)))
        {
            return this._updated._Str_6040;
        }

        return 0;
    }

    public getFurniName(): string
    {
        let spriteId = ((this._updated && this._updated.spriteId) || -1);

        const furniData = Nitro.instance.sessionDataManager.getFloorItemData(spriteId);

        if(!furniData)
        {
            return ('NAME: ' + spriteId);
        }

        return furniData.name;
    }

    public getFurniDescription(): string
    {
        let spriteId = ((this._updated && this._updated.spriteId) || -1);

        const furniData = Nitro.instance.sessionDataManager.getFloorItemData(spriteId);

        if(!furniData)
        {
            return ('NAME: ' + spriteId);
        }

        return furniData.description;
    }

    public _Str_19885(): boolean
    {
        return (this._Str_3959().requiresFurni !== WiredMainComponent._Str_5431);
    }

    public toggleFurniSelected(furniId: number, type: string): void
    {
        if(!this._updated || !this._Str_19885()) return;

        const index = this._furniSelectedIds.indexOf(furniId);

        if(index >= 0)
        {
            this._furniSelectedIds.splice(index, 1);

            this._selectionVisualizer.hide(furniId);
        }
        else
        {
            if(this._furniSelectedIds.length < this._updated.maximumItemSelectionCount)
            {
                this._furniSelectedIds.push(furniId);

                this._selectionVisualizer.show(furniId);
            }
        }

        Nitro.instance.localization.registerParameter('wiredfurni.pickfurnis.caption', 'count', this._furniSelectedIds.length.toString());
    }

    private isOwnerOfFurniture(k: number): boolean
    {
        const roomObject = Nitro.instance.roomEngine.getRoomObject(this._wiredService.roomId, k, RoomObjectCategory.FLOOR);

        if(!roomObject) return false;

        const ownerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

        return (ownerId === Nitro.instance.sessionDataManager.userId);
    }

    public get roomId(): number
    {
        return this._wiredService.roomId;
    }

    public get furniSelectedIds(): number[]
    {
        return this._furniSelectedIds;
    }

    public get maximumItemSelectionCount(): number
    {
        return this._updated.maximumItemSelectionCount;
    }
}