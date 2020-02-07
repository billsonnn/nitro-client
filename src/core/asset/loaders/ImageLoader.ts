import { NitroInstance } from '../../../nitro/NitroInstance';

export function ImageLoader(resource: PIXI.LoaderResource, next: Function): void
{
    if(!resource) return next();

    if(resource.type === PIXI.LoaderResource.TYPE.IMAGE)
    {
        NitroInstance.instance.core.asset.setTexture(resource.name, resource.texture);

        next();
    }
}