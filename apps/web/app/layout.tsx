import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Socratic Hub",
  description: "Đào tạo Kỹ sư AI Agent thực chiến tại Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
