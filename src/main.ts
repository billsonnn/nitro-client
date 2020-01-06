import * as PIXI from 'pixi.js-legacy';
import { INitroCore } from './core/INitroCore';
import { NitroCoreFactory } from './core/NitroCoreFactory';
import { INitroInstance } from './nitro/INitroInstance';
import { NitroInstance } from './nitro/NitroInstance';
import { NitroConfiguration } from './NitroConfiguration';
//@ts-ignore
window.PIXI = PIXI;

const core: INitroCore              = NitroCoreFactory.createCoreInstance();
const instances: INitroInstance[]   = [ new NitroInstance(core) ];

function init(): void
{
    core.asset.downloadAssets([
        NitroConfiguration.ASSET_URL + `/room/tile_cursor/tile_cursor.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_body/hh_human_body.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_item/hh_human_item.json`,
    ], (status: boolean) =>
    {
        try
        {
            for(let instance of instances)
            {
                if(!instance) continue;

                instance.init();

                if(instance.renderer) document.body.appendChild(instance.renderer.view);
            }
        }

        catch(err)
        {
            console.error(err.message || err);

            core.dispose();
        }
    });
}

init();