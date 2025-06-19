"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductCard from "../menu/ProductCard";
import { useCartItems } from "../AppContext";

export default function HomeMenu() {
  const [items, setItems] = useState([]);
  const { addItem } = useCartItems();

  useEffect(() => {
    fetch("/api/products?category=Yiyecek")
      .then(res => res.json())
      .then(data => setItems(data.slice(0, 6)));
  }, []);

  function handleAddToCart(item) {
    addItem(item);
  }

  return (
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(item => (
          <ProductCard
            key={item.id}
            image={item.image || "/ekmekarasi.jpeg"}
            name={item.name}
            ingredients={item.description}
            price={item.price}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>
    </section>
  );
}