import React, { useEffect, useState } from "react";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../../../lib/localStorage";
import { KEYS } from "../../../utils/constants/localStorageKey";
import DropDownList from "../elements/DropDownList";
import { H3, H5, P } from "../elements/Text";
import { XSlider } from "../XSlider";

const values = [
  { value: "developer", label: "Developer" },
  { value: "technology", label: "Technology" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "coding", label: "Coding" },
  { value: "google", label: "Google" },
  { value: "microsoft", label: "Microsoft" },
  { value: "politics", label: "Politics" },
  { value: "india-politics", label: "India Politics" },
  { value: "chennai", label: "Chennai" },
  { value: "tamil-nadu", label: "Tamil nadu" },
];

export const News = () => {
  const [fetchedNews, setFetchedNews] = useState([]);

  const newsCategory = getLocalStorage(KEYS.localStorage.newsCategory);
  const [category, setCategory] = useState(
    newsCategory
      ? JSON.parse(newsCategory)
      : {
          value: "developer",
          label: "Developer",
        }
  );

  const specialCharacters = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  if (specialCharacters.test(category.value)) {
    removeLocalStorage(KEYS.localStorage.newsCategory, true);
  }

  const date = new Date();
  const _date = date.toISOString().split("T")[0];

  const fetchWeatherDetails = async () => {
    const url =
      "https://newsapi.org/v2/everything?q=" +
      category.value +
      `&from=${_date}&` +
      "sortBy=popularity&language=en&apiKey=" +
      "b3ee1ed3a64d4407a6a0c885fa06fb44";
    const response = await fetch(url);
    const data = await response.json();
    setFetchedNews(data?.articles);
  };

  useEffect(() => {
    fetchWeatherDetails();
  }, [category]);

  // console.log(fetchedNews);

  return (
    <div className="mt-20 flex flex-col items-center gap-10">
      <div className="w-40">
        <DropDownList
          values={values}
          textColor="duration-200 hover:bg-gray-500"
          selected={category}
          onChange={(value) => {
            setLocalStorage(KEYS.localStorage.newsCategory, JSON.stringify(value));
            setCategory(value);
          }}
        />
      </div>

      <XSlider>
        {fetchedNews.map((news, index) => (
          <a
            key={index}
            href={news.url}
            className="m-auto p-5 pb-10 w-3/4 flex flex-col justify-between items-center gap-4 bg-white/20 shadow-blur backdrop-blur-xl border-[1px] border-white/20 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col items-center  lg:flex-row gap-5 md:gap-10">
              <img
                src={news.urlToImage}
                className="md:w-60 md:h-60 rounded-lg"
              />
              <div className="flex flex-col gap-5">
                <H3 className="text-lg md:text-2xl text-center">
                  {news.title}
                </H3>
                {news.author && (
                  <H5 className="hidden md:block text-center">
                    Author: {news.author}
                  </H5>
                )}
                <P className="hidden md:block text-center mb-4">
                  {news.content}
                </P>
                <P className="absolute bottom-2 right-2 text-xs">
                  Source: {news.source.name}
                </P>
              </div>
            </div>
          </a>
        ))}
      </XSlider>
    </div>
  );
};
