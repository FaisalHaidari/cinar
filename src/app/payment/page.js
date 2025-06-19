"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handlePay(e) {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) {
      alert("Lütfen tüm kart bilgilerini doldurun!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/"), 2500);
    }, 1800);
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">Kart ile Ödeme</h1>
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        {success ? (
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <div className="text-xl font-bold text-green-600 mb-2">Ödeme Başarılı!</div>
            <div className="text-gray-500">Siparişiniz alındı. Anasayfaya yönlendiriliyorsunuz...</div>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handlePay}>
            <input type="hidden" value={orderId || ""} readOnly />
            <label className="text-sm font-medium text-gray-700">Kart Üzerindeki İsim</label>
            <input
              type="text"
              className="border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ad Soyad"
              required
            />
            <label className="text-sm font-medium text-gray-700">Kart Numarası</label>
            <input
              type="text"
              className="border rounded px-3 py-2"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Son Kullanma</label>
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="AA/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="password"
                  className="border rounded px-3 py-2"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-orange-500 text-white rounded-lg py-3 text-lg font-bold hover:bg-orange-600 transition-all"
              disabled={loading}
            >
              {loading ? "Ödeme İşleniyor..." : "Ödeme Yap"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
} 