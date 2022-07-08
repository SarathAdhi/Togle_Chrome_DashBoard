import React from "react";
import { Clock } from "./Clock";
import { News } from "./News";
import { PinnedUrls } from "./PinnedUrls";
import { Todos } from "./Todos";

export const DashBoard = ({
  userDetails,
  clockVisibility,
  storageActionKey,
  setUserDetails,
}) => {
  return (
    <div className="pt-10 w-full  flex flex-col gap-20">
      <div>{clockVisibility?.value && <Clock />}</div>
      <div className="flex flex-col gap-28">
        <PinnedUrls
          storageActionKey={storageActionKey}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
        <Todos
          storageActionKey={storageActionKey}
          userId={userDetails.id}
          todos={userDetails.todos}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
        <News />
      </div>
    </div>
  );
};
