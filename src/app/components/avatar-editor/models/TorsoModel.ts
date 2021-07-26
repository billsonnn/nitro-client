import { AvatarEditorFigureCategory } from 'nitro-renderer/src/nitro/avatar/enum/AvatarEditorFigureCategory';
import { CategoryBaseModel } from '../common/CategoryBaseModel';
import { FigureData } from '../common/FigureData';

export class TorsoModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this.addCategory(FigureData.SHIRT);
        this.addCategory(FigureData.CHEST_PRINTS);
        this.addCategory(FigureData.JACKET);
        this.addCategory(FigureData.CHEST_ACCESSORIES);

        this._isInitalized = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.TORSO;
    }
}
