import { forwardRef } from "react";
import {
  Alert,
  Image,
  ImageProps,
  Text,
  ViewProps,
  View,
} from "react-native";
import { Button } from "./button";
import { Feather } from "@expo/vector-icons";
import { useCartStore } from "@/stores/cart-store";
import { ProductProps } from "@/utils/data/products";

import { formatCurrency } from "@/utils/data/functions/format-currency";
import { OperationProps } from "@/types/general";

type ProductPropsView = ViewProps & {
  data: ProductProps;
};

export const Product = forwardRef<View, ProductPropsView>(
  ({ data, ...rest }, ref) => {
    const cartStore = useCartStore();

    function handleProductRemove(product: ProductProps) {
      if (product.quantity) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
          {
            text: "Cancelar",
          },
          {
            text: "Remover",
            onPress: () => cartStore.remove(product.id, product.quantity || 1),
          },
        ]);
      }
    }

    function handleProductQuantity(
      product: ProductProps,
      operation: OperationProps
    ) {
      if (operation === "minus") {
        cartStore.remove(product.id, 1);
      } else {
        cartStore.add(product, 1);
      }
    }

    return (
      <View ref={ref} className="w-full flex-row items-center pb-6" {...rest}>
        <Image source={data.thumbnail} className="w-20 h-20 rounded-full" />

        <View className="flex-1 ml-3">
          <View className="flex-row items-center ">
            <Text className="text-slate-100 font-subtitle text-base flex-1">
              {data.title}
            </Text>

            <Text className="text-slate-400 font-subtitle text-sm">
              {formatCurrency(data.price)}
            </Text>
          </View>

          <Text className="text-slate-400 text-xs leading-5 mt-0.5 mb-1">
            {data.description}
          </Text>

          {data.quantity > 0 && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row gap-3 items-center justify-center ">
                <Button
                  className="h-8 w-8"
                  onPress={() => handleProductQuantity(data,"minus")}
                >
                  <Button.Icon>
                    <Feather name="minus" size={20} />
                  </Button.Icon>
                </Button>

                <Text className=" text-white font-subtitle">
                  {data.quantity}
                </Text>

                <Button 
                  className="h-8 w-8" 
                  onPress={() => handleProductQuantity(data,"sum")}
                >
                  <Button.Icon>
                    <Feather name="plus" size={20} />
                  </Button.Icon>
                </Button>

                <Button
                  className="h-8 w-8 bg-red-500"
                  onPress={() => handleProductRemove(data)}
                >
                  <Button.Icon>
                    <Feather name="trash" size={20} />
                  </Button.Icon>
                </Button>
              </View>

              <Text className="text-slate-400 font-subtitle text-sm">
                {formatCurrency(data.price * data.quantity)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);