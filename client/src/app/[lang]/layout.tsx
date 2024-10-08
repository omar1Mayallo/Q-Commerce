import { cairo } from "@/config/font.config";
import { LangsE } from "@/shared/types/common.types";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import "../globals.css";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: LangsE };
}) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return {
    title: t("title"),
  };
}
const locales = ["en", "ar"];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const direction = locale === LangsE.AR ? "rtl" : "ltr";
  const messages = await getMessages();

  return (
    <html lang={locale} dir={direction}>
      <body className={cairo.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
