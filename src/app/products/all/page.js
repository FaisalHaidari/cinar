"use client";
import { useEffect, useState } from "react";
import Right from "../../components/icons/Right";

export default function AllProductsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <section className="max-w-md mx-auto mt-8">
      <a href="/products" className="flex items-center gap-2 border rounded-xl px-8 py-3 font-semibold text-gray-700 bg-white hover:bg-gray-100 transition-all text-lg mb-6 w-full justify-center">
        <span>Mağazaya Yeni Ürün Ekle</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </a>
      <div className="text-gray-700 font-semibold mb-2">Mağaza Ürününü Düzenle:</div>
      <div className="flex flex-col gap-3">
        {items.length === 0 && <div className="text-gray-400">No items yet.</div>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-gray-100 rounded-xl p-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-300 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>
            <div className="flex-1 font-bold text-lg">{item.name}</div>
            <a
              href={`/products?edit=${item.id}`}
              className="border border-orange-400 text-orange-500 rounded-xl px-4 py-1 font-semibold hover:bg-orange-50 transition-all text-sm"
            >
              Düzenle
            </a>
          </div>
        ))}
      </div>
    </section>
  );
} 