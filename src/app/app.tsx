import * as PIXI from 'pixi.js-legacy';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NitroCore } from '../core/NitroCore';
import { NitroInstance } from '../nitro/NitroInstance';
import { NitroConfiguration } from '../NitroConfiguration';
import './app.scss';
import { DesktopComponent } from './components/desktop';

//@ts-ignore
window.PIXI = PIXI;

const instance = new NitroInstance(new NitroCore());

init();

function init(): void
{
    let isLoading: boolean = true;

    ReactDOM.render(
        <DesktopComponent isLoading={ isLoading } />,
        document.getElementById('desktop')
    );

    instance.core.asset.downloadAssets([
        NitroConfiguration.ASSET_URL + `/room/tile_cursor/tile_cursor.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_body/hh_human_body.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_item/hh_human_item.json`,
    ], (status: boolean) =>
    {
        try
        {
            instance.init();

            isLoading = false;
        }

        catch(err)
        {
            console.error(err.message || err);

            instance.core.dispose();
        }
    });
}