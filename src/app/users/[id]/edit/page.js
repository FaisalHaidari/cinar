"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialAdmin, setInitialAdmin] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setIsAdmin(!!data.admin);
        setInitialAdmin(!!data.admin);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    import('next-auth/react').then(mod => {
      mod.getSession().then(sess => setSession(sess));
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const handleAdminChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let confirmed = true;
    if (isAdmin !== initialAdmin) {
      confirmed = window.confirm(isAdmin
        ? "Bu kullanıcıyı admin yapmak istediğinize emin misiniz?"
        : "Bu kullanıcıyı admin yetkisinden çıkarmak istediğinize emin misiniz?");
    }
    if (!confirmed) return;
    setSaving(true);
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin: isAdmin }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setInitialAdmin(!!updated.admin);
    }
    setSaving(false);
  };

  return (
    <section className="mt-4 flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-center text-orange-500 text-3xl mb-4">Profile</h1>
      <button
        type="button"
        onClick={() => router.push('/users')}
        className="mb-2 flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-0 rounded-md text-sm h-8 transition-all w-full max-w-md"
        style={{ minHeight: '2rem' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Kullanıcılara Dön
      </button>
      <div className="bg-white p-2 rounded-lg flex flex-col md:flex-row gap-4 items-start w-full max-w-md">
        {/* Profile Image and Edit Button Section */}
        <div className="flex flex-col items-center w-full md:w-1/3 md:items-center gap-1">
          <div className="relative w-[100px] h-[100px]">
            <Image
              className="rounded-2xl object-cover"
              src={user.avatar || "/google.png"}
              width={100}
              height={100}
              style={{ aspectRatio: '1/1', objectFit: 'cover' }}
              alt={'avatar'}
            />
          </div>
          <button
            type="button"
            className="text-orange-500 border border-orange-400 rounded-xl px-3 py-1 text-sm font-semibold hover:bg-orange-50 transition-all h-8 mt-1"
            disabled
          >
            Edit
          </button>
          {session?.user?.admin && !user.admin && (
            <button
              type="button"
              className="mt-4 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-orange-600 transition-all"
              onClick={async () => {
                if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
                  const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
                  if (res.ok) {
                    router.push('/users');
                  }
                }
              }}
            >
              Kullanıcıyı Sil
            </button>
          )}
        </div>
        {/* Form Section */}
        <form className="flex-1 flex flex-col gap-1 w-full" onSubmit={handleSave}>
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="name">First and last name</label>
          <input
            id="name"
            type="text"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={user.name || ""}
            readOnly
          />
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="p-1 border rounded-md bg-gray-300 cursor-not-allowed text-sm h-8 mt-0"
            value={user.email || ""}
            disabled
          />
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={user.phone || ""}
            readOnly
          />
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="street">Street address</label>
          <input
            id="street"
            type="text"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={user.street || ""}
            readOnly
          />
          <div className="flex gap-1">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="postalCode">Postal code</label>
              <input
                id="postalCode"
                type="text"
                className="p-1 border rounded-md bg-gray-100 text-sm h-8 w-full mt-0"
                value={user.postalCode || ""}
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                className="p-1 border rounded-md bg-gray-100 text-sm h-8 w-full mt-0"
                value={user.city || ""}
                readOnly
              />
            </div>
          </div>
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={user.country || ""}
            readOnly
          />
          <div className="flex items-center gap-2 mt-2 mb-2">
            <input
              id="admin"
              type="checkbox"
              checked={isAdmin}
              disabled={saving}
              onChange={handleAdminChange}
              className="accent-orange-500 w-5 h-5 cursor-pointer"
            />
            <label htmlFor="admin" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
              Admin
            </label>
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white p-1 rounded-md mt-2 font-semibold text-sm h-8"
            disabled={saving}
          >
            Save
          </button>
        </form>
      </div>
    </section>
  );
} 