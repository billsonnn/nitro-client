import * as PIXI from 'pixi.js-legacy';
import { NitroCore } from '../core/NitroCore';
import { NitroInstance } from '../nitro/NitroInstance';
import { NitroConfiguration } from '../NitroConfiguration';
import './app.scss';

PIXI.settings.SCALE_MODE    = PIXI.SCALE_MODES.NEAREST;
PIXI.Ticker.shared.maxFPS   = NitroConfiguration.FPS;

window.PIXI = PIXI;

const instance = new NitroInstance(new NitroCore(), {
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true
});

if(instance)
{
    const view = instance.renderer && instance.renderer.view;

    if(view)
    {
        view.id         = 'client-wrapper';
        view.className  = 'client-canvas';

        document.body.append(view);
    }

    instance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) => instance.init());
}