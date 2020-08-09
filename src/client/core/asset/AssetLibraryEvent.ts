import { NitroEvent } from '../events/NitroEvent';
import { IAssetLibrary } from './IAssetLibrary';

export class AssetLibraryEvent extends NitroEvent
{
    public static LIBRARY_LOADED: string    = 'ALE_LIBRARY_LOADED';

    private _library: IAssetLibrary

    constructor(type: string, library: IAssetLibrary)
    {
        super(type);

        this._library = library;
    }

    public get library(): IAssetLibrary
    {
        return this._library;
    }
}