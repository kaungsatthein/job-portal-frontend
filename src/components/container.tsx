"use client";
import React from "react";
import { ThemeProvider } from "@/features/navigation/components/theme-provider";
import NavBar from "@/features/navigation/NavBar";
import Footer from "@/features/Footer";
import ReactQueryProvider from "@/lib/common/ReactQueryProvider";
import { AuthProvider } from "@/features/auth";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { getMessages } from "@/lib";

const Container = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale?: string;
}) => {
  const messages = getMessages(locale!);
  return (
    <>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              {children}
              <Footer />
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </NextIntlClientProvider>
    </>
  );
};

export default Container;
