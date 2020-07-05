import { WindowTemplates } from '../../../window/WindowTemplates';
import { ContextInfoView } from './ContextInfoView';
import { IContextMenuParentWidget } from './IContextMenuParentWidget';

export class ButtonMenuView extends ContextInfoView
{
    protected _buttonContainer: HTMLElement;

    constructor(parent: IContextMenuParentWidget)
    {
        super(parent);
    }

    protected buildButtons(): void
    {
        if(!this._window) return;

        if(this._buttonContainer)
        {
            this._buttonContainer.innerHTML = null;
        }

        if(!this._buttonContainer)
        {
            const element = (this._window.getElementsByClassName('button-container')[0] as HTMLElement);

            if(element)
            {
                this._buttonContainer = element;

                this._buttonContainer.onclick       = event => this.handleMouseEvent(event);
                this._buttonContainer.onmousedown   = event => this.handleMouseEvent(event);
                this._buttonContainer.onmouseover   = event => this.handleMouseEvent(event);
                this._buttonContainer.onmouseup     = event => this.handleMouseEvent(event);
            }
        }
    }

    protected addButton(name: string, visible: boolean = true): void
    {
        if(!this._buttonContainer || !visible) return;

        const template = this._parent.windowManager.getTemplate(WindowTemplates.CONTEXT_MENU_BUTTON);

        if(!template) return;

        const view = {
            itemName: name,
            itemNameLocalized: name
        }

        const button = this._parent.windowManager.renderElement(template, view);

        this._buttonContainer.appendChild(button);
    }

    protected handleMouseEvent(event: MouseEvent): void
    {
        
    }

    public dispose(): void
    {
        super.dispose();
    }
}