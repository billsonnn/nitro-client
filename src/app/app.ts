import * as PIXI from 'pixi.js-legacy';
import { NitroCore } from '../core/NitroCore';
import { NitroInstance } from '../nitro/NitroInstance';
import { NitroConfiguration } from '../NitroConfiguration';
import './app.scss';

window.PIXI = PIXI;

const instance = new NitroInstance(new NitroCore());

instance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) =>
{
    instance.init();
});

const element = document.getElementById('nitro-client-wrapper');

if(element)
{
    const view = instance && instance.renderer && instance.renderer.view;
    
    if(view) element.append(view);
}