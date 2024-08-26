import BreadCrumbs from "@/shared/components/others/BreadCrumbs";

const breadcrumbsData = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Shop", url: "/shop" },
  { name: "Blogs", url: "/blogs" },
  { name: "Contact", url: "/contact" },
];
export default function About() {
  return (
    <div className="container">
      <h2>About - Page</h2>

      <BreadCrumbs items={breadcrumbsData} />
    </div>
  );
}
