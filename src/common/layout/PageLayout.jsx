import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { getLocalStorage } from "../../lib/localStorage";
import {
  bgColorOptions,
  SideBar,
  storageActionOptions,
} from "../components/sidebar/SideBar";

export const PageLayout = ({
  clockVisibility,
  setClockVisibility,
  storageActionKey,
  setStorageActionKey,
  className,
  children,
}) => {
  const theme = getLocalStorage("theme");
  const [backgroundImg, setBackgroundImg] = useState(
    theme ? JSON.parse(theme) : bgColorOptions[0]
  );

  useEffect(() => {
    const theme = getLocalStorage("theme");
    if (theme) getLocalStorage("theme");
  }, []);

  return (
    <>
      <SideBar
        backgroundImg={backgroundImg}
        setBackgroundImg={setBackgroundImg}
        clockVisibility={clockVisibility}
        setClockVisibility={setClockVisibility}
        storageActionKey={storageActionKey}
        setStorageActionKey={setStorageActionKey}
      />
      <div
        className={clsx(
          backgroundImg ? backgroundImg.value : "bg-[#18191B]",
          "w-full p-5 min-h-screen text-white flex flex-col bg-no-repeat bg-cover overflow-hidden",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};
