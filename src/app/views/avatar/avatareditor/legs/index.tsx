import React from 'react';
import { AvatarEditorSet } from '../common/AvatarEditorSet';
import { FigureBuilderSet } from '..';

export interface AvatarEditorLegViewProps
{
    gender: string;
    setPartSetHandler: (partset: string, update: FigureBuilderSet) => void;
}

export function AvatarEditorLegView(props: AvatarEditorLegViewProps): JSX.Element
{
    const [ setType, setSetType ] = React.useState('lg');

    const categories = [
        {
            name: 'Pants',
            setType: 'lg',
            icon: 'lg-icon'
        },
        {
            name: 'Shoes',
            setType: 'sh',
            icon: 'sh-icon'
        },
        {
            name: 'Belts',
            setType: 'wa',
            icon: 'wa-icon'
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