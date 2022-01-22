import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/App.css";

function App() {
  const [images, setImage] = useState([]);
  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState([]);
  const [page, setPage] = useState(0);
  const [suggestion, setSuggestion] = useState(false);

  useEffect(() => {
    localStorage.setItem("QUERY-HISTORY", JSON.stringify([]));
    setQueries([...JSON.parse(localStorage.getItem("QUERY-HISTORY"))]);
  }, []);

  useEffect(() => {
    fetchImages();
    localStorage.removeItem("QUERY-HISTORY");
    localStorage.setItem("QUERY-HISTORY", JSON.stringify(queries));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries,page]);

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

  return (
    <div className="App">
      <div className="searching-container">
        <input
          onClick={() => setSuggestion(true)} // onFocus
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
              let dropItem = "";
              if (item.value !== "" && suggestion === true) {
                dropItem = (
                  <li
                    // @MISTAKE: Each child in a list should have a unique "key" prop.
                    //+++
                    key={item.value}
                    onClick={() => {
                      handleClickSugesstionList(item);
                    }}
                    className="drop-down"
                  >
                    {item.value}
                  </li>
                );
              }
              return dropItem;
            })}
          </ul>
        }
      </div>

      <div className="wrapper-image">
        {images.map((image) => (

          <img
            src={image.urls.thumb}
            key={image.id}
            alt=""
            className="img-icon"
          />
        ))}
      </div>

      <div className="searching-container">
        {images.length >= 10 ? (
          <button onClick={handleMoreBtn} className="button">
            More
          </button>
        ) : (
          "None image"
        )}
      </div>
    </div>
  );
}

export default App;
