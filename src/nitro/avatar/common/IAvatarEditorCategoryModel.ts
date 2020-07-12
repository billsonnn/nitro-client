import { HabboAvatarEditor } from '../HabboAvatarEditor';
import { CategoryData } from './CategoryData';

export interface IAvatarEditorCategoryModel 
{
    dispose(): void;
    reset(): void;
    controller: HabboAvatarEditor;
    getWindowContainer(): HTMLElement;
    switchCategory(_arg_1?: string): void;
    getCategoryData(_arg_1: string): CategoryData;
    selectPart(_arg_1: string, _arg_2: number): void;
    selectColor(_arg_1: string, _arg_2: number, _arg_3: number): void;
    _Str_20411(_arg_1: number): boolean;
    //_Str_7960(_arg_1:IHabboInventory): boolean;
    _Str_15298(_arg_1: number): boolean;
    _Str_8360(): boolean;
}