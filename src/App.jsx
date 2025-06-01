import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=animal&image_type=photo&category=animals&per_page=100`;

function App() {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                const formatted = data.hits.map(hit => ({
                  image: hit.largeImageURL,
                  name: extractNameFromTags(hit.tags)
              }));
                setImages(formatted);
            });
    }, []);

    const extractNameFromTags = tags => {
      const nameList = tags.split(",");
        const firstTag = `${nameList[0]}, ${nameList[1]}`;
        return firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowAnswer(false);
        }
    };

    const handleReveal = () => {
        setShowAnswer(!showAnswer);
    };

    if (images.length === 0) return <p>Loading...</p>;

    return (
        <div className="game">
            <h1>🐾 Guess the Animal</h1>
            <div className="image-container">
                <img src={images[currentIndex].image} alt="Animal" className="animal-img" />
            </div>
            <div className="buttons">
                <button onClick={handlePrevious}>⏮ Previous</button>
                <button onClick={handleReveal}>{showAnswer ? "🙈 Hide" : "👁 Reveal"}</button>
                <button onClick={handleNext}>Next ⏭</button>
            </div>
            {showAnswer && <p className="answer">Answer: {images[currentIndex].name}</p>}
        </div>
    );
}

export default App;
