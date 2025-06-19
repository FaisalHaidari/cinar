import Image from "next/image";

export default function ProductCard({ image, name, ingredients, price, onAddToCart }) {
  return (
    <div className="bg-gray-100 rounded-xl flex flex-col items-center p-4 w-72 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-black/20">
      <div className="w-32 h-32 rounded-lg overflow-hidden mb-2">
        <Image src={image} alt={name} width={128} height={128} className="object-cover w-full h-full" />
      </div>
      <div className="font-bold text-xl mb-1 text-center">{name}</div>
      <div className="text-gray-500 text-center text-base mb-4 leading-tight">
        {ingredients}
      </div>
      <button
        className="bg-orange-500 text-white w-full rounded-full py-2 font-semibold text-base hover:bg-orange-600 transition-all"
        onClick={onAddToCart}
      >
        Sepete Ekle {price} ₺
      </button>
    </div>
  );
} 