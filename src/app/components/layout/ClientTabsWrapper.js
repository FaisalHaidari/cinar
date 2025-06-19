"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Tabs = dynamic(() => import("./Tabs"), { ssr: false });

export default function ClientTabsWrapper() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetch("/api/profile").then(res => res.json()).then(data => {
      if (data?.admin) setIsAdmin(data.admin);
    });
  }, []);
  return <Tabs isAdmin={isAdmin} />;
} 