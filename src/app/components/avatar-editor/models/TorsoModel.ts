import { AvatarEditorFigureCategory } from '../../../../client/nitro/avatar/enum/AvatarEditorFigureCategory';
import { FigureData } from '../../../../client/nitro/avatar/figuredata/FigureData';
import { CategoryBaseModel } from '../common/CategoryBaseModel';

export class TorsoModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.CH);
        this.addCategory(FigureData.CHEST_PRINTS);
        this.addCategory(FigureData.CC);
        this.addCategory(FigureData.CHEST_ACCESSORIES);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.TORSO;
    }
}