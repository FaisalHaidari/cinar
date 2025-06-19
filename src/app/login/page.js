"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const { status } = useSession();
  const router = useRouter();

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoggingIn(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Geçersiz e-posta veya şifre');
    } else {
      router.push('/');
    }
    setLoggingIn(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-orange-500 text-4xl mb-4">
        Giriş Yap
      </h1>
      {error && (
        <div className="my-4 text-center text-red-500">
          Geçersiz e-posta veya şifre.<br /> Lütfen tekrar deneyin.
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="e-posta"
          value={email}
          disabled={loggingIn}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <input
          type="password"
          placeholder="şifre"
          value={password}
          disabled={loggingIn}
          onChange={(ev) => setPassword(ev.target.value)}
        /> 
        <button type="submit" disabled={loggingIn}>
          {loggingIn ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Hesabınız yok mu?{' '}
          <Link className="underline" href={'/register'}>Buradan kaydolun &raquo;</Link>
        </div>
      </form>
    </section>
  );
} 