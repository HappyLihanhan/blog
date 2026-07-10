import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "记录 C++、计算机基础、图形学和工程实践的个人博客。";

  return {
    metadataBase: new URL(origin),
    title: "ian's Blog",
    description,
    openGraph: {
      title: "ian's Blog",
      description,
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1733, height: 907, alt: "ian's Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ian's Blog",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
