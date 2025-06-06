import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;
const API_URL = (page = 1) =>
  `https://pixabay.com/api/?key=${API_KEY}&q=wild+animals&image_type=photo&category=animals&per_page=200&page=${page}&safesearch=true`;

function App() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const randomPage = Math.floor(Math.random() * 5) + 1;

    fetch(API_URL(randomPage))
      .then((res) => res.json())
      .then((data) => {
        const seen = new Set();
        const shuffled = shuffleArray(data.hits);

        const uniqueImages = shuffled
          .map((hit) => ({
            image: hit.largeImageURL,
            name: extractNameFromTags(hit.tags),
          }))
          .filter((item) => {
            const key = item.name.toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });

        setImages(uniqueImages);
      });
  }, []);

  useEffect(() => {
    preloadImage(currentIndex + 1);
    preloadImage(currentIndex - 1);
  }, [currentIndex, images]);

  const extractNameFromTags = (tags) => {
    const nameList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => /^[a-z\s]+$/i.test(tag))
      .filter((tag) => tag.length < 20);

    const likelyAnimal = nameList.find(
      (tag) =>
        /^[a-z]+$/i.test(tag) &&
        !["wildlife", "animal", "mammal", "nature", "zoo"].includes(tag.toLowerCase())
    );

    const fallback = `${nameList[0] || ""}, ${nameList[1] || ""}`;
    const result = `${likelyAnimal}(${fallback})`;

    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const shuffleArray = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const preloadImage = (index) => {
    if (images[index]) {
      const img = new Image();
      img.src = images[index].image;
    }
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
        <img
          src={images[currentIndex].image}
          alt="Animal"
          className="animal-img"
        />
      </div>
      <div className="buttons">
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          ⏮ Previous
        </button>
        <button onClick={handleReveal}>
          {showAnswer ? "🙈 Hide" : "👁 Reveal"}
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= images.length - 1}
        >
          Next ⏭
        </button>
      </div>
      {showAnswer && (
        <p className="answer">Answer: {images[currentIndex].name}</p>
      )}
    </div>
  );
}

export default App;
