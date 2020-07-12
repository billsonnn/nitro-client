import React from 'react';
import { AvatarImage } from '../avatarimage';

export interface AvatarEditorProps
{
    figure: string;
}

export function AvatarEditor(props: AvatarEditorProps): JSX.Element
{
    const [ figure, setFigure ] = React.useState('');

    React.useEffect(() =>
    {
        setFigure(props.figure);
    }, [ props.figure ]);

    return (
        <div className="nitro-component avatareditor-view">
            <div className="component-header">
                <div className="header-title">Avatar Editor</div>
            </div>
            <div className="component-body">
                <AvatarImage figure={ figure } direction={ 4 } scale={ 1 } />
            </div>
        </div>
    );
}