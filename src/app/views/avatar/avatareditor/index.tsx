import React from 'react';
import { AvatarEditorBodyView } from './body';
import { AvatarEditorHeadView } from './head';
import { AvatarEditorLegView } from './legs';
import { AvatarEditorPreview } from './preview';
import { AvatarEditorTorsoView } from './torso';

export interface AvatarEditorProps
{
    figure: string;
    gender: string;
}

export function AvatarEditor(props: AvatarEditorProps): JSX.Element
{
    const [ figure, setFigure ]     = React.useState('');
    const [ gender, setGender ]     = React.useState('M');
    const [ setType, setSetType ]   = React.useState('hd');

    const setGenderHandler = (gender: string) =>
    {
        gender = (gender === 'M' ? 'M' : 'F');

        setGender(gender);
    }

    const categories = [
        {
            name: 'Face & Body',
            setType: 'hd',
            view: <AvatarEditorBodyView key={ 'hd' } gender={ gender } setGenderHandler={ setGenderHandler }  />
        },
        {
            name: 'Head',
            setType: 'hr',
            view: <AvatarEditorHeadView key={ 'hr' } gender={ gender }  />
        },
        {
            name: 'Torso',
            setType: 'ch',
            view: <AvatarEditorTorsoView key={ 'ch' } gender={ gender }  />
        },
        {
            name: 'Legs',
            setType: 'lg',
            view: <AvatarEditorLegView key={ 'lg' } gender={ gender }  />
        }
    ];

    return (
        <div className="nitro-component avatareditor-view">
            <div className="component-body">
                <div className="body-left">
                    <div className="component-header">
                        <div className="header-title">Change Looks</div>
                    </div>
                    <div className="left-content">
                        <div className="view-categories">
                            {categories.map((value, index) => {
                                return <button type="button" className={ "btn btn-destiny" + (setType === value.setType ? ' active' : '') } key={ index } onClick={ event => setSetType(value.setType) }>{ value.name }</button>
                            })}
                        </div>
                        { categories.map((value, index) => {
                        return (setType === value.setType) && value.view
                        })}
                    </div>
                </div>
                <div className="body-right">
                    <AvatarEditorPreview figure={ figure } gender={ gender } />
                </div>
            </div>
        </div>
    );
}