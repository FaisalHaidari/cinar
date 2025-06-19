"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteMsg, setDeleteMsg] = useState("");
  // Her kullanıcı için okunmamış mesaj sayısı
  const [userUnreadCounts, setUserUnreadCounts] = useState({});

  // Sadece kimliği doğrulanmış ve yöneticiyse göster
  if (status !== 'authenticated' || !session?.user?.admin) return null;

  useEffect(() => {
    fetch("/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => !u.admin)));
  }, []);

  // Kullanıcı seçildiğinde okunmamış mesajları okundu olarak işaretle
  useEffect(() => {
    if (selectedUser) {
      fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id })
      }).then(() => {
        fetch("/api/messages")
          .then(res => res.json())
          .then(data => setMessages(data));
      });
    }
  }, [selectedUser]);

  // Sadece yöneticiden kullanıcıya gelen mesajları göster
  const userMessages = selectedUser
    ? messages.filter(m =>
        (m.senderId === selectedUser.id && m.receiverId !== selectedUser.id) ||
        (m.receiverId === selectedUser.id && m.senderId !== selectedUser.id)
      )
    : [];

  // Her kullanıcı için okunmamış mesaj sayısı
  function unreadCount(userId) {
    return messages.filter(m => m.senderId === userId && !m.read).length;
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!content.trim() || !selectedUser) return;
    setLoading(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedUser.id, content, isToAdmin: false })
    });
    setContent("");
    fetch("/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
    setLoading(false);
  }

  if (users.length === 0) {
    return (
      <section className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4 text-orange-500">Kullanıcı Mesajları (Yönetici)</h1>
        <div className="text-gray-400 text-center py-12">Hiç kullanıcı yok.</div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Kullanıcı Mesajları (Yönetici)</h1>
      {deleteMsg && (
        <div className="mb-4 text-green-600 bg-green-50 border border-green-200 rounded p-2 text-center transition-all duration-500">{deleteMsg}</div>
      )}
      <div className="flex gap-6">
        <div className="w-1/3">
          <div className="font-bold mb-2">Kullanıcılar</div>
          <ul className="bg-white rounded-lg shadow p-2 max-h-96 overflow-y-auto">
            {users.map(user => (
              <li
                key={user.id}
                className={`p-2 rounded cursor-pointer mb-1 flex items-center justify-between ${selectedUser?.id === user.id ? "bg-orange-100 font-bold" : "hover:bg-gray-100"}`}
                onClick={() => setSelectedUser(user)}
              >
                <span>{user.name || user.email}</span>
                <div className="flex items-center gap-2">
                  {unreadCount(user.id) > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">{unreadCount(user.id)}</span>
                  )}
                  <button
                    className="ml-2 text-gray-400 hover:text-red-600"
                    title="Bu kullanıcının tüm mesajlarını sil"
                    onClick={async e => {
                      e.stopPropagation();
                      if (!window.confirm('Bu kullanıcının tüm mesajları ve hesabı silinsin mi?')) return;
                      await fetch(`/api/messages?userId=${user.id}`, { method: 'DELETE' });
                      setUsers(users.filter(u => u.id !== user.id));
                      fetch('/api/messages').then(res => res.json()).then(data => setMessages(data));
                      if (selectedUser?.id === user.id) setSelectedUser(null);
                      setDeleteMsg('Kullanıcı ve mesajları başarıyla silindi.');
                      setTimeout(() => setDeleteMsg(''), 2000);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex flex-col">
          {selectedUser && (
            <div className="mb-2 text-sm text-gray-600">E-posta: <span className="font-bold">{selectedUser.email}</span></div>
          )}
          <div className="font-bold mb-2">Mesajlar</div>
          <div className="bg-white rounded-lg shadow p-4 mb-4 max-h-96 overflow-y-auto flex flex-col gap-2">
            {!selectedUser && <div className="text-gray-400">Bir kullanıcı seçin.</div>}
            {selectedUser && userMessages.length === 0 && <div className="text-gray-400">Henüz mesaj yok.</div>}
            {selectedUser && userMessages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${msg.sender.admin ? "bg-orange-50 text-right" : msg.read ? "bg-gray-100 text-left" : "bg-red-100 text-left"}`}>
                <div className="text-sm text-gray-600 mb-1">{msg.sender.admin ? "Siz (Yönetici)" : msg.sender.email}</div>
                <div>{msg.content}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString("tr-TR")}</div>
              </div>
            ))}
          </div>
          {selectedUser && (
            <form onSubmit={handleSend} className="flex gap-2 mt-auto">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
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
          )}
        </div>
      </div>
    </section>
  );
} 