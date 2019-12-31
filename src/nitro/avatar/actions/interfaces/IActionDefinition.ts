import { ActionType } from '../ActionType';

export interface IActionDefinition
{
    getType(id: string): ActionType;
    getParameter(id: string): string;
    getPreventionWithType(type: string): string[];
    getValueForParam(id: number): string;
    id: string;
    state: string;
    precedence: number;
    activePartSet: string;
    assetPartDefinition: string;
    lay: string;
    geometryType: string;
    isMain: boolean;
    isDefault: boolean;
    isAnimation: boolean;
    startFromFrameZero: boolean;
    prevents: string[];
    preventHeadTurn: boolean;
    params: { [index: string]: string };
}