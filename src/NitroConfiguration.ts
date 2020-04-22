export class NitroConfiguration
{
    public static FPS                       = 24;
    public static BACKGROUND_COLOR          = 0x000000;
    public static PACKET_LOG                = false;
    public static ROLLING_OVERRIDES_POSTURE = true;

    public static RELEASE_VERSION           = 'PRODUCTION-201611291003-338511768';
    public static SOCKET_URL                = 'wss://nitro-socket.nextgenhabbo.com';
    //public static SOCKET_URL                = 'wss://system.nitrots.co';
    public static ASSET_URL                 = 'https://assets.nitrots.co';
    public static ASSET_AVATAR_URL          = NitroConfiguration.ASSET_URL + '/figure/%libname%/%libname%.json';
    public static ASSET_EFFECT_URL          = NitroConfiguration.ASSET_URL + '/effect/%libname%/%libname%.json';
    public static FURNIDATA_URL             = NitroConfiguration.ASSET_URL + '/gamedata/json/FurnitureDataNGH.json';

    public static PET_TYPES                 = [ 'dog', 'cat', 'croco', 'terrier', 'bear', 'pig', 'lion', 'rhino', 'spider', 'turtle', 'chicken', 'frog', 'dragon', 'monster', 'monkey', 'horse', 'monsterplant', 'bunnyeaster', 'bunnyevil', 'bunnydepressed', 'bunnylove', 'pigeongood', 'pigeonevil', 'demonmonkey', 'bearbaby', 'terrierbaby', 'gnome', 'gnome', 'kittenbaby', 'puppybaby', 'pigletbaby', 'haloompa', 'fools', 'pterosaur', 'velociraptor', 'cow', 'LeetPen', 'bbwibb', 'elephants' ];

    // -1 is credits
    public static DISPLAYED_CURRENCY_TYPES  = [ -1, 0, 5 ];

    public static PRELOAD_ASSETS: string[]  = [
        NitroConfiguration.ASSET_URL + `/room/room/room.json`,
        NitroConfiguration.ASSET_URL + `/room/tile_cursor/tile_cursor.json`,
        NitroConfiguration.ASSET_URL + `/room/place_holder/place_holder.json`,
        NitroConfiguration.ASSET_URL + `/room/place_holder_wall/place_holder_wall.json`,
        NitroConfiguration.ASSET_URL + `/room/place_holder_pet/place_holder_pet.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_body/hh_human_body.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_item/hh_human_item.json`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_blowkiss.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_left_1.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_left_2.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_right_1.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_right_2.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_typing.png`,
    ];
}