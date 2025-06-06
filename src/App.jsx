import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

const App = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Shuffle helper
  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const extractNameFromTags = (tags) => {
    console.log(tags)
    const nameList = tags.split(",").map((t) => t.trim());
    const firstTag = `${nameList[0]}${nameList[1] ? ", " + nameList[1] : ""}`;
    return firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
  };

  useEffect(() => {
    const fetchImages = async () => {
      let allHits = [];
      for (let page = 1; page <= 3; page++) {
        const res = await fetch(
          `https://pixabay.com/api/?key=${API_KEY}&q=animal&image_type=photo&category=animals&per_page=100&page=${page}`
        );
        const data = await res.json();
        allHits = allHits.concat(data.hits);
      }

      const formatted = allHits.map((hit) => ({
        image: hit.largeImageURL,
        name: extractNameFromTags(hit.tags),
      }));

      setImages(shuffleArray(formatted));
    };

    fetchImages();
  }, []);

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
        <img
          src={images[currentIndex].image}
          alt="Animal"
          className="animal-img"
        />
      </div>
      <div className="buttons">
        <button onClick={handlePrevious}>⏮ Previous</button>
        <button onClick={handleReveal}>
          {showAnswer ? "🙈 Hide" : "👁 Reveal"}
        </button>
        <button onClick={handleNext}>Next ⏭</button>
      </div>
      {showAnswer && (
        <p className="answer">Answer: {images[currentIndex].name}</p>
      )}
    </div>
  );
};

export default App;
