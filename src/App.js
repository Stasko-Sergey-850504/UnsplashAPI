import React, {useState,useEffect} from "react";
import UnsplashImage from "./components/UnsplashImage";

import axios from "axios";
import "./style/App.css";




function App() {
    const [images, setImage] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPages] = useState(1);
    const [suggestion, setSuggestion] = useState(false);

    useEffect(() => {
        fetchImages()
    }, [])
    const fetchImages = () => {
        const apiRoot = "https://api.unsplash.com";
        const clientID = process.env.REACT_APP_ACCESSKEY;
        const url = `${apiRoot}/search/photos?page=${page}&query=${query}&client_id=${clientID}`

        axios
            .get(url)
            .then(res => {
                setImage([...res.data.results]);
            })
    };

    const addToLocalStorage = () => {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.getItem(localStorage.key(i)) === query) {
                localStorage.removeItem(localStorage.key(i));
            }
        }
        if(query != "")
            localStorage.setItem(new Date().toLocaleString(), query.toString());
    };

    const dropDown = () => {
        const sortedKeys = Object.keys(localStorage).sort((a, b) => {
            return localStorage[a] - localStorage[b]
        });
        const length = sortedKeys.length;
        let array = [];
        for (let i = 1; i < 6; i++) {
                array.push(localStorage.getItem(sortedKeys[length - i]))
        }
        return array;
    };

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleClick = (event) => {
        event.preventDefault();
        setSuggestion(false);
        addToLocalStorage();
        fetchImages();
    };

    const updateQuery = (value) => {
        setQuery(value);
    };

    return (
        <div className="App">

            <div className="searching-container">
                <input onClick={() => setSuggestion(true)}
                       onChange={handleChange}
                       value={query}
                       type="text"
                       placeholder="Search photos"
                       className="searching-input"
                />
                <button onClick={handleClick}
                        type="submit"
                        className="button">
                    Search
                </button>
                <ul>
                    {dropDown().map(value => {
                        if( value !== null  && suggestion === true) {
                            return <li onClick={() => {updateQuery(value)
                                            setSuggestion(false)}}
                                       className="drop-down">{value}</li>
                        }
                    })}
                </ul>
            </div>

            <div className="wrapper-image">
                {images.map(image => (
                    <UnsplashImage url={image.urls.thumb} key={image.id} />
                ))}
            </div>

            <div className="searching-container">
                <button onClick={(event) => {
                            setPages(page + 1);
                            setSuggestion(false);
                            fetchImages();}}
                        className="button">MORE
                </button>
            </div>
        </div>
    );
}

export default App;