import { IAvatarImageListener } from '../IAvatarImageListener';
import { FigureData } from './FigureData';

export class FigureDataView implements IAvatarImageListener
{
    public static _Str_9887: number = 4;

    private _model: FigureData;
    private _container: HTMLImageElement;
    private _figureString: string;
    private _isDisposed: boolean;

    constructor(k: FigureData)
    {
        this._model         = k;
        this._container     = null;
        this._figureString  = null;
        this._isDisposed    = false;
    }

    public update(k: string, effectId: number = 0, direction: number = 4):void
    {
        // this._figureString = k;

        // const image = Nitro.instance.avatar.createAvatarImage(this._figureString, AvatarScaleType.LARGE, null, this);


        // if (this._roomPreviewer._Str_2949)
        // {
        //     this._roomPreviewer._Str_18705(k, effectId);
        //     this._roomPreviewer._Str_25062(direction, direction);
        //     this._roomPreviewer._Str_9695(true);
        //     this._roomPreviewer._Str_22348();
        // }
        // else
        // {
        //     _local_4 = this._model.avatarEditor.manager.avatarRenderManager.createAvatarImage(k, AvatarScaleType.LARGE, null, this);
        //     this._widget._Str_9202(_local_4._Str_818(AvatarSetType.FULL));
        // }
    }

    public resetFigure(k: string):void
    {
        // if(k !== this._figureString) return;


        // var _local_2:IAvatarImage;
        // if (k == this._figureString)
        // {
        //     _local_2 = this._model.avatarEditor.manager.avatarRenderManager.createAvatarImage(this._figureString, AvatarScaleType.LARGE, null, this);
        //     this._widget._Str_9202(_local_2._Str_818(AvatarSetType.FULL));
        // }
    }

    // private renderAvatar(setType: string): void
    // {
    //     const image = Nitro.instance.avatar.createAvatarImage(this._figureString, AvatarScaleType.LARGE, null, this);

    //     if(!image) return;

    //     if(!this._container)
    //     {
    //         this._container = document.createElement('img');
    //     }

    //     const rendered = image.getCroppedImage(AvatarSetType.FULL);

    //     this._container.onload = () =>
    //     {
    //         this._container.width = 
    //     }

    //     image.onload = () =>
    //     {
    //         if(imageRef && imageRef.current) {
    //             imageRef.current.height = (image.height * options.scale);
    //         }
    //     };

    //     if(imageRef && imageRef.current) {
    //         imageRef.current.src = image.src;
    //     }
    // }

    public dispose():void
    {
        this._isDisposed = true;
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }
}