import { EventDispatcher } from '../../../core/events/EventDispatcher';
import { NitroEvent } from '../../../core/events/NitroEvent';
import { IProductData } from './IProductData';

export class ProductDataParser extends EventDispatcher
{
    public static PDP_PRODUCT_DATA_READY: string = 'PDP_PRODUCT_DATA_READY';
    public static PDP_PRODUCT_DATA_FAILED: string = 'PDP_PRODUCT_DATA_FAILED';

    private _products: Map<string, IProductData>;

    constructor(products: Map<string, IProductData>)
    {
        super();

        this._products = products;
    }

    public dispose(): void
    {
        this._products = null;
    }

    public loadProductData(url: string): void
    {
        if(!url) return;

        fetch(url)
            .then(response => response.json())
            .then(data => this.onProductDataLoadedEvent(data))
            .catch(err => this.onProductDataError(err));
    }

    private onProductDataLoadedEvent(data: { [index: string]: any }): void
    {
        if(!data) return;

        this.dispatchEvent(new NitroEvent(ProductDataParser.PDP_PRODUCT_DATA_READY));
    }

    private onProductDataError(error: Error): void
    {
        if(!error) return;

        this.dispatchEvent(new NitroEvent(ProductDataParser.PDP_PRODUCT_DATA_FAILED));
    }
}
