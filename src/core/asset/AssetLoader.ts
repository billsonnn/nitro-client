import { NitroInstance } from '../../nitro/NitroInstance';
import { IAssetData } from './interfaces';

export function AssetLoader(resource: PIXI.LoaderResource, next: Function): void
{
    if(!resource.data || resource.type !== PIXI.LoaderResource.TYPE.JSON || resource.data.type === undefined) return next();

    const assetData     = resource.data as IAssetData;
    const loadOptions   = getLoadOptions(resource);
    const spriteSheet   = getSpritesheetUrl(resource.url, assetData.spritesheet);

    this.add(spriteSheet, spriteSheet, loadOptions, (res: any) =>
    {
        if(!res.spritesheet) return;

        NitroInstance.instance.core.asset.createAsset(assetData.name, assetData);

        next();
    });
}

export function getLoadOptions(resource: PIXI.LoaderResource): PIXI.ILoaderOptions
{
    return {
        crossOrigin: resource.crossOrigin,
        loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
        metadata: resource.metadata,
        //@ts-ignore
        parentResource: resource
    };
}

export function getSpritesheetUrl(resourceUrl: string, spritesheetFilename: string): string
{
    const lastDashPosition  = resourceUrl.lastIndexOf('/');
    const spritesheetUrl    = resourceUrl.substring(0, lastDashPosition + 1) + spritesheetFilename;

    return spritesheetUrl;
}