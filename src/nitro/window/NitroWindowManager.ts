import Mustache from 'mustache';
import { NitroManager } from '../../core/common/NitroManager';
import { INitroWindowManager } from './INitroWindowManager';

export class NitroWindowManager extends NitroManager implements INitroWindowManager
{
    private _window: HTMLDivElement;

    constructor()
    {
        super();

        this._window = null;

        this.setupWindow();
    }

    public onDispose(): void
    {
        if(this._window)
        {
            this._window.remove();

            this._window = null;
        }
    }

    private setupWindow(): void
    {
        if(this._window) return;

        this._window = document.createElement('div');

        this._window.className = 'nitro-widget-container';

        document.body.append(this._window);

        this.resize();
    }

    public resize(): void
    {
        if(!this._window) return;

        this._window.style.width    = '100%';
        this._window.style.height   = '100%';
    }

    public createElement(): HTMLDivElement
    {
        const element = document.createElement('div');

        if(!element) return null;

        this.addElement(element);

        return element;
    }

    public buildElementFromTemplate(template: string): HTMLDivElement
    {
        if(!template) return null;

        const element = this.createElement();

        element.addEventListener('click', () => console.log('test'));
    }

    public renderElement(element: HTMLElement, template: string, view: {}): void
    {
        if(!element || !template) return;

        element.innerHTML = Mustache.render(template, view);
    }

    private addElement(element: HTMLElement): void
    {
        if(this._window)
        {
            this._window.append(element);

            return;
        }

        document.body.append(element);
    }
}