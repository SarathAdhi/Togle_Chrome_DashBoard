import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbFireStore } from "../../../lib/firebase";
import { setLocalStorage } from "../../../lib/localStorage";
import { showWarningToast } from "../../../utils/Toast";
import { Input } from "../elements/Input";
import { P } from "../elements/Text";
import { LoadingSvg } from "../LoadingSvg";

export const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!urlPattern.test(urlString);
};

export const PinnedUrls = ({
  userDetails,
  storageActionKey,
  setUserDetails,
}) => {
  const [typedUrl, setTypedUrl] = useState({ url: "", tag: "" });
  const [submitAnywayBtn, setSubmitAnywayBtn] = useState(false);

  // console.log(storageActionKey);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValidUrl(typedUrl.url) || submitAnywayBtn) {
      setSubmitAnywayBtn(false);

      if (storageActionKey.value === "database") {
        const userUrlsRef = doc(dbFireStore, "users", userDetails.id);
        await updateDoc(userUrlsRef, {
          urls: arrayUnion(typedUrl),
        });
      } else {
        var urls = userDetails.urls;
        urls.push(typedUrl);
        console.log(urls);
        setUserDetails({
          ...userDetails,
          urls,
        });
        setLocalStorage(
          "user-local-details-localstorage",
          JSON.stringify({ ...userDetails, urls })
        );
      }
      setTypedUrl({ url: "", tag: "" });
    } else {
      setSubmitAnywayBtn(true);
      showWarningToast({ title: "Invalid URL" });
    }
  };

  // console.log(userDetails);
  // console.log(typedUrl);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center justify-center flex-wrap gap-5">
        {userDetails.urls?.length !== 0 ? (
          userDetails.urls?.map(({ url, tag }, index) => (
            <a
              key={index}
              className="group cursor-pointer rounded-full flex flex-col justify-between items-center gap-2"
              href={url}
            >
              <img
                src={`https://api.statvoo.com/favicon/?url=${url}`}
                onError={({ currentTarget }) => {
                  currentTarget.src =
                    "https://img.icons8.com/fluency-systems-filled/344/browser-attention.png";
                }}
                className="w-8 h-8 rounded-full p-1 duration-300 group-hover:bg-white/50"
              />
              <P className="capitalize">{tag}</P>
              <P className="w-5/6 text-right break-all opacity-0 absolute duration-300 -top-10 group-hover:top-2 right-2 group-hover:opacity-100">
                {url}
              </P>
            </a>
          ))
        ) : (
          <LoadingSvg />
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-5 text-center">
        <Input
          placeholder="Tag"
          value={typedUrl.tag}
          onChange={({ target }) =>
            setTypedUrl({ url: typedUrl.url, tag: target.value })
          }
        />
        <Input
          placeholder="Add the links here"
          value={typedUrl.url}
          onChange={({ target }) =>
            setTypedUrl({ tag: typedUrl.tag, url: target.value })
          }
          onKeyUp={(e) => {
            if (e.keyCode === 13) handleSubmit(e);
          }}
        />

        {submitAnywayBtn && (
          <button
            className="border-2 border-red-500 p-1 rounded-md duration-200 hover:!bg-red-500"
            onClick={handleSubmit}
          >
            Submit Anyway
          </button>
        )}
      </form>
    </div>
  );
};
