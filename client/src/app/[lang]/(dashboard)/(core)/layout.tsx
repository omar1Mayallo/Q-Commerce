import { ChildrenT } from "@/shared/types/common.types";

export default function DashboardLayout({ children }: ChildrenT) {
  return (
    <>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
}
