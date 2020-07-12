import { HabboAvatarEditor } from '../HabboAvatarEditor';

export interface ISideContentModel 
{
    dispose():void;
    reset():void;
    controller: HabboAvatarEditor;
    getWindowContainer(): HTMLElement;
}