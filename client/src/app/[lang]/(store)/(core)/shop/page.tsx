import BreadCrumbs from "@/shared/components/others/BreadCrumbs";

const breadcrumbsData = [
  { name: "Home", url: "/" },
  { name: "Shop", url: "/shop" },
];
export default function Shop() {
  return (
    <div className="container">
      <h2>Shop - Page</h2>

      <BreadCrumbs items={breadcrumbsData} />
    </div>
  );
}
