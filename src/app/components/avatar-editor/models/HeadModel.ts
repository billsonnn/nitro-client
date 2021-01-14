import { AvatarEditorFigureCategory } from '../../../../client/nitro/avatar/enum/AvatarEditorFigureCategory';
import { FigureData } from '../../../../client/nitro/avatar/figuredata/FigureData';
import { CategoryBaseModel } from '../common/CategoryBaseModel';

export class HeadModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.HR);
        this.addCategory(FigureData.HA);
        this.addCategory(FigureData.HE);
        this.addCategory(FigureData.EA);
        this.addCategory(FigureData.FA);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.HEAD;
    }
}