import React from 'react';
import { AvatarDirectionAngle } from '../../../../../nitro/avatar/enum/AvatarDirectionAngle';
import { UserFigureComposer } from '../../../../../nitro/communication/messages/outgoing/user/data/UserFigureComposer';
import { Nitro } from '../../../../../nitro/Nitro';
import { AvatarImage, AvatarImageOptions } from '../../avatarimage';

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

    const saveFigure = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    {
        Nitro.instance.communication.connection.send(new UserFigureComposer(props.gender, props.figure));
    }

    const avatarOptions: AvatarImageOptions = {
        figure: props.figure,
        gender: props.gender,
        direction: direction,
        scale: 2,
        cropped: false
    };

    return (
        <div className="avatar-preview">
            <AvatarImage options={ avatarOptions } />
            <div className="preview-shadow" />
            <div className="preview-directions">
                <i className="icon arrow-left-icon" onClick={ () => trySetDirection(direction + 1) } />
                <i className="icon arrow-right-icon" onClick={ () => trySetDirection(direction - 1) } />
            </div>
            <button className="btn btn-destiny" onClick={ event => saveFigure(event) }>Save</button>
        </div>
    );
}