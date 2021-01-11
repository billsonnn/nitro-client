import { Component } from '@angular/core';
import { InfoStandPetData } from '../../data/InfoStandPetData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
	selector: 'nitro-room-infostand-pet-component',
    template: `
    <div class="nitro-room-infostand-pet-component">
        pet
    </div>`
})
export class RoomInfoStandPetComponent extends RoomInfoStandBaseComponent
{
    public petData: InfoStandPetData;

    public get type(): number
    {
        return InfoStandType.PET;
    }
}