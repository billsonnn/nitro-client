import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { AvatarEditorMainComponent } from '../components/main/main.component';
import { AvatarEditorModelViewerComponent } from '../components/model-viewer/model-viewer.component';
import { CategoryData } from './CategoryData';
import { IAvatarEditorCategoryModel } from './IAvatarEditorCategoryModel';

export class CategoryBaseModel implements IAvatarEditorCategoryModel
{
    protected _categories: AdvancedMap<string, CategoryData>;
    protected _Str_2278: AvatarEditorMainComponent;
    protected _Str_2271: AvatarEditorModelViewerComponent;
    protected _Str_2367: boolean;
    protected _maxPaletteCount: number;
    private _disposed: boolean;

    constructor(k: AvatarEditorMainComponent)
    {
        this._Str_2278  = k;
        this._Str_2367  = false;
        this._maxPaletteCount = 0;
    }

    public dispose(): void
    {
        this._categories    = null;
        this._Str_2278      = null;
        this._disposed      = true;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public init(): void
    {
        if (!this._categories)
        {
            this._categories = new AdvancedMap();
        }
    }

    public reset(): void
    {
        this._Str_2367 = false;

        if(this._categories)
        {
            for(let k of this._categories.getValues())
            {
                if(k) k.dispose();
            }
        }

        this._categories = new AdvancedMap();

        // if(this._Str_2271) this._Str_2271.reset();
    }

    public setViewer(viewer: AvatarEditorModelViewerComponent): void
    {
        this._Str_2271 = viewer;
    }

    protected _Str_3130(k: string): void
    {
        let existing = this._categories.getValue(k);

        if(existing) return;

        existing = this._Str_2278._Str_24037(this, k);

        if(!existing) return;

        this._categories.add(k, existing);
        
        this.updateSelectionsFromFigure(k);
    }

    public switchCategory(k: string = ''): void
    {
        if(!this._Str_2367) this.init();

        // if(this._Str_2271) this._Str_2271.switchCategory(k);
    }

    protected updateSelectionsFromFigure(k: string): void
    {
        if(!this._categories || !this._Str_2278 || !this._Str_2278.figureData) return;

        const category = this._categories.getValue(k);

        if(!category) return;

        const setId = this._Str_2278.figureData.getPartSetId(k);

        let colorIds = this._Str_2278.figureData.getColourIds(k);

        if(!colorIds) colorIds = [];

        category._Str_20245(setId);
        category._Str_17669(colorIds);

        // if (this._Str_2271) this._Str_2271._Str_5614(k, _local_4.length);
    }

    public _Str_20411(k: number): boolean
    {
        if(!this._categories) return false;

        for(let category of this._categories.getValues())
        {
            if(!category) continue;

            if(category._Str_23352(k)) return true;
        }

        return false;
    }

    public _Str_7960(k: any): boolean // inventory
    {
        if(!this._categories) return false;

        // for(let category of this._categories.values())
        // {
        //     if(!category) continue;

        //     if(category._Str_7960(k)) return true;
        // }

        return false;
    }

    public _Str_15298(k: number): boolean
    {
        if(!this._categories) return false;

        let _local_2 = false;

        for(let name of this._categories.getKeys())
        {
            const category = this._categories.getValue(name);

            if(!category) continue;

            let _local_7 = false;

            if(category._Str_15298(k)) _local_7 = true;

            if(category._Str_23810(k)) _local_7 = true;

            if(_local_7)
            {
                const _local_8 = category._Str_6315();

                if(_local_8 && this._Str_2278 && this._Str_2278.figureData && category)
                {
                    this._Str_2278.figureData._Str_2088(name, _local_8.id, category._Str_11211(), true);
                }

                _local_2 = true;
            }
        }

        return _local_2;
    }

    public _Str_8360(): boolean
    {
        if(!this._categories) return false;

        let _local_2 = false;

        for(let name of this._categories.getKeys())
        {
            const category = this._categories.getValue(name);

            if(!category) continue;

            let _local_6 = false;

            // if(category._Str_8360(this._Str_2278.manager.inventory)) _local_6 = true;

            if(_local_6)
            {
                const _local_7 = category._Str_6315();

                if (_local_7 && this._Str_2278 && this._Str_2278.figureData && category)
                {
                    this._Str_2278.figureData._Str_2088(name, _local_7.id, category._Str_11211(), true);
                }

                _local_2 = true;
            }
        }

        return _local_2;
    }

    public selectPart(k: string, _arg_2: number): void
    {
        var categoryData = this._categories.getValue(k);

        if(!categoryData) return;

        const partIndex = categoryData._Str_22359;

        categoryData._Str_8066(_arg_2);

        const partItem = categoryData._Str_6315();

        if(!partItem) return;

        if(partItem.isDisabledForWearing)
        {
            categoryData._Str_8066(partIndex);

            this._Str_2278.openHabboClubAdWindow();

            return;
        }

        this._maxPaletteCount = partItem.colorLayerCount;

        if(this._Str_2278 && this._Str_2278.figureData)
        {
            this._Str_2278.figureData._Str_2088(k, partItem.id, categoryData._Str_11211(), true);
        }
    }

    public selectColor(k: string, _arg_2: number, _arg_3: number): void
    {
        const categoryData = this._categories.getValue(k);

        if(!categoryData) return;

        const paletteIndex = categoryData._Str_24480(_arg_3);

        categoryData._Str_17959(_arg_2, _arg_3);

        if(this._Str_2278 && this._Str_2278.figureData)
        {
            const colorItem = categoryData._Str_13355(_arg_3);

            if(colorItem._Str_14863)
            {
                categoryData._Str_17959(paletteIndex, _arg_3);

                this._Str_2278.openHabboClubAdWindow();

                return;
            }

            this._Str_2278.figureData.savePartSetColourId(k, categoryData._Str_11211(), true);
        }
    }

    public get controller(): AvatarEditorMainComponent
    {
        return this._Str_2278;
    }

    public getCategoryData(k: string): CategoryData
    {
        if(!this._Str_2367) this.init();

        if(!this._categories) return null;

        return this._categories.getValue(k);
    }

    public get categories(): AdvancedMap<string, CategoryData>
    {
        return this._categories;
    }

    public get canSetGender(): boolean
    {
        return false;
    }

    public get maxPaletteCount(): number
    {
        return this._maxPaletteCount;
    }

    public set maxPaletteCount(count: number)
    {
        this._maxPaletteCount = count;
    }

    public get name(): string
    {
        return null;
    }
}