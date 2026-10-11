"use client";

import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], offset = 80): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return active;
}
