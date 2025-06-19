"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNewOrders } from "../components/AppContext";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setNewOrdersCount } = useNewOrders();

  useEffect(() => {
    async function fetchOrders() {
      if (status === "loading") return;

      if (status === "unauthenticated" || !session?.user?.admin) {
        setLoading(false);
        router.push('/'); // Redirect non-admin or unauthenticated users
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          
          // Mark all orders as viewed
          if (data.orders.some(order => order.isNew)) {
            await fetch('/api/orders/mark-all-viewed', {
              method: 'POST',
            });
            // Update the new orders count in context
            setNewOrdersCount(0);
          }
        } else {
          console.error("Failed to fetch orders:", data.error);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [session, status, router, setNewOrdersCount]);

  if (loading) {
    return <div className="text-center py-12">Siparişler yükleniyor...</div>;
  }

  if (status === "unauthenticated" || !session?.user?.admin) {
    return null; // Redirect handled in useEffect
  }

  return (
    <section className="py-12">
      <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">Tüm Siparişler</h1>
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">Henüz sipariş yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Sipariş Numarası</th>
                  <th className="py-3 px-6 text-left">Kullanıcı E-postası</th>
                  <th className="py-3 px-6 text-left">Toplam Tutar</th>
                  <th className="py-3 px-6 text-left">Adres</th>
                  <th className="py-3 px-6 text-left">Tarih</th>
                  <th className="py-3 px-6 text-left">İşlemler</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap flex items-center gap-2">
                      #{order.id}
                      {order.isNew && (
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Yeni Sipariş"></span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">{order.user?.email || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">{order.total} TL</td>
                    <td className="py-3 px-6 text-left">
                      {order.street}, {order.buildingNo}, {order.floor && `Kat: ${order.floor},`} {order.apartmentNo && `Daire: ${order.apartmentNo},`} {order.city}, {order.country}
                    </td>
                    <td className="py-3 px-6 text-left">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => router.push(`/order/${order.id}`)}
                        className="bg-orange-500 text-white rounded-lg px-4 py-2 text-xs font-bold hover:bg-orange-600 transition-all"
                      >
                        Detayları Görüntüle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
} 