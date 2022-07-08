import React, { useEffect, useState } from "react";
import { H1 } from "../elements/Text";

export const Clock = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  function getCurrentTime() {
    const date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();

    var amORpm = hh >= 12 ? "PM" : "AM";
    hh = hh > 12 ? hh - 12 : hh;
    mm = mm < 10 ? "0" + mm : mm;

    var curr_time = hh + " : " + mm + " " + amORpm;

    setCurrentTime(curr_time);
  }

  useEffect(() => {
    getCurrentTime();
    const date = new Date();
    setCurrentDate(date.toISOString().split("T")[0]);
  }, []);

  setInterval(getCurrentTime, 1000);

  return (
    <div className="p-2 sticky -top-14 z-40 flex flex-col justify-center items-center">
      <div className="w-11/12 flex justify-center sm:gap-10 flex-wrap items-center backdrop-blur-xl bg-white/10 py-3 rounded-xl">
        <H1 className="p-1 text-xl sm:text-4xl font-semibold">{currentTime}</H1>
        <H1 className="p-1 text-xl sm:text-4xl font-semibold">{currentDate}</H1>
      </div>
    </div>
  );
};
