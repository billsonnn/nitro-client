import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { DisplayObject } from 'pixi.js';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../../client/nitro/room/preview/RoomPreviewer';
import { IRoomRenderingCanvas } from '../../../../client/room/renderer/IRoomRenderingCanvas';
import { ColorConverter } from '../../../../client/room/utils/ColorConverter';

@Component({
    selector: '[nitro-room-preview-component]',
    templateUrl: './room-preview.template.html'
})
export class RoomPreviewComponent implements OnDestroy, AfterViewInit
{
    @ViewChild('previewImage')
    public previewImage: ElementRef<HTMLDivElement>;

    @Input()
    public roomPreviewer: RoomPreviewer = null;

    @Input()
    public width: number = 1;

    @Input()
    public height: number = 1;

    public renderingCanvas: IRoomRenderingCanvas = null;
    public displayObject: DisplayObject = null;
    public imageUrl: string = null;
    public isRunning: boolean = false;

    constructor(
        private _elementRef: ElementRef<HTMLDivElement>,
        private ngZone: NgZone)
    {
        this.onClick = this.onClick.bind(this);
    }

    public ngOnDestroy(): void
    {
        this.stop();
    }

    public ngAfterViewInit(): void
    {
        if(!this.roomPreviewer) return;

        if(this.width === 1) this.width 	= (Math.trunc(this.previewImageElement.offsetWidth));
        if(this.height === 1) this.height	= (Math.trunc(this.previewImageElement.offsetHeight));

        this.previewImageElement.style.minWidth     = (this.width + 'px');
        this.previewImageElement.style.minHeight    = (this.height + 'px');

        if(this.roomPreviewer)
        {
            let backgroundColor = document.defaultView.getComputedStyle(this.previewImageElement, null)['backgroundColor'];

            backgroundColor = ColorConverter.rgbStringToHex(backgroundColor);
            backgroundColor = backgroundColor.replace('#', '0x');

            this.roomPreviewer.backgroundColor = parseInt(backgroundColor, 16);

            this.displayObject 		= this.roomPreviewer.getRoomCanvas(this.width, this.height);
            this.renderingCanvas	= this.roomPreviewer.getRenderingCanvas();
        }

        this.start();
    }

    public start(): void
    {
        if(this.isRunning) return;

        this.ngZone.runOutsideAngular(() =>
        {
            this.previewImageElement.addEventListener('click', this.onClick);

            Nitro.instance.ticker.add(this.update, this);
        });

        this.isRunning = true;
    }

    public stop(): void
    {
        if(!this.isRunning) return;

        this.ngZone.runOutsideAngular(() =>
        {
            this.previewImageElement.removeEventListener('click', this.onClick);

            Nitro.instance.ticker.remove(this.update, this);
        });

        this.isRunning = false;
    }

    public update(time: number): void
    {
        if(this.roomPreviewer && this.renderingCanvas && this.displayObject)
        {
            this.roomPreviewer.updatePreviewRoomView();

            if(this.renderingCanvas.canvasUpdated)
            {
                const imageUrl = Nitro.instance.renderer.extract.base64(this.displayObject);

                this.previewImageElement.style.backgroundImage = `url(${ imageUrl })`;
            }
        }
    }

    public onClick(event: MouseEvent): void
    {
        if(!event || !this.isRunning || !this.roomPreviewer) return;

        if(event.shiftKey)
        {
            this.roomPreviewer.changeRoomObjectDirection();
        }
        else
        {
            this.roomPreviewer.changeRoomObjectState();
        }
    }

    public get previewImageElement(): HTMLDivElement
    {
        return ((this.previewImage && this.previewImage.nativeElement) || null);
    }
}
