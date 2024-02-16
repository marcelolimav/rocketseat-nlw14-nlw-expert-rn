import { useState } from "react";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from  "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons"

import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/data/functions/format-currency";
import { phoneApplyMask  } from "@/utils/data/mask";

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";

export default function Cart(){
    const [address, setAddress] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("+55 ");
    const navigation = useNavigation();
    const cartStore = useCartStore();
    
    const total = formatCurrency(
      cartStore.products.reduce(
        (total, product) => total + product.price * product.quantity, 
        0
      )
    );

    function ApplyMaskPhone(input: string) {
      setPhoneNumber(phoneApplyMask(input));
    }

    function handleOrder(){
      const PHONE_NUMBER = phoneNumber.replace(/\D/g, "");

      if (PHONE_NUMBER.trim().length !== 13){
        return Alert.alert("Pedido", "Informe o telefone completo para enviar o pedido.");
      }

      if (address.trim().length === 0) {
        return Alert.alert("Pedido", "Informe os dados da entrega.");
      }

      const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

      const message = `
      🍔 NOVO PEDIDO
      \nEntregar em: ${address}
      
      ${products}
      \nValor total: ${total}
      `;
        
      Linking.openURL(
        `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
      );
      cartStore.clear();
      navigation.goBack();

    }
    
    return (
      <View className="flex-1 pt-8">
        <Header title="Seu carrinho" />
        <KeyboardAwareScrollView>
          <ScrollView>
            <View className="p-5 flex-1">
              {cartStore.products.length > 0 ? (
                <View className="border-b border-slate-700">
                  {cartStore.products.map((product) => (
                    <Product key={product.id} data={product} />
                  ))}
                </View>
              ) : (
                <Text className="font-body text-slate-400 text-center my-8">
                  Seu carrinho está vazio.
                </Text>
              )}

              <View className="flex-row gap-2 items-center mt-5 mb-4">
                <Text className="text-white text-xl font-subtitle">Total</Text>
                <Text className="text-lime-400 text-2xl font-heading">
                  {total}
                </Text>
              </View>

              <Input
                className="h-10 mb-2 "
                textAlignVertical="center"
                placeholder="+55 (99) 9999-9999"
                onChangeText={ApplyMaskPhone}
                blurOnSubmit={true}
                keyboardType="phone-pad"
                value={phoneNumber}
              />

              <Input
                placeholder="Informe o endereço de entrega com rua, bairro, CEP número e complemento..."
                onChangeText={setAddress}
                blurOnSubmit={true}
                onSubmitEditing={handleOrder}
                returnKeyType="next"
              />
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>

        <View className="p-5 gap-5">
          <Button onPress={handleOrder}>
            <Button.Text>Enviar pedido</Button.Text>
            <Button.Icon>
              <Feather name="arrow-right-circle" size={20} />
            </Button.Icon>
          </Button>

          <LinkButton title="Voltar ao cardápio" href="/" />
        </View>
      </View>
    );
}