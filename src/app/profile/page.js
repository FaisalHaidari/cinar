'use client';
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../components/AppContext";

export default function ProfilePage() {
  const session = useSession();
  const { status } = session;
  const [userName, setUserName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { setUserName: setUserNameContext } = useUser();
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Sayfa yüklendikten sonra API'den kullanıcı bilgilerini alma
  useEffect(() => {
    async function fetchProfile() {
      if (status === 'authenticated') {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data?.admin) setIsAdmin(data.admin);
          if (data?.name) {
            setUserName(data.name);
            setUserNameContext(data.name);
          }
          if (data?.avatar) {
            setAvatar(data.avatar);
          }
          if (data?.phone) setPhone(data.phone);
          if (data?.street) setStreet(data.street);
          if (data?.postalCode) setPostalCode(data.postalCode);
          if (data?.city) setCity(data.city);
          if (data?.country) setCountry(data.country);
        }
      }
    }
    fetchProfile();
  }, [status]);

  async function handleProfileInfoUpdate(ev) {
    ev.preventDefault();
    setIsSaving(true);
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userName,
        avatar,
        phone,
        street,
        postalCode,
        city,
        country,
      }),
    });
    if (response.ok) {
      await session.update();
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data?.name) {
          setUserName(data.name);
          setUserNameContext(data.name);
        }
        if (data?.avatar) {
          setAvatar(data.avatar);
        }
        if (data?.phone) setPhone(data.phone); else setPhone('');
        if (data?.street) setStreet(data.street); else setStreet('');
        if (data?.postalCode) setPostalCode(data.postalCode); else setPostalCode('');
        if (data?.city) setCity(data.city); else setCity('');
        if (data?.country) setCountry(data.country); else setCountry('');
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
    setIsSaving(false);
  }

  // Resim yükleme işleyici
  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set('file', files[0]);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        const result = await res.json();
        if (result?.url) {
          setAvatar(result.url);
        }
      }
    }
  }

  if (status === 'loading') {
    return 'Yükleniyor...';
  }

  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  return (
    <section className="mt-4 flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-center text-orange-500 text-3xl mb-4">Profil</h1>
      {isSaved && (
        <div className="max-w-xs mx-auto">
          <h2 className="text-center bg-green-100 p-2 rounded-lg text-black font-semibold max-w-xs mx-auto text-sm mt-1 mb-1 shadow border">
            Profil başarıyla güncellendi!
          </h2>
        </div>
      )}
      <div className="bg-white p-2 rounded-lg flex flex-col md:flex-row gap-4 items-start w-full max-w-md">
        {/* Profile Image and Edit Button Section */}
        <div className="flex flex-col items-center w-full md:w-1/3 md:items-center gap-1">
          <div className="relative w-[100px] h-[100px]">
            <Image
              className="rounded-2xl object-cover"
              src={avatar || "/google.png"}
              width={100}
              height={100}
              style={{ aspectRatio: '1/1', objectFit: 'cover' }}
              alt={'avatar'}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="text-orange-500 border border-orange-400 rounded-xl px-3 py-1 text-sm font-semibold hover:bg-orange-50 transition-all h-8 mt-1"
            onClick={() => document.getElementById('avatar-upload').click()}
          >
            Düzenle
          </button>
        </div>
        {/* Form Section */}
        <form onSubmit={handleProfileInfoUpdate} className="flex-1 flex flex-col gap-1 w-full">
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="name">Ad ve Soyad</label>
          <input
            id="name"
            type="text"
            placeholder="Ad ve Soyad"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={userName}
            onChange={ev => setUserName(ev.target.value)}
          />
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="email">E-posta</label>
          <input
            id="email"
            type="email"
            placeholder="E-posta"
            className="p-1 border rounded-md bg-gray-300 cursor-not-allowed text-sm h-8 mt-0"
            value={session.data.user.email}
            disabled
          />
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="phone">Telefon</label>
          <input
            id="phone"
            type="tel"
            placeholder="Telefon"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={phone}
            onChange={ev => setPhone(ev.target.value)}
          />
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="street">Sokak Adresi</label>
          <input
            id="street"
            type="text"
            placeholder="Sokak Adresi"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={street}
            onChange={ev => setStreet(ev.target.value)}
          />
          <div className="flex gap-1">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="postalCode">Posta Kodu</label>
              <input
                id="postalCode"
                type="text"
                placeholder="Posta Kodu"
                className="p-1 border rounded-md bg-gray-100 text-sm h-8 w-full mt-0"
                value={postalCode}
                onChange={ev => setPostalCode(ev.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="city">Şehir</label>
              <input
                id="city"
                type="text"
                placeholder="Şehir"
                className="p-1 border rounded-md bg-gray-100 text-sm h-8 w-full mt-0"
                value={city}
                onChange={ev => setCity(ev.target.value)}
              />
            </div>
          </div>
          <label className="block text-xs font-medium text-gray-700 mb-0" htmlFor="country">Ülke</label>
          <input
            id="country"
            type="text"
            placeholder="Ülke"
            className="p-1 border rounded-md bg-gray-100 text-sm h-8 mt-0"
            value={country}
            onChange={ev => setCountry(ev.target.value)}
          />
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 rounded-full mt-4 font-semibold hover:bg-orange-600 transition-all"
            disabled={isSaving}
          >
            Kaydet
          </button>
        </form>
      </div>
    </section>
  );
}
