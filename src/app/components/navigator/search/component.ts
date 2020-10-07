import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigatorService } from '../service';
import { INavigatorSearchFilter } from './INavigatorSearchFilter';

@Component({
    selector: '[nitro-navigator-search-component]',
    template: `
    <form [formGroup]="form" novalidate>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <div class="btn-group" ngbDropdown>
                    <button class="btn btn-light btn-sm" ngbDropdownToggle>{{ ('navigator.filter.' + this.currentFilter.name) | translate }}</button>
                    <div class="dropdown-menu" ngbDropdownMenu>
                        <button *ngFor="let filter of searchFilters" ngbDropdownItem (click)="changeFilter(filter)">{{ ('navigator.filter.' + filter.name) | translate }}</button>
                    </div>
                </div>
            </div>
            <input type="text" class="form-control form-control-sm" formControlName="search" [placeholder]="('navigator.filter.input.placeholder') | translate" (keydown.enter)="search($event)">
            <i class=""></i>
        </div>
    </form>`
})
export class NavigatorSearchComponent implements OnInit
{
    private _form: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _navigatorService: NavigatorService) {}

    public ngOnInit(): void
    {
        this._form = this._formBuilder.group({
            search: [ null ]
        });
    }

    public changeFilter(filter: INavigatorSearchFilter): void
    {
        this._navigatorService.setCurrentFilter(filter);
    }

    public search(event: KeyboardEvent): void
    {
        event.preventDefault();

        this.performSearch();
    }

    public clearSearch(): void
    {

    }

    private performSearch(): void
    {
        const formControl = this._form.controls['search'];

        if(!formControl) return;

        const value = formControl.value;

        this._navigatorService.search(value);
    }

    public get form(): FormGroup
    {
        return this._form;
    }

    public get currentFilter(): INavigatorSearchFilter
    {
        return this._navigatorService.filter;
    }

    public get searchFilters(): INavigatorSearchFilter[]
    {
        return NavigatorService.SEARCH_FILTERS;
    }

    public get hasSearchResults(): boolean
    {
        return (this._navigatorService.lastSearchResults && this._navigatorService.lastSearchResults.length > 0);
    }
}