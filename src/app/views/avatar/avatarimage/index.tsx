import React from 'react';
import { AvatarScaleType } from '../../../../nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../../../nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../../../nitro/avatar/IAvatarImageListener';
import { Nitro } from '../../../../nitro/Nitro';

export interface AvatarImageProps
{
    figure?: string;
    gender?: string;
    setType?: string;
    direction?: number;
    scale?: number;
    cropped?: boolean;
}

export function AvatarImage(props: AvatarImageProps): JSX.Element
{
    const [ imageRef ] = React.useState(React.createRef<HTMLImageElement>());

    const resetFigure = () =>
    {
        const figure    = (props.figure || '');
        const gender    = (props.gender || 'M');
        const setType   = (props.setType || AvatarSetType.FULL);
        const direction = (props.direction || 0);
        const scale     = (props.scale || 1);
        const cropped   = (props.cropped === undefined ? true : props.cropped);

        const avatarListener: IAvatarImageListener = {
            resetFigure: resetFigure,
            dispose: disposeFigure,
            disposed: false
        };

        const avatarImage = Nitro.instance.avatar.createAvatarImage(figure, AvatarScaleType.LARGE, gender, avatarListener, null);

        if(avatarImage)
        {
            avatarImage.setDirection(setType,direction);

            let image: HTMLImageElement = null;

            if(cropped)
            {
                image = avatarImage.getCroppedImage(setType, 1);
            }
            else
            {
                const texture = avatarImage.getImage(setType, false, 1);

                image = Nitro.instance.renderer.extract.image(texture);
            }

            if(image)
            {
                image.onload = () =>
                {
                    imageRef.current.height = (image.height * scale);
                };

                imageRef.current.src = image.src;
            }
        }
    };

    const disposeFigure = () =>
    {

    };

    React.useEffect(() =>
    {
        resetFigure();
    }, [ props ]);

    return (
        <img ref={ imageRef } />
    );
}