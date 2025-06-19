"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser } from "../AppContext";
import SmoothScrollLink from "./SmoothScrollLink";
import { useCartCount, useNewOrders } from "../AppContext";

export default function Header() {
  const { data: session, status } = useSession();
  const { userName } = useUser();
  const router = useRouter();
  const { cartCount } = useCartCount();
  const { newOrdersCount, setNewOrdersCount } = useNewOrders();
  const [unreadCount, setUnreadCount] = useState(0);

  // Yönetici: Okunmamış kullanıcı mesajlarının sayısı
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  // Kullanıcı: Okunmamış yönetici mesajlarının sayısı
  const [userUnreadCount, setUserUnreadCount] = useState(0);

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch messages
      fetch('/api/messages')
        .then(res => res.json())
        .then(data => {
          if (session?.user?.admin) {
            const unread = data.filter(m => !m.read).length;
            setUnreadCount(unread);
          } else {
            const unread = data.filter(m => m.sender?.admin && !m.read && m.receiverId === session.user.id).length;
            setUnreadCount(unread);
          }
        });

      // Fetch new orders count if admin
      if (session?.user?.admin) {
        fetch('/api/orders/new')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setNewOrdersCount(data.newOrdersCount);
            }
          });
      }
    }
  }, [status, session, setNewOrdersCount]);

  return (
    <header className="flex items-center justify-between ">
      <Link href={"/"} className="flex flex-col items-center justify-center text-orange-500 font-semibold leading-tight text-2xl text-center">
        <span>Çınar Pet</span>
        <span>Veteriner Kliniği</span>
      </Link>
      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link href={"/"}>Anasayfa</Link>
        <Link href={"/menu"}>Pet Shop</Link>
      </nav>
      <nav className="flex items-center gap-4 text-gray-500 font-semibold ml-28">
        {status === 'loading' && (
          <></>
        )}
        {status === 'authenticated' && (
          <>
            <div className="relative">
              <Link href={'/profile'}>{userName}</Link>
              {session?.user?.admin && newOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-orange-500 rounded-full text-white px-8 py-2"
            >
              Çıkış Yap
            </button>
            <div className="flex items-center gap-2">
              {!session?.user?.admin && (
                <div className="relative">
                  <Link href="/messages" title="Mesajlarım" onClick={() => setUnreadCount(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L2.909 8.584A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </Link>
                </div>
              )}
              {session?.user?.admin && (
                <div className="relative">
                  <Link href="/admin/messages" title="Yönetici Mesajları" onClick={() => setUnreadCount(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-orange-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L2.909 8.584A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </Link>
                </div>
              )}
              <Link href={'/cart'} className="ml-2 relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-orange-500 bg-white rounded-full p-1 border border-orange-300">
                  <path d="M2.25 3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .728.573l.401 2.007A2.25 2.25 0 0 0 6.09 7.5h11.32a2.25 2.25 0 0 1 2.197 2.684l-1.2 6A2.25 2.25 0 0 1 16.197 18H7.803a2.25 2.25 0 0 1-2.21-1.816L4.01 7.607M6 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm12 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </>
        )}
        {status === 'unauthenticated' && (
          <>
            <Link href={'/login'}>Giriş Yap</Link>
            <Link href={'/register'} className="bg-orange-500 rounded-full text-white px-8 py-2">
              Kayıt Ol
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}