"use client";

import { LangsE } from "@/shared/types/common.types";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MdAttachMoney } from "react-icons/md";

const LanguageSwitcherButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const [currentLang, setCurrentLang] = useState(locale);
  const t = useTranslations("Currencies");
  const params = useParams();

  const changeLanguage = (newLang: LangsE) => {
    startTransition(() => {
      const { pathname, search } = window.location;
      const newPathname = pathname.replace(/^\/(en|ar)/, `/${newLang}`);
      router.replace(`${newPathname}${search}`);
      setCurrentLang(newLang);
    });
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" size="sm" style={{ minWidth: "0" }}>
            <MdAttachMoney size={22} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Currency Switcher">
          <DropdownItem
            key="EG"
            // onClick={() => changeCurrency("EG")}
          >
            <div className="flex items-center space-x-2">
              <Image
                src="https://flagsapi.com/EG/flat/24.png"
                alt="EG Flag"
                width={24}
                height={24}
              />
              <span>{t("EGP")}</span>
            </div>
          </DropdownItem>
          <DropdownItem
            key="SA"
            // onClick={() => changeCurrency("SA")}
          >
            <div className="flex items-center space-x-2">
              <Image
                src="https://flagsapi.com/SA/flat/24.png"
                alt="SA Flag"
                width={24}
                height={24}
              />
              <span>{t("SAR")}</span>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" size="sm" style={{ minWidth: "0" }}>
            {currentLang === "en" ? "EN" : "AR"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Language Switcher">
          <DropdownItem
            key={LangsE.EN}
            onClick={() => changeLanguage(LangsE.EN)}
          >
            English
          </DropdownItem>
          <DropdownItem
            key={LangsE.AR}
            onClick={() => changeLanguage(LangsE.AR)}
          >
            Arabic
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default LanguageSwitcherButton;
