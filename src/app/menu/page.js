"use client";
import { useEffect, useState } from "react";
import ProductCard from "../components/menu/ProductCard";
import { useCartCount, useCartItems } from "../components/AppContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartCount();
  const { addItem } = useCartItems();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');


  const categories = [
    'Oyuncaklar',
    'Sağlık ve Veteriner Ürünleri',
    'Mama ve Besin Ürünleri',
    'Kafesler ve Barınaklar',
  ];

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const url = currentCategory 
          ? `/api/products?category=${currentCategory}`
          : '/api/products';
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentCategory]);

  function handleAddToCart(item) {
    addItem(item);
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">
        {currentCategory ? `${currentCategory} Menüsü` : 'Ürün Kategorileri'}
      </h1>
      
      {!currentCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center mt-4 max-w-xl mx-auto">
          {categories.map(cat => (
            <button
              key={cat}
              className="bg-orange-500 text-white rounded-lg px-3 py-4 text-xl font-semibold shadow-md hover:bg-orange-600 transition-all min-w-[180px]"
              onClick={() => router.push(`/menu?category=${encodeURIComponent(cat)}`)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {currentCategory && (
        <button
          className="mb-8 text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2"
          onClick={() => router.push('/menu')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kategorilere Dön
        </button>
      )}

      {currentCategory && (
        loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600">
            Bu kategoride henüz ürün bulunmamaktadır.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {products.map(item => (
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
        )
      )}
    </section>
  );
} 