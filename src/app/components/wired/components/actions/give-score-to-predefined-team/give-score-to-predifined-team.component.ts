import { Component } from '@angular/core';
import { Triggerable } from '../../../../../../client/nitro/communication/messages/incoming/roomevents/Triggerable';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';
import { Nitro } from 'src/client/nitro/Nitro';
import { Options } from '@angular-slider/ngx-slider';

@Component({
    templateUrl: './give-score-to-predefined-team.template.html'
})
export class GiveScoreToPredefinedTeamComponent extends WiredAction
{
    private static MINIMUM_VALUE: number = 1;
    private static STEPPER_VALUE: number = 1;
    private static POINTS_MAXIMUM_VALUE: number = 100;
    private static TIMES_MAXIMUM_VALUE: number = 10;

    public static CODE: number = WiredActionType.GIVE_SCORE_TO_PREDEFINED_TEAM;

    public points: number = 1;
    public times: number = 1;
    public team: string;

    public get code(): number
    {
        return GiveScoreToPredefinedTeamComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.points = trigger.intData.length > 0 ? trigger.intData[0] : 1;
        this.times = trigger.intData.length > 1 ? trigger.intData[1] : 1;
        this.team = (trigger.intData.length > 2 ? trigger.intData[2] : 1).toString();
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [ this.points, this.times, Number.parseInt(this.team) ];
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public decreasePoints(): void
    {
        this.points -= 1;

        if(this.points < GiveScoreToPredefinedTeamComponent.MINIMUM_VALUE) this.points = GiveScoreToPredefinedTeamComponent.MINIMUM_VALUE;
    }

    public increasePoints(): void
    {
        this.points += 1;

        if(this.points > GiveScoreToPredefinedTeamComponent.POINTS_MAXIMUM_VALUE) this.points = GiveScoreToPredefinedTeamComponent.POINTS_MAXIMUM_VALUE;
    }

    public decreaseTimes(): void
    {
        this.times -= 1;

        if(this.times < GiveScoreToPredefinedTeamComponent.MINIMUM_VALUE) this.times = GiveScoreToPredefinedTeamComponent.MINIMUM_VALUE;
    }

    public increaseTimes(): void
    {
        this.times += 1;

        if(this.times > GiveScoreToPredefinedTeamComponent.TIMES_MAXIMUM_VALUE) this.times = GiveScoreToPredefinedTeamComponent.TIMES_MAXIMUM_VALUE;
    }

    protected updateLocaleParameter(): void
    {
        Nitro.instance.localization.registerParameter('wiredfurni.params.setpoints', 'points', this.points.toString());
        Nitro.instance.localization.registerParameter('wiredfurni.params.settimesingame', 'times', this.times.toString());
        super.updateLocaleParameter();
    }

    public get pointsSliderOptions(): Options
    {
        return {
            floor: GiveScoreToPredefinedTeamComponent.MINIMUM_VALUE,
            ceil: GiveScoreToPredefinedTeamComponent.POINTS_MAXIMUM_VALUE,
            step: GiveScoreToPredefinedTeamComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }

    public get timesSliderOptions(): Options
    {
        return {
            floor: GiveScoreToPredefinedTeamComponent.MINIMUM_VALUE,
            ceil: GiveScoreToPredefinedTeamComponent.TIMES_MAXIMUM_VALUE,
            step: GiveScoreToPredefinedTeamComponent.STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
