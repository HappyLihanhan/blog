"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- index.html is a preserved static blog entrypoint. */

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);

  return (
    <main className="entry-page">
      <a href="/index.html">进入 ian&apos;s Blog</a>
    </main>
  );
}
