import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { LogoutIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import DropDownList from "../elements/DropDownList";
import { Input } from "../elements/Input";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../../../lib/localStorage";

import { AiFillGithub } from "react-icons/ai";
import { KEYS } from "../../../utils/constants/localStorageKey";

const solutions = [
  {
    name: "Contribute",
    href: "https://github.com/SarathAdhi",
    icon: AiFillGithub,
  },
];

export const bgColorOptions = [
  { value: "bg-[#18191B]", label: "Default" },
  { value: "bg-[#16003B]", label: "Dark Blue" },
  { value: "bg-[#570A57]", label: "Dark Purple" },
  { value: "bg-[#1B2430]", label: "Light Black" },
];

export const clockVisibilityOptions = [
  { value: true, label: "Show" },
  { value: false, label: "Hide" },
];

export const storageActionOptions = [
  { value: "local", label: "Local Storage" },
  { value: "database", label: "Database" },
];

export const SideBar = ({
  backgroundImg,
  setBackgroundImg,
  clockVisibility,
  setClockVisibility,
  storageActionKey,
  setStorageActionKey,
}) => {
  const [documentTitle, setDocumentTitle] = useState(
    getLocalStorage(KEYS.localStorage.tabTitle) || "Togle"
  );

  useEffect(() => {
    setLocalStorage(KEYS.localStorage.tabTitle, documentTitle);
    document.title = documentTitle;
  }, [documentTitle]);

  const isLogin = !!getLocalStorage("token");

  return (
    <Popover className="relative z-50 text-white">
      <div className="fixed top-2 left-2">
        <Popover.Button className="focus:outline-none text-white">
          <MenuIcon className="h-7 w-7" aria-hidden="true" />
        </Popover.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-500 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <Popover.Panel
          focus
          className="fixed top-0 inset-x-0 transition transform origin-top-right"
        >
          <div className="w-64 p-2 h-screen rounded-tr-xl rounded-br-xl shadow-lg ring-1 ring-black ring-opacity-5 bg-[#111] divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="w-28 bg-white p-2 rounded-lg"
                    src={require("../../../assets/logo.png")}
                    alt="Workflow"
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="rounded-md p-2 inline-flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-10">
                <nav className="grid gap-y-8">
                  {solutions.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group -m-3 p-3 flex items-center rounded-md transition duration-300 hover:bg-gray-50 hover:text-black"
                    >
                      <item.icon
                        className="flex-shrink-0 h-6 w-6 text-white duration-300 group-hover:text-black"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-base font-medium">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="flex flex-col gap-5 py-4">
              <div>
                <Input
                  label="Change Tab Title"
                  className="!bg-white !text-base !py-1.5 !text-left text-black"
                  placeholder="Tab Name"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />
              </div>

              <div>
                <DropDownList
                  label="Storage Option"
                  textColor="duration-200 hover:bg-gray-500"
                  values={storageActionOptions}
                  selected={storageActionKey}
                  onChange={(value) => {
                    setLocalStorage(
                      "storage-action-key",
                      JSON.stringify(value)
                    );
                    setStorageActionKey(value);
                    window.location.reload();
                  }}
                />
              </div>

              <div>
                <DropDownList
                  label="Background Color"
                  values={bgColorOptions}
                  selected={backgroundImg}
                  onChange={(value) => {
                    setLocalStorage(KEYS.localStorage.theme, JSON.stringify(value));
                    setBackgroundImg(value);
                  }}
                />
              </div>

              <div>
                <DropDownList
                  label="Clock Visibility"
                  textColor="duration-200 hover:bg-gray-500"
                  values={clockVisibilityOptions}
                  selected={clockVisibility}
                  onChange={(value) => {
                    setLocalStorage("clock-visibility", JSON.stringify(value));
                    setClockVisibility(value);
                  }}
                />
              </div>
            </div>
            {isLogin && (
              <div className="flex flex-col items-center py-6 px-5 space-y-6">
                <button
                  onClick={() => removeLocalStorage("token", true)}
                  className="flex items-center gap-2 bg-red-600 px-2 py-1 rounded-md"
                >
                  Logout
                  <LogoutIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
