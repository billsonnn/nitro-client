import { AvatarEditorFigureCategory } from 'nitro-renderer/src/nitro/avatar/enum/AvatarEditorFigureCategory';
import { FigureData } from 'nitro-renderer/src/nitro/avatar/figuredata/FigureData';
import { CategoryBaseModel } from '../common/CategoryBaseModel';

export class LegModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.TROUSERS);
        this.addCategory(FigureData.SHOES);
        this.addCategory(FigureData.TROUSER_ACCESSORIES);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.LEGS;
    }
}
