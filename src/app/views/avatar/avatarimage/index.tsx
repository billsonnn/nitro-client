import React from 'react';
import { AvatarScaleType } from '../../../../nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../../../nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../../../nitro/avatar/IAvatarImageListener';
import { Nitro } from '../../../../nitro/Nitro';

export interface AvatarImageOptions
{
    figure?: string;
    gender?: string;
    setType?: string;
    direction?: number;
    scale?: number;
    cropped?: boolean;
}

export interface AvatarImageProps
{
    options: AvatarImageOptions;
}

export function AvatarImage(props: AvatarImageProps): JSX.Element
{
    const [ imageRef ] = React.useState(React.createRef<HTMLImageElement>());

    const resetFigure = (options: AvatarImageOptions) =>
    {
        options = {
            figure: ((options.figure && options.figure !== '') ? options.figure : null),
            gender: ((options.gender && options.gender !== '') ? options.gender : 'M'),
            setType: ((options.setType && options.setType !== '') ? options.setType : AvatarSetType.FULL),
            direction: ((options.direction !== undefined) ? options.direction : 0),
            scale: (((options.scale !== undefined) && (options.scale > 0)) ? options.scale : 1),
            cropped: ((options.cropped !== undefined) ? options.cropped : true)
        };

        const avatarListener: IAvatarImageListener = {
            resetFigure: figure => resetFigure(options),
            dispose: () => null,
            disposed: false
        };

        const avatarImage = Nitro.instance.avatar.createAvatarImage(options.figure, AvatarScaleType.LARGE, options.gender, avatarListener, null);

        if(avatarImage)
        {
            avatarImage.setDirection(options.setType, options.direction);

            let image: HTMLImageElement = null;

            if(options.cropped)
            {
                image = avatarImage.getCroppedImage(options.setType, 1);
            }
            else
            {
                const texture = avatarImage.getImage(options.setType, false, 1);

                image = Nitro.instance.renderer.extract.image(texture);
            }

            if(image)
            {
                image.onload = () =>
                {
                    if(imageRef && imageRef.current) {
                        imageRef.current.height = (image.height * options.scale);
                    }
                };

                if(imageRef && imageRef.current) {
                    imageRef.current.src = image.src;
                }
            }

            avatarImage.dispose();
        }
    };

    React.useEffect(() =>
    {
        resetFigure(props.options);
    }, [ props.options ]);

    return (
        <img className="avatar-image" ref={ imageRef } />
    );
}