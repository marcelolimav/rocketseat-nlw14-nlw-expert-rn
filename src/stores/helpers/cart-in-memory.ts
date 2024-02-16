import { ProductProps } from "@/utils/data/products";
import { ProductCartProps } from "../cart-store";

export function add(products: ProductCartProps[], newProduct: ProductProps, quantityAdd: number ){
    const existingProduct = products.find(({id}) => newProduct.id === id);
    if(existingProduct){
        return products.map((product) =>
          product.id === existingProduct.id
            ? { ...product, quantity: product.quantity + quantityAdd }
            : product
        );
    }

    return [...products, { ...newProduct, quantity: quantityAdd }];
}

export function remove(
  products: ProductCartProps[],
  productRemovedId: string,
  quantityRemove: number
) {
  const updatedProducts = products.map((product) =>
    product.id === productRemovedId
      ? {
          ...product,
          quantity:
            product.quantity > 1 ? product.quantity - quantityRemove : 0,
        }
      : product
  );

  return updatedProducts.filter((product) => product.quantity > 0);
}
