import React from 'react';
import { IFigurePartSet } from '../../../../../nitro/avatar/structure/figure/IFigurePartSet';
import { Nitro } from '../../../../../nitro/Nitro';
import { IGraphicAsset } from '../../../../../room/object/visualization/utils/IGraphicAsset';

export interface AvatarEditorSetPartProps
{
    partSet: IFigurePartSet;
    isLoaded: boolean;
    onClick: () => void;
}

export function AvatarEditorSetPart(props: AvatarEditorSetPartProps): JSX.Element
{
    const [ detailRef ] = React.useState(React.createRef<HTMLDivElement>());

    const directions = [ 2, 6, 0, 4, 3, 1 ];

    React.useEffect(() =>
    {
        if(!props.isLoaded) return;

        (detailRef.current && (detailRef.current.innerHTML = ''));

        const parts = props.partSet._Str_806;

        if(!parts || !parts.length) return;

        const container = new PIXI.Container();

        let directionIndex  = 0;
        let directionSet    = false;

        for(let part of parts)
        {
            if(!part) continue;

            let graphicAsset: IGraphicAsset = null;

            if(directionSet)
            {
                const assetName = `h_std_${ part.type }_${ part.id }_${ directions[directionIndex] }_0`;

                graphicAsset = Nitro.instance.avatar.getAssetByName(assetName);
            }
            else
            {
                directionIndex = 0;

                while(!directionSet && (directionIndex < directions.length))
                {
                    const assetName = `h_std_${ part.type }_${ part.id }_${ directions[directionIndex] }_0`;

                    graphicAsset = Nitro.instance.avatar.getAssetByName(assetName);

                    if(graphicAsset && graphicAsset.texture)
                    {
                        directionSet = true;
                    }
                    else
                    {
                        directionIndex++;
                    }
                }
            }

            if(graphicAsset && graphicAsset.texture)
            {
                const sprite = PIXI.Sprite.from(graphicAsset.texture);

                sprite.x = graphicAsset.offsetX;
                sprite.y = graphicAsset.offsetY;

                if(graphicAsset.flipH) sprite.scale.x = -1;

                container.addChild(sprite);
            }
        }

        const image = Nitro.instance.renderer.extract.image(container);

        (image && detailRef.current && detailRef.current.appendChild(image));
    }, [ props.partSet, props.isLoaded ]);

    return (
        <div className={"item-detail hc" + (!props.isLoaded ? ' loading' : '')} ref={ detailRef } onClick={props.onClick} />
    );
}