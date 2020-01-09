export class NitroConfiguration
{
    public static RELEASE_VERSION           = 'PRODUCTION-201611291003-338511768';
    public static ASSET_URL                 = 'https://assets.nitrots.co';
    public static LOCAL_ASSET_URL           = 'https://system.nitrots.co';
    public static FPS                       = 24;
    public static FURNIDATA_URL             = NitroConfiguration.ASSET_URL + '/gamedata/json/FurnitureData.json';
    public static BACKGROUND_COLOR          = 0x000000;
    public static TILE_REAL_WIDTH           = 64;
    public static TILE_REAL_HEIGHT          = 32;
    public static TILE_WIDTH                = NitroConfiguration.TILE_REAL_WIDTH / 2;
    public static TILE_HEIGHT               = NitroConfiguration.TILE_REAL_HEIGHT / 2;
    public static TILE_TOP_COLOR            = 0x989865;
    public static TILE_LEFT_COLOR           = 0x838357;
    public static TILE_RIGHT_COLOR          = 0x6F6F49;
    public static TILE_TOP_LINE_COLOR       = 0x8E8E5E;
    public static TILE_SIDE_LINE_COLOR      = 0x7A7A51;
    public static TILE_THICKNESS            = 8;
    public static Z_SCALE                   = 2;
    public static WALL_TOP_COLOR            = 0x6E717B;
    public static WALL_LEFT_COLOR           = 0xBBC0CF;
    public static WALL_RIGHT_COLOR          = 0x9599A5;
    public static WALL_THICKNESS            = 0.75;
    public static WALL_HEIGHT               = 115;
    public static WALLS_ENABLED             = false;
    public static PACKET_LOG                = false;
    public static WALKING_ENABLED           = true;
    public static ROLLING_OVERRIDES_POSTURE = true;
    public static PET_TYPES                 = [ 'dog', 'cat', 'croco', 'terrier', 'bear', 'pig', 'lion', 'rhino', 'spider', 'turtle', 'chicken', 'frog', 'dragon', 'monster', 'monkey', 'horse', 'monsterplant', 'bunnyeaster', 'bunnyevil', 'bunnydepressed', 'bunnylove', 'pigeongood', 'pigeonevil', 'demonmonkey', 'bearbaby', 'terrierbaby', 'gnome', 'gnome', 'kittenbaby', 'puppybaby', 'pigletbaby', 'haloompa', 'fools', 'pterosaur', 'velociraptor' ];

    public static PRELOAD_ASSETS: string[]  = [
        NitroConfiguration.ASSET_URL + `/room/tile_cursor/tile_cursor.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_body/hh_human_body.json`,
        NitroConfiguration.ASSET_URL + `/figure/hh_human_item/hh_human_item.json`,
    ];
}