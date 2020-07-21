import React from 'react';
import { AvatarSetType } from '../../../../nitro/avatar/enum/AvatarSetType';
import { SessionData } from '../../../hooks/session/useSessionData';
import { AvatarImage, AvatarImageOptions } from '../../avatar/avatarimage';

export function ToolbarUserView(props: { sessionData: SessionData }): JSX.Element
{
    const avatarOptions: AvatarImageOptions = {
        figure: props.sessionData.userFigure,
        gender: props.sessionData.userGender,
        setType: AvatarSetType.HEAD,
        direction: 2
    };

    return (
        <AvatarImage options={ avatarOptions } />
    );
}