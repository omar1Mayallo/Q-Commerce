import { ChildrenT } from "@/shared/types/common.types";
import Footer from "../_layout/Footer";
import Header from "../_layout/Header";

export default function StoreLayout({ children }: ChildrenT) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
