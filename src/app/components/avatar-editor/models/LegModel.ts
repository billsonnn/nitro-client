import { AvatarEditorFigureCategory } from '../../../../client/nitro/avatar/enum/AvatarEditorFigureCategory';
import { FigureData } from '../../../../client/nitro/avatar/figuredata/FigureData';
import { CategoryBaseModel } from '../common/CategoryBaseModel';

export class LegModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this._Str_3130(FigureData.LG);
        this._Str_3130(FigureData.SH);
        this._Str_3130(FigureData.WA);

        this._Str_2367 = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.LEGS;
    }
}