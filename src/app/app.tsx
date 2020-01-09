import * as PIXI from 'pixi.js-legacy';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NitroCore } from '../core/NitroCore';
import { NitroInstance } from '../nitro/NitroInstance';
import './app.scss';
import { NitroComponent } from './nitro';

//@ts-ignore
window.PIXI = PIXI;

const instance = new NitroInstance(new NitroCore());

ReactDOM.render(
    <NitroComponent nitroInstance={ instance } />,
    document.getElementById('nitro')
);