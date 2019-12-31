export class AvatarBodyPart
{
    public static BODY                      = 'bd';
    public static SHOES                     = 'sh';
    public static LEGS                      = 'lg';
    public static CHEST                     = 'ch';
    public static WAIST_ACCESSORY           = 'wa';
    public static CHEST_ACCESSORY           = 'ca';
    public static HEAD                      = 'hd';
    public static HAIR                      = 'hr';
    public static FACE_ACCESSORY            = 'fa';
    public static EYE_ACCESSORY             = 'ea';
    public static HEAD_ACCESSORY            = 'ha';
    public static HEAD_ACCESSORY_EXTRA      = 'he';
    public static COAT_CHEST                = 'cc';
    public static CHEST_PRINT               = 'cp';
    public static LEFT_HAND_ITEM            = 'li';
    public static LEFT_HAND                 = 'lh';
    public static LEFT_SLEEVE               = 'ls';
    public static RIGHT_HAND                = 'rh';
    public static RIGHT_SLEEVE              = 'rs';
    public static FACE                      = 'fc';
    public static EYES                      = 'ey';
    public static HAIR_BIG                  = 'hrb';
    public static RIGHT_HAND_ITEM           = 'ri';
    public static LEFT_COAT_SLEEVE          = 'lc';
    public static RIGHT_COAT_SLEEVE         = 'rc';
    public static SHADOW                    = 'sd';
    
    public static BODY_PARTS                = [ AvatarBodyPart.HEAD, AvatarBodyPart.BODY, AvatarBodyPart.LEFT_HAND, AvatarBodyPart.RIGHT_HAND ];
    public static HEAD_PARTS                = [ AvatarBodyPart.HEAD, AvatarBodyPart.HEAD_ACCESSORY, AvatarBodyPart.HEAD_ACCESSORY_EXTRA, AvatarBodyPart.HAIR, AvatarBodyPart.HAIR_BIG, AvatarBodyPart.EYES, AvatarBodyPart.EYE_ACCESSORY, AvatarBodyPart.FACE, AvatarBodyPart.FACE_ACCESSORY ];
    public static TORSO_PARTS               = [ AvatarBodyPart.BODY, AvatarBodyPart.CHEST, AvatarBodyPart.SHOES, AvatarBodyPart.LEGS, AvatarBodyPart.CHEST_PRINT, AvatarBodyPart.WAIST_ACCESSORY, AvatarBodyPart.COAT_CHEST, AvatarBodyPart.CHEST_ACCESSORY ];
    public static LEFT_ARM_PARTS            = [ AvatarBodyPart.LEFT_HAND, AvatarBodyPart.LEFT_SLEEVE, AvatarBodyPart.LEFT_COAT_SLEEVE ];
    public static RIGHT_ARM_PARTS           = [ AvatarBodyPart.RIGHT_HAND, AvatarBodyPart.RIGHT_SLEEVE, AvatarBodyPart.RIGHT_COAT_SLEEVE ];
}