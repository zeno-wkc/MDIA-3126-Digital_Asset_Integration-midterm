"use client";
import { useState, useEffect } from "react";

import styles from "./page.module.css";

export default function Home() {
  const DATA_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?offset=0&ordering=-published_at';
  const [articleData, setArticleData] = useState(null);
  const [nextData, setNextData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(DATA_URL);

  async function fetchArticleData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setArticleData(data.results);
      setNextData(data.next);
      setPrevData(data.previous);
    } catch (error) {
      console.error(`Could not get articles: ${error}`);
    }
  }

  useEffect(() => {
    fetchArticleData(currentUrl);
  }, [currentUrl]);

  function handleNext() {
    if (nextData) setCurrentUrl(nextData);
    window.scrollTo(0,0);
  }

  function handlePrevious() {
    if (prevData) setCurrentUrl(prevData);
    window.scrollTo(0,0);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button className={styles.button} onClick={() => setCurrentUrl(DATA_URL)}>Reset</button>
        <div>
          {articleData ? (
            articleData.map((article, index) => (
              <div className={styles.article__container} key={index}>
                <a className={styles.url} href={article.url}>
                  <h2>{article.title}</h2>
                  <div className={styles.information}><span>{article.updated_at}</span><span>{article.id}</span></div>
                  <img className={styles.image__container} src={article.image_url} />
                  <p>{article.summary}</p>
                </a>
              </div>
            ))
          ) : (
            <p>Loading articles...</p>
          )}
        </div>
        <nav className={styles.nav}>
          <button className={styles.button} onClick={handlePrevious} disabled={!prevData}>Previous</button>
          <button className={styles.button} onClick={() => setCurrentUrl(DATA_URL)}>Reset</button>
          <button className={styles.button} onClick={handleNext} disabled={!nextData}>Next</button>
        </nav>
      </main>
    </div>
  );
}
