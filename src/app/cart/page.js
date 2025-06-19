"use client"
import { useCartItems } from "../components/AppContext";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, removeItem, increaseQuantity, decreaseQuantity, clearCart } = useCartItems();
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  // Checkout form state
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [floor, setFloor] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [description, setDescription] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold text-orange-500 mb-4">Sepeti görüntülemek için giriş yapmalısınız</h1>
        <button
          onClick={() => router.push('/login')}
          className="bg-orange-500 text-white rounded-lg px-8 py-3 text-lg font-bold hover:bg-orange-600 transition-all"
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  async function handleOrder() {
    if (!phone || !street || !buildingNo || !floor || !apartmentNo || cartItems.length === 0) {
      alert('Lütfen tüm zorunlu alanları doldurun ve en az bir ürün seçin!');
      return;
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems,
        phone,
        street,
        buildingNo,
        floor,
        apartmentNo,
        description,
        postalCode,
        city,
        country,
        total
      })
    });
    const data = await res.json();
    if (data.success) {
      router.push(`/payment?orderId=${data.order.id}`);
      // Sepet temizleme işlemini ödeme sayfasına yönlendirdikten sonra yap
      setTimeout(() => {
        clearCart();
      }, 100);
    } else {
      alert('Sipariş kaydedilemedi!');
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">Sepet</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Sepetiniz boş.</p>
      ) : (
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start">
          {/* Cart Items (unchanged) */}
          <div className="flex-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center bg-white rounded-2xl shadow p-6 mb-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-full" />
                )}
                <div className="flex-1 ml-4">
                  <div className="font-bold text-xl text-right">{item.name}</div>
                  <div className="text-gray-500 text-right">{item.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(idx)}
                    className="bg-gray-200 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-300"
                  >-</button>
                  <span className="font-bold w-6 text-center">{item.quantity || 1}</span>
                  <button
                    onClick={() => increaseQuantity(idx)}
                    className="bg-gray-200 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-300"
                  >+</button>
                  <span className="font-bold text-orange-500 text-lg w-20 text-center">{item.price} TL</span>
                  <button
                    onClick={() => removeItem(idx)}
                    className="border border-orange-200 text-red-500 hover:bg-orange-50 rounded-lg flex items-center justify-center w-7 h-7 ml-2 p-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5V19a2 2 0 002 2h8a2 2 0 002-2V7.5M4 7.5h16M10 11v6M14 11v6M9 7.5V5a2 2 0 012-2h2a2 2 0 012 2v2.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <span className="text-2xl font-bold text-orange-500">Toplam: {total} TL</span>
            </div>
          </div>
          {/* Checkout Form (modern, Turkish) */}
          <form className="flex-1 bg-gray-50 rounded-lg shadow p-6 flex flex-col gap-3 min-w-[320px] max-w-sm">
            <div className="font-bold text-lg mb-2">Ödeme</div>
            <label className="text-sm text-gray-600">Telefon</label>
            <input type="text" className="border rounded px-3 py-2" value={phone} onChange={e => setPhone(e.target.value)} />
            <label className="text-sm text-gray-600">Mahalle / Cadde / Sokak</label>
            <input type="text" className="border rounded px-3 py-2" value={street} onChange={e => setStreet(e.target.value)} />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Bina No</label>
                <input type="text" className="border rounded px-3 py-2 w-full" value={buildingNo} onChange={e => setBuildingNo(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Kat</label>
                <input type="text" className="border rounded px-3 py-2 w-full" value={floor} onChange={e => setFloor(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Daire No</label>
                <input type="text" className="border rounded px-3 py-2 w-full" value={apartmentNo} onChange={e => setApartmentNo(e.target.value)} />
              </div>
            </div>
            <label className="text-sm text-gray-600">Adres Tarifi (örn: Taksi durağının karşısı)</label>
            <input type="text" className="border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
            <button type="button" className="mt-4 bg-orange-500 text-white rounded-lg py-3 text-lg font-bold hover:bg-orange-600 transition-all" onClick={handleOrder}>
              {`Öde ${total} TL`}
            </button>
          </form>
        </div>
      )}
    </section>
  );
} 