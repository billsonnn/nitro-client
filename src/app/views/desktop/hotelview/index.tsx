import React from 'react';
import { SessionData } from '../../../hooks/session/useSessionData';
import { AvatarImage } from '../../avatar/avatarimage';

export function HotelView(props: { sessionData: SessionData }): JSX.Element
{
    const [ figure, setFigure ] = React.useState('');

    React.useEffect(() =>
    {
        const sessionData = props.sessionData;

        if(sessionData)
        {
            setFigure(sessionData.userFigure);
        }
    }, [ props ]);

    return (
        <div className="hotel-view">
            <div className="hotel-image" />
            <AvatarImage figure={ figure } direction={ 2 } />
        </div>
    );
}