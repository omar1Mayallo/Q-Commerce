import { getTranslations } from "next-intl/server";

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return (
    <main>
      <p>{t("title")}</p>
      {t("description")}
    </main>
  );
}
