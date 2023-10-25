"use client";

import React, { useEffect, useState } from "react";
import {
  CloseCircle,
  HamburgerMenu as MenuIcon,
  UserCircle,
} from "solar-icon-set";
import { Avatar, Button, IconButton, Modal } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MainNavigation } from "@/constants/navigation";
import { useAppDispatch, useAppSelector } from "@/config/store";

import { GOOGLE_AUTH_URL } from "@/config/google";
import { setAccessToken } from "@/slices/user";

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [drawer, setDrawer] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const user = useAppSelector((state) => state.user);

  let authModal = false;
  let accessToken;

  if (typeof window !== "undefined") {
    accessToken = sessionStorage.getItem("bhumio_access_token");
  }

  if (accessToken && !user.accessToken) {
    dispatch(setAccessToken(accessToken));
    router.push("/dashboard/select-file");
  } else if (!accessToken && !user.accessToken) {
    if (typeof window !== "undefined") {
      let url = window.location.toString();
      url = url.replace("#", "?");
      const params = new URLSearchParams(url);
      accessToken = params.get("access_token");

      if (accessToken) {
        sessionStorage.setItem("bhumio_access_token", accessToken);

        dispatch(setAccessToken(accessToken));
        router.push("/dashboard/select-file");
      }

      authModal = user.accessToken ? false : accessToken ? false : true;
    }
  }

  useEffect(() => {
    if (pathname === "/dashboard") setCurrentTab("dashboard");
    if (pathname.includes("/select-file")) setCurrentTab("select-file");
  }, [pathname]);

  return (
    <>
      <div className="flex">
        <aside className="w-36 px-5 py-7 fixed top-0 left-0 h-screen hidden lg:block ">
          <nav className="bg-white w-full border rounded-2xl h-full flex flex-col items-center  list-none relative py-10">
            {MainNavigation?.map((nav) => {
              return (
                <li
                  key={nav.key}
                  className={cn(
                    "h-16  w-full flex items-center justify-center",
                    currentTab === nav.match &&
                      " border-l-2 border-blue-500 bg-blue-50"
                  )}
                >
                  <Link href={nav.pathName}>
                    <nav.icon
                      size={33}
                      color={currentTab === nav.match ? "#1565C0" : "#9E9E9E"}
                      iconStyle="BoldDuotone"
                    />
                  </Link>
                </li>
              );
            })}
          </nav>
        </aside>
        <div className="lg:ml-36 w-full">
          <header className="w-full  border-b px-4 py-3 mb-4 flex  justify-between lg:justify-end ">
            <div className="lg:hidden">
              <IconButton onClick={() => setDrawer(true)}>
                <MenuIcon size={25} />
              </IconButton>
            </div>

            <Avatar className="w-12 h-12" src="/images/avatar.png" />
          </header>
          <main className="px-4"> {children}</main>
        </div>
      </div>
      <Modal open={authModal}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white outline-none rounded-xl w-full md:w-[28rem] p-5 flex flex-col items-center">
          <h2 className="font-medium text-2xl mb-2 self-start">Welcome !</h2>
          <img src="/images/nurseWelcome.jpg" className="w-44 mt-2 mb-5" />
          <p className="mb-5 text-sm text-gray-500 text-center">
            Please connect your google account and start managing your{" "}
            <span className="font-medium text-lg text-green-600">patients</span>
          </p>
          <Link href={GOOGLE_AUTH_URL}>
            <Button
              size="large"
              variant="outlined"
              className="rounded-xl normal-case  font-normal gap-1"
              startIcon={
                <img src="/images/googleLogo.svg" className="w-6 h-6" />
              }
            >
              Continue with google
            </Button>
          </Link>
        </div>
      </Modal>
      <Modal open={drawer} onClose={() => setDrawer(false)}>
        <nav className="absolute top-0 left-0 h-screen w-[20rem] bg-white py-14 pr-3">
          <div className="absolute top-3 right-3">
            <IconButton onClick={() => setDrawer(false)}>
              <CloseCircle size={25} />
            </IconButton>
          </div>

          <ul className="w-full h-[10rem] ">
            {MainNavigation?.map((nav) => {
              return (
                <Link key={nav.key} href={nav.pathName}>
                  <li
                    className={cn(
                      "flex items-center gap-3  pl-4 py-2 ",
                      currentTab === nav.match &&
                        "border-l-2 border-blue-500 bg-blue-50"
                    )}
                  >
                    <nav.icon
                      iconStyle="BoldDuotone"
                      size={30}
                      color={currentTab === nav.match ? "#1565C0" : "#9E9E9E"}
                    />
                    <p className="text-sm text-gray-700">{nav.name}</p>
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </Modal>
    </>
  );
};

export default DashboardLayout;
