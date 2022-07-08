import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./common/components/screens/Auth";
import { DashBoard } from "./common/components/screens/DashBoard";
import {
  clockVisibilityOptions,
  storageActionOptions,
} from "./common/components/sidebar/SideBar";
import { PageLayout } from "./common/layout/PageLayout";
import { dbFireStore } from "./lib/firebase";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "./lib/localStorage";
import { KEYS } from "./utils/constants/localStorageKey";
import { showInfoToast } from "./utils/Toast";

function App() {
  const [userDetails, setUserDetails] = useState({});

  const clockVisible = getLocalStorage(KEYS.localStorage.clockVisibility);

  const [clockVisibility, setClockVisibility] = useState(
    clockVisible ? JSON.parse(clockVisible) : clockVisibilityOptions[0]
  );

  const [notification, setNotification] = useState("");

  const storageAction = getLocalStorage(KEYS.localStorage.storageActionKey);

  const [storageActionKey, setStorageActionKey] = useState(
    storageAction ? JSON.parse(storageAction) : storageActionOptions[0]
  );

  const checkAuthDetails = async (id) => {
    onSnapshot(doc(dbFireStore, "users", id), (data) => {
      const user = { ...data.data(), id: data.id };
      if (!user?.name) {
        removeLocalStorage(KEYS.localStorage.token);
        window.location.reload();
      } else
        setUserDetails({
          ...user,
        });
    });
  };

  const checkForNotification = () => {
    onSnapshot(
      doc(dbFireStore, "notifications", "Hbe2urgaIgeRYfxiN7NQ"),
      (data) => {
        const { details } = { ...data.data() };
        setNotification(details);
      }
    );
  };

  useEffect(() => {
    if (storageActionKey.value === "database") {
      const isUserLoggedIn = getLocalStorage(KEYS.localStorage.token);
      if (isUserLoggedIn) {
        checkAuthDetails(isUserLoggedIn);
        checkForNotification();
      }
    } else {
      const getUserDetailsFromLocalStorage = getLocalStorage(
        KEYS.localStorage.userDetails
      );
      if (getUserDetailsFromLocalStorage) {
        setUserDetails(JSON.parse(getUserDetailsFromLocalStorage));
      } else {
        const user = {
          id: "",
          urls: [],
          todos: [],
        };
        setUserDetails(user);
        setLocalStorage(KEYS.localStorage.userDetails, JSON.stringify(user));
      }
    }
    if (notification) {
      if (notification === getLocalStorage(KEYS.localStorage.updates)) {
        return;
      }
      showInfoToast({ title: notification });
      setLocalStorage(KEYS.localStorage.updates, notification);
    }
  }, [notification]);

  // console.log(userDetails);

  return (
    <PageLayout
      clockVisibility={clockVisibility}
      setClockVisibility={setClockVisibility}
      storageActionKey={storageActionKey}
      setStorageActionKey={setStorageActionKey}
    >
      {storageActionKey.value === "database" ? (
        getLocalStorage(KEYS.localStorage.token) ? (
          <DashBoard
            userDetails={userDetails}
            storageActionKey={storageActionKey}
            clockVisibility={clockVisibility}
          />
        ) : (
          <Auth />
        )
      ) : (
        <DashBoard
          userDetails={userDetails}
          storageActionKey={storageActionKey}
          clockVisibility={clockVisibility}
          setUserDetails={setUserDetails}
        />
      )}
    </PageLayout>
  );
}

export default App;
