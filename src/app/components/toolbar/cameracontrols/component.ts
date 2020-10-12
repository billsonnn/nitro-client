import { Component, NgZone } from '@angular/core';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomGeometry } from '../../../../client/room/utils/RoomGeometry';
import { Vector3d } from '../../../../client/room/utils/Vector3d';

@Component({
	selector: '[nitro-toolbar-cameracontrols-component]',
    template: `
    <div *ngIf="visible" class="nitro-toolbar-cameracontrols-component">
        <div class="card">
            <div class="card-header">
                <div class="header-title">Camera</div>
            </div>
            <div class="card-body">
                <ul #navigationList class="list-group">
                    <li class="list-group-item" (click)="rotateLeft()">Rotate Left</li>
                    <li class="list-group-item" (click)="rotateRight()">Rotate Right</li>
                    <li class="list-group-item" (click)="tiltUp()">Tilt Up</li>
                    <li class="list-group-item" (click)="tiltDown()">Tilt Down</li>
                    <li class="list-group-item" (click)="zoomIn()">Zoom In</li>
                    <li class="list-group-item" (click)="zoomOut()">Zoom Out</li>
                </ul>
            </div>
        </div>
    </div>`
})
export class CameraControlsComponent
{
    private static VALID_DIRECTIONS_X = [ 0, -45, -90, -135, -180, -225, -270, -315 ];

    public visible = false;

    constructor(
        private ngZone: NgZone) {}

    private adjustDirection(x: number, y: number): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            const geometry  = this.getGeometry();

            if(!geometry) return;

            const adjustment        = new Vector3d(x, y);
            const adjustedDirection = Vector3d.sum(geometry.direction, adjustment);

            let index = CameraControlsComponent.VALID_DIRECTIONS_X.indexOf(adjustedDirection.x);

            if(x > 0)
            {
                if(index === -1) adjustedDirection.x = CameraControlsComponent.VALID_DIRECTIONS_X[0];
            }

            else if(x < 0)
            {
                if(index === -1) adjustedDirection.x = CameraControlsComponent.VALID_DIRECTIONS_X[(CameraControlsComponent.VALID_DIRECTIONS_X.length - 1)];
            }

            geometry.direction = adjustedDirection;
            geometry.setDepthVector(new Vector3d(adjustedDirection.x, 0.5, 0));
        });
    }

    public rotateLeft(): void
    {
        this.adjustDirection(45, 0);
    }

    public rotateRight(): void
    {
        this.adjustDirection(-45, 0);
    }

    public tiltUp(): void
    {
        this.adjustDirection(0, -1);
    }

    public tiltDown(): void
    {
        this.adjustDirection(0, 1);
    }

    public zoomIn(): void
    {

    }

    public zoomOut(): void
    {

    }

    public topDown(): void
    {
        
    }

    private getGeometry(): RoomGeometry
    {
        const geometry = (Nitro.instance.roomEngine.getRoomInstanceGeometry(Nitro.instance.roomEngine.activeRoomId) as RoomGeometry);

        if(!geometry) return null;

        return geometry;
    }
}