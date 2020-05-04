export class NitroConfiguration
{
    public static RELEASE_VERSION           = 'PRODUCTION-201611291003-338511768';
    public static SOCKET_URL                = 'wss://nitro-socket.nextgenhabbo.com';
    //public static SOCKET_URL                = 'wss://system.nitrots.co';
    public static ASSET_URL                 = 'https://assets.nitrots.co';

    public static AVATAR_GEOMETRY_URL       = NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarGeometry.json';
    public static AVATAR_PARTSETS_URL       = NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarPartSets.json';
    public static AVATAR_ACTIONS_URL        = NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarActions.json';
    public static AVATAR_ANIMATIONS_URL     = NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarAnimations.json';
    public static AVATAR_FIGUREDATA_URL     = NitroConfiguration.ASSET_URL + '/gamedata/figuredata.xml';
    public static AVATAR_FIGUREMAP_URL      = NitroConfiguration.ASSET_URL + '/gamedata/figuremap.xml';
    public static AVATAR_EFFECTMAP_URL      = NitroConfiguration.ASSET_URL + '/gamedata/effectmap.xml';
    public static AVATAR_ASSET_URL          = NitroConfiguration.ASSET_URL + '/figure/%libname%/%libname%.json';
    public static AVATAR_ASSET_EFFECT_URL   = NitroConfiguration.ASSET_URL + '/effect/%libname%/%libname%.json';
    public static FURNIDATA_URL             = NitroConfiguration.ASSET_URL + '/gamedata/json/FurnitureDataNGH.json';
    public static BADGE_URL                 = NitroConfiguration.ASSET_URL + '/badges/%badgename%.gif';
    public static GROUP_BADGE_URL           = NitroConfiguration.ASSET_URL + '/group-badge/%badgedata%';
    public static PET_ASSET_URL             = NitroConfiguration.ASSET_URL + '/pets/%libname%/%libname%.json';
    public static FURNI_ASSET_URL           = NitroConfiguration.ASSET_URL + '/furniture-ngh/%libname%/%libname%.json';
    public static ROOM_ASSET_URL            = NitroConfiguration.ASSET_URL + '/room/%libname%/%libname%.json';

    public static FPS                       = 24;
    public static PACKET_LOG                = false;
    public static EVENT_DISPATCHER_LOG      = false;
    public static ROLLING_OVERRIDES_POSTURE = true;

    public static PET_TYPES                 = [ 'dog', 'cat', 'croco', 'terrier', 'bear', 'pig', 'lion', 'rhino', 'spider', 'turtle', 'chicken', 'frog', 'dragon', 'monster', 'monkey', 'horse', 'monsterplant', 'bunnyeaster', 'bunnyevil', 'bunnydepressed', 'bunnylove', 'pigeongood', 'pigeonevil', 'demonmonkey', 'bearbaby', 'terrierbaby', 'gnome', 'gnome', 'kittenbaby', 'puppybaby', 'pigletbaby', 'haloompa', 'fools', 'pterosaur', 'velociraptor', 'cow', 'LeetPen', 'bbwibb', 'elephants' ];

    public static MANDATORY_AVATAR_LIBRARIES    = ['bd:1', 'li:0'];
    public static MANDATORY_EFFECT_LIBRARIES    = ['dance.1', 'dance.2', 'dance.3', 'dance.4'];

    public static PRELOAD_ASSETS: string[]  = [
        NitroConfiguration.ASSET_URL + `/room/room/room.json`,
        NitroConfiguration.ASSET_URL + `/room/tile_cursor/tile_cursor.json`,
        NitroConfiguration.ASSET_URL + `/room/place_holder/place_holder.json`,
        NitroConfiguration.ASSET_URL + `/room/place_holder_wall/place_holder_wall.json`,
        NitroConfiguration.ASSET_URL + `/room/place_holder_pet/place_holder_pet.json`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_blowkiss.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_left_1.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_left_2.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_right_1.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_idle_right_2.png`,
        NitroConfiguration.ASSET_URL + `/images/additions/user_typing.png`,
        NitroConfiguration.ASSET_URL + `/images/loading_icon.png`,
    ];
}