import { ContextInfoView } from './ContextInfoView';
import { IContextMenuParentWidget } from './IContextMenuParentWidget';

export class ButtonMenuView extends ContextInfoView
{
    constructor(parent: IContextMenuParentWidget)
    {
        super(parent);
    }

    public dispose():void
    {
        super.dispose();
    }
}