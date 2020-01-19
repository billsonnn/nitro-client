export function ImageLoader(resource: PIXI.LoaderResource, next: Function): void
{
    if(!resource) return next();

    if(resource.type === PIXI.LoaderResource.TYPE.IMAGE)
    {
        next();
    }
}