export class Direction
{
    public static NORTH         = 0;
    public static NORTH_EAST    = 1;
    public static EAST          = 2;
    public static SOUTH_EAST    = 3;
    public static SOUTH         = 4;
    public static SOUTH_WEST    = 5;
    public static WEST          = 6;
    public static NORTH_WEST    = 7;

    public static DEFAULT_ANGLE = 45;

    public static directionToAngle(direction: number): number
    {
        return direction * Direction.DEFAULT_ANGLE;
    }

    public static angleToDirection(angle: number): number
    {
        return angle / Direction.DEFAULT_ANGLE;
    }

    public static convertWithOffset(direction: number, offset: number = 0): number
    {
        return ((direction + offset) % 8);
    }
}