"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError('');
    setUserCreated(false);
   
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setUserCreated(true);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setCreatingUser(false);
    }
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-orange-500 text-4xl mb-4">
        Kayıt Ol
      </h1>
      {error && (
        <div className="my-4 text-center text-red-500">
          {error}
        </div>
      )}
      {userCreated && (
        <div className="my-4 text-center text-green-500">
          Kullanıcı başarıyla oluşturuldu!<br /> Giriş sayfasına yönlendiriliyorsunuz...
        </div>
      )}
      {!userCreated && (
        <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="e-posta"
            value={email}
            disabled={creatingUser}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <input
            type="password"
            placeholder="şifre"
            value={password}
            disabled={creatingUser}
            onChange={(ev) => setPassword(ev.target.value)}
            required
            minLength={6}
          /> 
          <button type="submit" disabled={creatingUser}>
            {creatingUser ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
          </button>
          <div className="text-center my-4 text-gray-500 border-t pt-4">
            Zaten bir hesabınız var mı?{' '}
            <Link className="underline" href={'/login'}>Buradan giriş yapın &raquo;</Link>
          </div>
        </form>
      )}
    </section>
  );
}
