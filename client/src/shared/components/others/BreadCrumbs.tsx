"use client";

import Link from "next/link";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  BreadcrumbItem,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";

type BreadcrumbItemType = {
  name: string;
  url: string;
};

type BreadCrumbsProps = BreadcrumbsProps & {
  items: BreadcrumbItemType[];
};

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({
  items,
  ...breadcrumbsProps
}) => {
  const currentPath = usePathname();

  return (
    <Breadcrumbs {...breadcrumbsProps}>
      {items.map((item, index) => (
        <BreadcrumbItem key={index} isCurrent={item.url === currentPath}>
          {item.url === currentPath ? (
            <span className="text-gray-500">{item.name}</span>
          ) : (
            <Link href={item.url}>{item.name}</Link>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
