import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';

@Component({
    template: ''
})
export class ModTool
{
    @Input()
    public visible: boolean = false;

    @Output()
    public visibleChange = new EventEmitter<boolean>();

    public hideTool(): void
    {
        this.visible = false;
    }

    public getTranslatedForKey(nameKey: string, fallback: string): string
    {
        const newKey = `modtools.nitro.${nameKey}`;
        const value = Nitro.instance.localization.getValue(newKey);

        if(value !== newKey) return value;

        return fallback;
    }
}
