import { IAvatarEditorCategoryModel } from './IAvatarEditorCategoryModel';

export interface IAvatarEditorGridView 
{
    dispose(): void;
    window: HTMLElement;
    initFromList(_arg_1: IAvatarEditorCategoryModel, _arg_2: string): void;
    _Str_5614(_arg_1: number): void;
}