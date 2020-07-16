import React from 'react';
import { AvatarDirectionAngle } from '../../../../../nitro/avatar/enum/AvatarDirectionAngle';
import { AvatarImage } from '../../avatarimage';

export interface AvatarEditorPreviewProps
{
    figure?: string;
    gender?: string;
}

export function AvatarEditorPreview(props: AvatarEditorPreviewProps): JSX.Element
{
    const [ direction, setDirection ] = React.useState(4);

    const trySetDirection = (direction: number) =>
    {
        let newDirection = direction;

        if(newDirection < AvatarDirectionAngle.MIN_DIRECTION)
        {
            newDirection = (AvatarDirectionAngle.MAX_DIRECTION + (newDirection + 1));
        }

        if(newDirection > AvatarDirectionAngle.MAX_DIRECTION)
        {
            newDirection = (newDirection - (AvatarDirectionAngle.MAX_DIRECTION + 1));
        }

        setDirection(newDirection);
    };

    return (
        <div className="avatar-preview">
            <AvatarImage figure={ props.figure } gender={ props.gender } direction={ direction } scale={ 2 } cropped={ false } />
            <div className="preview-shadow" />
            <div className="preview-directions">
                <i className="icon arrow-left-icon" onClick={ () => trySetDirection(direction + 1) } />
                <i className="icon arrow-right-icon" onClick={ () => trySetDirection(direction - 1) } />
            </div>
        </div>
    );
}