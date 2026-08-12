import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SeasonalBanner from "./components/SeasonalBanner";
import FirstOrderPopup from "./components/FirstOrderPopup";
import SupportChatbot from "./components/SupportChatbot";
import WhatsAppWidget from "./components/WhatsAppWidget";

export const metadata: Metadata = {
  title: {
    default: "Lost Sheep Found — Faith-Filled Gifts & Journals",
    template: "%s | Lost Sheep Found",
  },
  description:
    "Bible journaling books, meaningful gifts, and personalized pieces inspired by Scripture. Ships across Egypt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <Header />
              <SeasonalBanner />
              {children}
              <FirstOrderPopup />
              <Footer />
              <WhatsAppWidget />
              <SupportChatbot />
            </LanguageProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}