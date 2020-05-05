import { NitroInstance } from '../../../nitro/NitroInstance';
import { IAssetData } from '../interfaces';

export function AssetLoader(resource: PIXI.LoaderResource, next: Function): void
{
    if(!resource) return next();

    if(resource.type === PIXI.LoaderResource.TYPE.IMAGE)
    {
        const split = resource.name.split('/');
        const name  = split[(split.length - 1)];

        if(name.indexOf('.json_image') === -1) NitroInstance.instance.core.asset.setTexture(name, resource.texture);

        return next();
    }

    if((resource.type === PIXI.LoaderResource.TYPE.JSON) && resource.data)
    {
        const assetData = resource.data as IAssetData;

        if(assetData.type)
        {
            if(assetData.assets && Object.keys(assetData.assets).length)
            {
                const loadOptions   = getLoadOptions(resource);
                const spriteSheet   = getSpritesheetUrl(resource.url, assetData.spritesheet);

                this.add(spriteSheet, spriteSheet, loadOptions, (res: any) =>
                {
                    if(res.spritesheet) NitroInstance.instance.core.asset.createCollection(assetData, res.spritesheet);

                    next();
                });
            }
            else
            {
                NitroInstance.instance.core.asset.createCollection(assetData, null);

                next();
            }
        }
        else next();
    }
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