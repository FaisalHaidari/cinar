"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId || status === "loading") return;

      if (status === "unauthenticated") {
        setLoading(false);
        return; // Redirect to login or show unauthorized message
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          console.error("Failed to fetch order:", data.error);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, session, status]);

  if (loading) {
    return <div className="text-center py-12">Sipariş yükleniyor...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="text-center py-12 text-red-500">Bu siparişi görüntülemek için giriş yapmalısınız.</div>;
  }

  if (!order) {
    return <div className="text-center py-12 text-red-500">Sipariş bulunamadı.</div>;
  }

  return (
    <section className="py-12">
      <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">Sipariş Detayları</h1>
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sipariş #{order.id}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-medium mb-2 text-orange-600">Teslimat Adresi</h3>
            <p className="text-gray-700"><strong>Telefon:</strong> {order.phone}</p>
            <p className="text-gray-700"><strong>Adres:</strong> {order.street}, Bina No: {order.buildingNo}</p>
            <p className="text-gray-700"><strong>Kat:</strong> {order.floor}, Daire No: {order.apartmentNo}</p>
            {order.description && <p className="text-gray-700"><strong>Tarif:</strong> {order.description}</p>}
            {order.postalCode && <p className="text-gray-700"><strong>Posta Kodu:</strong> {order.postalCode}</p>}
            {order.city && <p className="text-gray-700"><strong>Şehir:</strong> {order.city}</p>}
            {order.country && <p className="text-gray-700"><strong>Ülke:</strong> {order.country}</p>}
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2 text-orange-600">Sipariş Özeti</h3>
            <p className="text-gray-700"><strong>Toplam Tutar:</strong> {order.total} TL</p>
            <p className="text-gray-700"><strong>Sipariş Tarihi:</strong> {new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
          </div>
        </div>

        <h3 className="text-xl font-medium mb-3 text-orange-600">Sipariş Edilen Ürünler</h3>
        <div className="border-t border-gray-200 pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div className="text-gray-700">
                <span className="font-semibold">{item.quantity}x</span> {item.product.name}
              </div>
              <div className="text-orange-500 font-bold">{item.price} TL</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
