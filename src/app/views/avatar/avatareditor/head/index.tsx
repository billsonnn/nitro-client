import React from 'react';
import { AvatarEditorSet } from '../common/AvatarEditorSet';

export interface AvatarEditorHeadViewProps
{
    gender: string;
}

export function AvatarEditorHeadView(props: AvatarEditorHeadViewProps): JSX.Element
{
    const [ setType, setSetType ] = React.useState('hr');

    const categories = [
        {
            name: 'Hair',
            setType: 'hr',
            icon: 'hr-icon'
        },
        {
            name: 'Hats',
            setType: 'ha',
            icon: 'ha-icon'
        },
        {
            name: 'Accessories',
            setType: 'he',
            icon: 'he-icon'
        },
        {
            name: 'Eyewear',
            setType: 'ea',
            icon: 'ea-icon'
        },
        {
            name: 'Masks',
            setType: 'fa',
            icon: 'fa-icon'
        },
    ];

    return (
        <div className="view-container">
            <div className="view-categories">
                {categories.map((value, index) => {
                return <button type="button" className={ "btn btn-destiny" + (setType === value.setType ? ' active' : '') } key={index} onClick={ event => setSetType(value.setType) }>{ (value.icon && <i className={ "icon " + value.icon + (setType === value.setType ? ' selected' : '') } />) || value.name }</button>
                })}
            </div>
            <AvatarEditorSet setName={ setType } gender={ props.gender } />
        </div>
    );
}