"use client";

import CountBadge from "@/shared/components/Badge/CountBadge.component";
import Logo from "@/shared/components/Image/Logo.component";
import NavLink from "@/shared/components/Link/Navlink.component";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Avatar,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Checkbox,
  Link as UILink,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import CartDrawer from "./CartDrawer.component";
import ConfirmModal from "@/shared/components/Modal/ConfirmModal.component";
import SearchModal from "./SearchModal.component";
import { useParams } from "next/navigation";
import { LangsE } from "@/shared/types/common.types";
import LanguageSwitcherButton from "./LangButton.component";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const {
    isOpen: isConfirmLogoutOpen,
    onOpen: onConfirmLogoutOpen,
    onOpenChange: onOpenConfirmLogoutChange,
  } = useDisclosure();

  const handleLogout = () => {
    console.log("Logout");
  };

  const toggleCartDrawer = () => setIsCartOpen(!isCartOpen);
  const toggleSearchModal = () => setIsSearchOpen(!isSearchOpen);

  const params = useParams();
  const lang = params.lang || LangsE.EN;

  return (
    <>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        shouldHideOnScroll
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
          <Logo />
        </NavbarContent>

        <NavbarContent className="hidden sm:flex" justify="start">
          <Logo />
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-5" justify="center">
          <NavbarItem className="text-foreground-600">
            <NavLink name="Shop" url={`/${lang}/shop`} />
          </NavbarItem>
          <NavbarItem className="text-foreground-600">
            <NavLink name="About" url={`/${lang}/about`} />
          </NavbarItem>
          <NavbarItem className="text-foreground-600">
            <NavLink name="Blogs" url={`/${lang}/blogs`} />
          </NavbarItem>
          <NavbarItem className="text-foreground-600">
            <NavLink name="Contact" url={`/${lang}/contact`} />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-6 items-center">
          <LanguageSwitcherButton />
          <NavbarItem
            className="text-foreground-600"
            onClick={toggleSearchModal}
          >
            <FaSearch size={20} cursor={"pointer"} />
          </NavbarItem>
          <NavbarItem
            className="relative cursor-pointer text-foreground-600"
            onClick={toggleCartDrawer}
          >
            <FaShoppingCart size={20} color="danger" title="cart" />
            <CountBadge count={0} />
          </NavbarItem>
          <NavbarItem className="text-foreground-600">
            <FaUser
              size={20}
              cursor={"pointer"}
              onClick={onOpen}
              title="login"
            />
          </NavbarItem>
          <NavbarItem className="text-foreground-600">
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem as={Link} href={`/${lang}/profile`} key="profile">
                  Profile
                </DropdownItem>
                <DropdownItem
                  as={Link}
                  href={`/${lang}/dashboard`}
                  key="dashboard"
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  onClick={onConfirmLogoutOpen}
                  key="logout"
                  color="danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <NavLink name="Shop" url={`/${lang}/shop`} />
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavLink name="About" url={`/${lang}/about`} />
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavLink name="Blogs" url={`/${lang}/blogs`} />
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NavLink name="Contact" url={`/${lang}/contact`} />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <CartDrawer isOpen={isCartOpen} onClose={toggleCartDrawer} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <MdEmail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  autoComplete="new-email"
                />
                <Input
                  endContent={
                    <MdLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  autoComplete="new-password"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <UILink color="primary" href="#" size="sm">
                    Forgot password?
                  </UILink>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <SearchModal isOpen={isSearchOpen} onClose={toggleSearchModal} />

      <ConfirmModal
        isOpen={isConfirmLogoutOpen}
        onOpenChange={onOpenConfirmLogoutChange}
        onConfirm={handleLogout}
        head={"Confirm Logout"}
        text={
          "Are you sure you want to log out? You will need to sign in again to continue using the application."
        }
        confirmBtnName={"Log Out"}
        confirmBtnVariant={"light"}
        confirmBtnColor={"danger"}
        fullFooter
      />
    </>
  );
}
