import React from 'react';
import { SessionData } from '../../../hooks/session/useSessionData';
import { AvatarImage, AvatarImageOptions } from '../../avatar/avatarimage';

export function HotelView(props: { sessionData: SessionData }): JSX.Element
{
    const avatarOptions: AvatarImageOptions = {
        figure: props.sessionData.userFigure,
        gender: props.sessionData.userGender,
        direction: 2,
        cropped: false
    }

    return (
        <div className="hotel-view">
            <div className="hotel-image" />
            <AvatarImage options={ avatarOptions } />
        </div>
    );
}