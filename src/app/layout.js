// Salve em: src/app/layout.js
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton"; // 1. IMPORTE O COMPONENTE

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "e-Certidões",
  description: "Certidões online: fácil, rápido e seguro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>

        <WhatsAppButton /> {/* 2. ADICIONE O COMPONENTE AQUI */}
      </body>
    </html>
  );
}