import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    template: ''
})
export class ModTool implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    constructor()
    {}

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public hideTool(): void
    {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
