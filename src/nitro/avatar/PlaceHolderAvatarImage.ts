import { AvatarImage } from './AvatarImage';

export class PlaceHolderAvatarImage extends AvatarImage
{
    public isPlaceholder(): boolean
    {
        return true;
    }
}