import { DisposableContainer } from '../../core/common/disposable/DisposableContainer';
import { IRoomRenderer } from './IRoomRenderer';

export class RoomRenderer extends DisposableContainer implements IRoomRenderer
{
    constructor()
    {
        super();

        this.sortableChildren       = true;
        this.interactiveChildren    = false;
    }

    protected onDispose(): void
    {
        
    }
}