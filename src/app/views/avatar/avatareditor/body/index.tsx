import React from 'react';
import { AvatarEditorSet } from '../common/AvatarEditorSet';

export interface AvatarEditorBodyViewProps
{
    gender: string;
    setGenderHandler: (gender: string) => void;
}

export function AvatarEditorBodyView(props: AvatarEditorBodyViewProps): JSX.Element
{
    const genders = [
        {
            name: 'Male',
            gender: 'M',
            icon: 'male-icon'
        },
        {
            name: 'Female',
            gender: 'F',
            icon: 'female-icon'
        }
    ];

    return (
        <div className="view-container">
            <div className="view-categories">
                {genders.map((value, index) => {
                return <button type="button" className={ "btn btn-destiny" + (props.gender === value.gender ? ' active' : '') } key={index} onClick={ event => props.setGenderHandler(value.gender) }>{ (value.icon && <i className={ "icon " + value.icon + (props.gender === value.gender ? ' selected' : '')} />) } { value.name }</button>
                })}
            </div>
            <AvatarEditorSet setName={ 'hd' } gender={ props.gender } />
        </div>
    );
}