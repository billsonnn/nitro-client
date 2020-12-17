import { CatalogLayout } from './CatalogLayout';
import { CatalogLayoutDefaultComponent } from './components/layouts/default/default.component';
import { CatalogLayoutFrontPageFeaturedComponent } from './components/layouts/frontpage-featured/frontpage-featured.component';
import { CatalogLayoutFrontPage4Component } from './components/layouts/frontpage4/frontpage4.component';
import { CatalogLayoutPetsComponent } from './components/layouts/pets/pets.component';
import { CatalogLayoutPets2Component } from './components/layouts/pets2/pets2.component';
import { CatalogLayoutSpacesNewComponent } from './components/layouts/spaces-new/spaces-new.component';
import { CatalogLayoutUnsupportedComponent } from './components/layouts/unsupported/unsupported.component';

export class CatalogLayoutFactory
{
    public getLayoutForType(type: string): typeof CatalogLayout
    {
        switch(type)
        {
            case CatalogLayoutFrontPageFeaturedComponent.CODE:
                return CatalogLayoutFrontPageFeaturedComponent;
            case CatalogLayoutFrontPage4Component.CODE:
                return CatalogLayoutFrontPage4Component;
            case CatalogLayoutPetsComponent.CODE:
                return CatalogLayoutPetsComponent;
            case CatalogLayoutPets2Component.CODE:
                return CatalogLayoutPets2Component;
            case CatalogLayoutSpacesNewComponent.CODE:
                return CatalogLayoutSpacesNewComponent;
            case CatalogLayoutDefaultComponent.CODE:
                return CatalogLayoutDefaultComponent;
            default:
                return CatalogLayoutUnsupportedComponent;
        }
    }
}