import * as PIXI from 'pixi.js-legacy';
import { NitroCore } from '../core/NitroCore';
import { NitroInstance } from '../nitro/NitroInstance';
import { NitroConfiguration } from '../NitroConfiguration';
import './app.scss';

window.PIXI = PIXI;

const element = document.getElementById('canvas-injector');

if(element)
{
    const instance = new NitroInstance(new NitroCore());

    if(instance)
    {
        const view = instance.renderer && instance.renderer.view;

        if(view) element.append(view);

        instance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) => instance.init());
    }
}