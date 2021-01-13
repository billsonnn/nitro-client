import { AvatarEditorFigureCategory } from '../../../../client/nitro/avatar/enum/AvatarEditorFigureCategory';
import { FigureData } from '../../../../client/nitro/avatar/figuredata/FigureData';
import { CategoryBaseModel } from '../common/CategoryBaseModel';

export class LegModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.LG);
        this.addCategory(FigureData.SH);
        this.addCategory(FigureData.WA);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.LEGS;
    }
}