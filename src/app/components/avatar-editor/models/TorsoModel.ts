import { AvatarEditorFigureCategory } from '../../../../client/nitro/avatar/enum/AvatarEditorFigureCategory';
import { FigureData } from '../../../../client/nitro/avatar/figuredata/FigureData';
import { CategoryBaseModel } from '../common/CategoryBaseModel';

export class TorsoModel extends CategoryBaseModel
{
    public init(): void
    {
        super.init();

        this._Str_3130(FigureData.CH);
        this._Str_3130(FigureData.CHEST_ACCESSORIES);
        this._Str_3130(FigureData.CC);
        this._Str_3130(FigureData.CHEST_PRINTS);

        this._Str_2367 = true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.TORSO;
    }
}