import React from 'react';
import { AvatarScaleType } from '../../../../nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../../../nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../../../nitro/avatar/IAvatarImageListener';
import { Nitro } from '../../../../nitro/Nitro';

export interface AvatarImageProps
{
    figure: string;
    gender?: string;
    setType?: string;
    direction?: number;
    scale?: number;
}

export function AvatarImage(props: AvatarImageProps): JSX.Element
{
    const [ imageRef ] = React.useState(React.createRef<HTMLDivElement>());

    const resetFigure = () =>
    {
        const figure    = (props.figure || '');
        const gender    = (props.gender || 'M');
        const setType   = (props.setType || AvatarSetType.FULL);
        const direction = (props.direction || 0);
        const scale     = (props.scale || 1);

        const avatarListener: IAvatarImageListener = {
            resetFigure: resetFigure,
            dispose: disposeFigure,
            disposed: false
        };

        const avatarImage = Nitro.instance.avatar.createAvatarImage(figure, AvatarScaleType.LARGE, gender, avatarListener, null);

        if(avatarImage)
        {
            avatarImage.setDirection(setType,direction);

            const texture = avatarImage.getCroppedImage(setType, scale);

            if(texture)
            {
                const image = Nitro.instance.renderer.extract.image(texture);

                if(image)
                {
                    imageRef.current.innerHTML = '';
                    imageRef.current.appendChild(image);
                }
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
        <div className="avatar-image" ref={ imageRef }></div>
    );
}