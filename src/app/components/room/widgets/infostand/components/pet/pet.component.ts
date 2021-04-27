import { Component } from '@angular/core';
import { InfoStandPetData } from '../../data/InfoStandPetData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';
import { Nitro } from '../../../../../../../client/nitro/Nitro';

@Component({
    templateUrl: './pet.template.html'
})
export class RoomInfoStandPetComponent extends RoomInfoStandBaseComponent
{
    public petData: InfoStandPetData;

    public processButtonAction(action: string)
    {
        if(!action || !action.length) return;

        switch(action)
        {
            case '':
                break;
        }
    }

    public get level(): string
    {
        if(!this.petData) return '';

        const level = this.petData.level;
        const maxLevel = this.petData._Str_4276;

        return Nitro.instance.localization.getValueWithParameters('pet.level',
            [
                'level',
                'maxlevel'
            ],[
                level.toString(),
                maxLevel.toString()
            ]);
    }

    public get totalHappiness(): string
    {
        if(!this.petData) return '';

        return this.petData._Str_4448.toString();
    }

    public get currentHappiness(): string
    {
        if(!this.petData) return '';

        return this.petData.happyness.toString();
    }

    public get happinessPercentage(): number
    {
        if(!this.petData) return 0;

        return (this.petData.happyness / this.petData._Str_4448) * 100;
    }

    public get totalExperience(): string
    {
        if(!this.petData) return '';

        return this.petData._Str_4095.toString();
    }

    public get currentExperience(): string
    {
        if(!this.petData) return '';

        return this.petData.experience.toString();
    }

    public get experiencePercentage(): number
    {
        if(!this.petData) return 0;

        return (this.petData.experience / this.petData._Str_4095) * 100;
    }

    public get totalEnergy(): string
    {
        if(!this.petData) return '';

        return this.petData._Str_3966.toString();
    }

    public get currentEnergy(): string
    {
        if(!this.petData) return '';

        return this.petData.energy.toString();
    }

    public get energyPercentage(): number
    {
        if(!this.petData) return 0;

        return (this.petData.energy / this.petData._Str_3966) * 100;
    }

    public get scratchedCount(): string
    {
        if(!this.petData) return '';

        return Nitro.instance.localization.getValueWithParameter('infostand.text.petrespect', 'count', this.petData._Str_6943.toString());
    }

    public get age(): string
    {
        if(!this.petData) return '';

        return Nitro.instance.localization.getValueWithParameter('pet.age', 'age', this.petData.age.toString());
    }

    public get owner(): string
    {
        if(!this.petData) return '';

        return Nitro.instance.localization.getValueWithParameter('infostand.text.petowner', 'name', this.petData.ownerName);
    }

    public get type(): number
    {
        return InfoStandType.PET;
    }
}
