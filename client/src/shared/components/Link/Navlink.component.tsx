"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface LinkI {
  name: string;
  url: string;
}

const NavLink = ({ name, url }: LinkI) => {
  const pathname = usePathname();

  return (
    <Link color={url === pathname ? "primary" : "foreground"} href={url}>
      {name}
    </Link>
  );
};

export default NavLink;
