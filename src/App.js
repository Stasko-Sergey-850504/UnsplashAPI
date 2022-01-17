import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/App.css";

let visibilityBtnMore;

function App() {
  const [images, setImage] = useState([]);
  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState([
    {
      createdTime: new Date().toLocaleString(),
      value: "",
    },
  ]);
  const [page, setPage] = useState(0);
  const [suggestion, setSuggestion] = useState(false);

  useEffect(() => {
    setQueries([...JSON.parse(localStorage.getItem("QUERY-HISTORY"))]);
  }, []);

  useEffect(() => {
    if (images.length >= 10) {
      visibilityBtnMore = true;
    }
    fetchImages();
    localStorage.clear();
    localStorage.setItem("QUERY-HISTORY", JSON.stringify(queries));
  }, [queries, page]);

  const dropDown = () => {
    let dropList = [];
    const length = queries.length <= 6 ? queries.length : 6;

    for (let i = 1; i < length; i++) {
      dropList.push(queries[queries.length - i]);
    }
    return dropList;
  };

  const fetchImages = () => {
    const apiRoot = "https://api.unsplash.com";
    const clientID = process.env.REACT_APP_ACCESSKEY;
    //${clientID}
    const url = `${apiRoot}/search/photos?page=${page}&query=${query}&client_id=${clientID}`;

    axios.get(url).then((res) => {
      setImage([...images, ...res.data.results]);
    });
  };

  const handleClickSugesstionList = (item) => {
    setQuery(item.value);
  };

  const handleClickSearchBtn = (event) => {
    setSuggestion(false);
    event.preventDefault();
    setPage(1);
    setImage([]);
    setQueries([
      ...queries.filter((item) => item.value !== query),
      {
        createdTime: new Date().toLocaleString(),
        value: query,
      },
    ]);
  };

  const handleMoreBtn = (event) => {
    event.preventDefault();
    setPage(page + 1);
  };

  if(images.length >= 10) {
    visibilityBtnMore = <button onClick={handleMoreBtn} className="button">
      MORE
    </button>
  } else {
    visibilityBtnMore = "None image";
  }

  return (
    <div className="App">
      <div className="searching-container">
        <input
          onClick={() => setSuggestion(true)}
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          type="text"
          placeholder="Search photos"
          className="searching-input"
        />
        <button onClick={handleClickSearchBtn} type="submit" className="button">
          Search
        </button>
        {
          <ul>
            {dropDown().map((item) => {
              if (item.value !== "" && suggestion === true) {
                return (
                  <li
                    onClick={() => {
                      handleClickSugesstionList(item);
                    }}
                    className="drop-down"
                  >
                    {item.value}
                  </li>
                );
              }
            })}
          </ul>
        }
      </div>

      <div className="wrapper-image">
        {images.map((image) => (
          <img src={image.urls.thumb} alt="" className="img-icon"/>
        ))}
      </div>

      <div className="searching-container">
        {visibilityBtnMore}
      </div>
    </div>
  );
}

export default App;
