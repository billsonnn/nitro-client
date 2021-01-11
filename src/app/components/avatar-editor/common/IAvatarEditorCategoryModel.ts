import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { AvatarEditorMainComponent } from '../components/main/main.component';
import { CategoryData } from './CategoryData';

export interface IAvatarEditorCategoryModel 
{
    init(): void;
    dispose(): void;
    reset(): void;
    controller: AvatarEditorMainComponent;
    switchCategory(_arg_1?: string): void;
    getCategoryData(_arg_1: string): CategoryData;
    selectPart(_arg_1: string, _arg_2: number): void;
    selectColor(_arg_1: string, _arg_2: number, _arg_3: number): void;
    _Str_20411(_arg_1: number): boolean;
    _Str_7960(_arg_1: any): boolean; // inventory
    _Str_15298(_arg_1: number): boolean;
    _Str_8360(): boolean;
    categories: AdvancedMap<string, CategoryData>;
    canSetGender: boolean;
    maxPaletteCount: number;
    name: string;
}