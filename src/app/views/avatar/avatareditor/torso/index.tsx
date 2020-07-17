import React from 'react';
import { AvatarEditorSet } from '../common/AvatarEditorSet';
import { FigureBuilderSet } from '..';

export interface AvatarEditorTorsoViewProps
{
    gender: string;
    setPartSetHandler: (partset: string, update: FigureBuilderSet) => void;
}

export function AvatarEditorTorsoView(props: AvatarEditorTorsoViewProps): JSX.Element
{
    const [ setType, setSetType ] = React.useState('ch');

    const categories = [
        {
            name: 'Shirts',
            setType: 'ch',
            icon: 'ch-icon'
        },
        {
            name: 'Jackets',
            setType: 'cc',
            icon: 'cc-icon'
        },
        {
            name: 'Prints',
            setType: 'ca',
            icon: 'ca-icon'
        },
        {
            name: 'Accessories',
            setType: 'cp',
            icon: 'cp-icon'
        }
    ];

    return (
        <div className="view-container">
            <div className="view-categories">
                {categories.map((value, index) => {
                return <button type="button" className={ "btn btn-destiny" + (setType === value.setType ? ' active' : '') } key={index} onClick={ event => setSetType(value.setType) }>{ (value.icon && <i className={ "icon " + value.icon + (setType === value.setType ? ' selected' : '') } />) || value.name }</button>
                })}
            </div>
            <AvatarEditorSet setName={ setType } gender={ props.gender } setPartSetHandler={props.setPartSetHandler} />
        </div>
    );
}