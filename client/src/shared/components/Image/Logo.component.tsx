import { NavbarBrand } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <NavbarBrand as={Link} href={"/"} className="s max-w-fit">
      <Image src={"/logo.png"} alt="Logo" width={65} height={65} />
    </NavbarBrand>
  );
};

export default Logo;
