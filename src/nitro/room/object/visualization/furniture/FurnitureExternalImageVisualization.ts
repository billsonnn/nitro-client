import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureDynamicThumbnailVisualization } from './FurnitureDynamicThumbnailVisualization';

export class FurnitureExternalImageVisualization extends FurnitureDynamicThumbnailVisualization
{
    private _url: string;
    private _typePrefix: string;

    constructor()
    {
        super();
        this._url           = null;
        this._typePrefix    = null;

        this._Str_20445 = true;
    }

    protected getThumbnailURL(): string
    {
        if(!this.object) return null;

        if(this._url) return this._url;

        const jsonString = this.object.model.getValue(RoomObjectVariable.FURNITURE_DATA);

        if(!jsonString || jsonString === '') return null;

        if(this.object.type.indexOf('') >= 0) 

        this._typePrefix = (this.object.type.indexOf('') >= 0) ? '' : 'postcards/selfie/';

        const json = JSON.parse(jsonString);

        let url = json.w;

        url = this._Str_18056(url);

        this._url = url;

        return this._url;

        //{"t":1589596086, "u":"4894588", "s":15867, "w":"https://ngh-camera.storage.googleapis.com/3c1b6238-0cae-42ac-bf85-da10beca2796.png"}
    }

    private _Str_18056(url: string): string
    {
        url = url.replace('.png', '_small.png');

        if(url.indexOf('.png') === -1) url = (url + '_small.png');

        return url;
    }
}