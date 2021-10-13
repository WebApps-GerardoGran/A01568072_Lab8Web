import React from "react";
import ProductInfo from "../../components/ProductInfo";
import ProductService from "../../services/ProductService";
import ProductHelper from "../../tools/ProductHelper";
import Product from "../../types/Product";
import Sku from "../../types/Sku";

interface ProductState {
    product: Product;
    helper: ProductHelper;
    colors: string[];
    selectedColor: string;
    sizes: string[];
    selectedSize: string;
    quantity: number;
    sku: Sku;
}

/**
 * Product Detail Container
 * @extends {Component<Props, State>}
 */
class ProductDetail extends React.Component<{}, ProductState> {
    state = {
        product: {} as Product,
        helper: {} as ProductHelper,
        colors: [] as string[],
        selectedColor: '',
        sizes: [] as string[],
        selectedSize: '',
        quantity: 1,
        sku: {} as Sku
    }

    /**
     * Renders the container.
     * @return {any} - HTML markup for the container
     */
    render() {
        return (
            <ProductInfo product={this.state.product} colors={this.state.colors} sizes={this.state.sizes} selectedColor={this.state.selectedColor} changedColor={this.changedColor} changedSize={this.changedSize} />
        )
    }

    componentDidMount() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const productId = Number(urlParams.get('productId'));

        ProductService.get(productId)
            .then(response => {
                const product = response.data;
                console.log(product);
                const helper = new ProductHelper(product);
                const colors = helper.getColors();
                let sizes = [] as string[];

                if (colors.length >= 1) {
                    sizes = helper.getSizes(colors[0]);
                }

                console.log("Sizes: " + sizes);
                console.log("Color:" + colors);

                this.setState({ product, helper, colors, selectedColor: colors[0], sizes });
            }).catch(error => {
                console.log(error);
            });
    }

    changedColor = (event: any) => {
        let target = event.currentTarget as HTMLSelectElement;
        let value = target.value;

        console.log("selectedColor: " + value);

        const helper = new ProductHelper(this.state.product);
        let newSizes = helper.getSizes(value);

        let selecetedSku = helper.getSku(value, newSizes[0]);

        this.setState({
            selectedColor: value,
            sizes: newSizes,
            sku: selecetedSku
        })

        console.log(this.state.sku);
    }

    changedSize = (event: any) => {
        let target = event.currentTarget as HTMLSelectElement;
        let value = target.value;

        console.log("selectedSize: " + value);

        const helper = new ProductHelper(this.state.product);

        let selecetedSku = helper.getSku(this.state.selectedColor, value);

        this.setState({
            selectedSize: value,
            sku: selecetedSku
        })

        console.log(this.state.sku);
    }
}

export default ProductDetail;