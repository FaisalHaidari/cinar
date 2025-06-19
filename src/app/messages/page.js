"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace("/");
    }
    if (status === 'authenticated') {
      fetch("/api/profile").then(res => res.json()).then(data => {
        setIsAdmin(!!data?.admin);
      });
      fetch("/api/messages")
        .then(res => res.json())
        .then(data => setMessages(data));
    }
    fetch("/api/users?admin=1")
      .then(res => res.json())
      .then(data => setAdminId(data[0]?.id));
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: session.user.id })
      }).then(() => {
        fetch('/api/messages')
          .then(res => res.json())
          .then(data => setMessages(data));
      });
    }
  }, [status, session]);

  if (isAdmin) return null;

  async function handleSend(e) {
    e.preventDefault();
    if (!content.trim() || !adminId) return;
    setLoading(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: adminId, content, isToAdmin: true })
    });
    setContent("");
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
    setLoading(false);
  }

  // Yöneticiden kullanıcıya gelen mesajları filtrele
  const adminMessages = messages.filter(
    msg => msg.sender?.admin && msg.receiverId === session?.user?.id
  );

  return (
    <section className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Mesajlarım</h1>
      {status !== 'authenticated' ? null : (
        <>
          <div className="bg-white rounded-lg shadow p-4 mb-4 max-h-96 overflow-y-auto flex flex-col gap-2">
            {adminMessages.length === 0 && <div className="text-gray-400">Henüz yönetici mesajı yok.</div>}
            {adminMessages.map((msg, idx) => (
              <div key={idx} className="p-2 rounded bg-orange-50 text-right">
                <div className="text-sm text-gray-600 mb-1">Yönetici</div>
                <div>{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString("tr-TR")}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              className="w-full border rounded px-6 py-3 text-lg"
              placeholder="Mesajınızı yazın..."
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-orange-500 text-white rounded-full w-28 px-2 py-0 font-bold hover:bg-orange-600"
              disabled={loading || !content.trim()}
            >Gönder</button>
          </form>
          {sentSuccess && (
            <div className="text-green-500 mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Mesaj gönderildi!
            </div>
          )}
        </>
      )}
    </section>
  );
} 