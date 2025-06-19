"use client";
import { usePathname } from "next/navigation";
import ClientTabsWrapper from "./ClientTabsWrapper";

export default function ShowTabsOnAdminPages() {
  const pathname = usePathname();
  const showTabs =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/users");
  if (!showTabs) return null;
  return <ClientTabsWrapper />;
} 