"use client";
import { useRouter, usePathname } from "next/navigation";

export default function SmoothScrollLink({ href, children, ...props }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(e) {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.split("#")[1];
      if (pathname !== "/") {
        router.push(href);
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      }
    } else {
      router.push(href);
    }
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
} 