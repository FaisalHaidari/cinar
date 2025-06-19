import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Tabs({ isAdmin }) {
  const path = usePathname();
  const tabClass = (active) =>
    `rounded-full px-4 py-2 font-semibold transition ${
      active ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
    }`;
  if (!isAdmin) {
    return (
      <div className="flex mx-auto gap-2 justify-center my-4">
        <Link className={tabClass(path.startsWith("/profile"))}
              href={"/profile"}>
          Profile
        </Link>
      </div>
    );
  }
  return (
    <div className="flex mx-auto gap-2 justify-center my-4">
      <Link className={tabClass(path.startsWith("/profile"))} href={"/profile"}>
        Profil
      </Link>
      <Link className={tabClass(path.startsWith("/products"))} href={"/products/all"}>
         Mağaza Ürünleri
      </Link>
      <Link className={tabClass(path.startsWith("/users"))} href={"/users"}>
        Kullanıcılar
      </Link>
      <Link className={tabClass(path.startsWith("/orders"))} href={"/orders"}>
        Siparişler
      </Link>
    </div>
  );
} 