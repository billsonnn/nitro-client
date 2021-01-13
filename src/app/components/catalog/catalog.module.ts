import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { CatalogConfirmPurchaseComponent } from './components/confirm-purchase/confirm-purchase.component';
import { CatalogLayoutDefaultComponent } from './components/layouts/default/default.component';
import { CatalogLayoutFrontPageFeaturedComponent } from './components/layouts/frontpage-featured/frontpage-featured.component';
import { CatalogLayoutFrontPage4Component } from './components/layouts/frontpage4/frontpage4.component';
import { CatalogLayoutPetsComponent } from './components/layouts/pets/pets.component';
import { CatalogLayoutPets2Component } from './components/layouts/pets2/pets2.component';
import { CatalogLayoutSpacesNewComponent } from './components/layouts/spaces-new/spaces-new.component';
import { CatalogLayoutUnsupportedComponent } from './components/layouts/unsupported/unsupported.component';
import { CatalogMainComponent } from './components/main/main.component';
import { CatalogNavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { CatalogNavigationSetComponent } from './components/navigation-set/navigation-set.component';
import { CatalogNavigationComponent } from './components/navigation/navigation.component';
import { CatalogPurchaseComponent } from './components/purchase/purchase.component';
import { CatalogService } from './services/catalog.service';
import { CatalogLayoutPets3Component } from './components/layouts/pets3/pets3.component';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        CatalogConfirmPurchaseComponent,
        CatalogLayoutDefaultComponent,
        CatalogLayoutFrontPageFeaturedComponent,
        CatalogLayoutFrontPage4Component,
        CatalogLayoutPetsComponent,
        CatalogLayoutPets2Component,
        CatalogLayoutPets3Component,
        CatalogLayoutSpacesNewComponent,
        CatalogLayoutUnsupportedComponent,
        CatalogMainComponent,
        CatalogNavigationComponent,
        CatalogNavigationItemComponent,
        CatalogNavigationSetComponent,
        CatalogPurchaseComponent
    ],
    providers: [
        CatalogService
    ],
    declarations: [
        CatalogConfirmPurchaseComponent,
        CatalogLayoutDefaultComponent,
        CatalogLayoutFrontPageFeaturedComponent,
        CatalogLayoutFrontPage4Component,
        CatalogLayoutPetsComponent,
        CatalogLayoutPets2Component,
        CatalogLayoutPets3Component,
        CatalogLayoutSpacesNewComponent,
        CatalogLayoutUnsupportedComponent,
        CatalogMainComponent,
        CatalogNavigationComponent,
        CatalogNavigationItemComponent,
        CatalogNavigationSetComponent,
        CatalogPurchaseComponent
    ]
})
export class CatalogModule { }