import { useState, useRef } from "react";
import { View, FlatList, SectionList,Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

import { useCartStore } from "@/stores/cart-store";
import { CATEGORIES, MENU, ProductProps} from "@/utils/data/products"

import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { CategoryButton } from "@/components/category-button";

export default function Home() {
    const cartStore = useCartStore();
    const [category, setCategory ] = useState(CATEGORIES[0]);
    const sectionListRef = useRef<SectionList<ProductProps>>(null);

    const cartQuantityItems = cartStore.products.reduce((total, product) => total + product.quantity, 0);

    function handleCategorySelect(selectedCategory: string) {
        setCategory(selectedCategory);

        const sectionIndex = CATEGORIES.findIndex((category) => category === selectedCategory);

        if(sectionListRef.current){
          sectionListRef.current.scrollToLocation({
            animated: true,
            sectionIndex,
            itemIndex: 0
          });
        }
    }

    return (
      <View className="flex-1 pt-8">
        <Header title="Faça seu pedido" cardQuantityItems={cartQuantityItems} />

        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryButton
              title={item}
              isSelected={item === category}
              onPress={() => handleCategorySelect(item)}
            />
          )}
          horizontal
          className="max-h-10 mt-5"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        />

        <SectionList
          sections={MENU}
          ref={sectionListRef}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          renderItem={({ item }) => (
            <Link href={`/product/${item.id}`} asChild>
              <TouchableOpacity>
                <Product className="text-white" data={item} />
              </TouchableOpacity>
            </Link>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-xl text-white font-heading mt-8 mb-3">
              {title}
            </Text>
          )}
          className="flex-1 p-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    );
}