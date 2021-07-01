import React, { useEffect, useState } from "react";

const Articles = () => {
  const [totalPages, setTotalPages] = useState(0);
  /* Creating the states for input and currentpages */
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [articles, setArticles] = useState([]);
  const link = "https://jsonmock.hackerrank.com/api/articles?page=";

  const apiCall = async (page) => {
    let url = link + page;
    let response = await fetch(url);
    let data = await response.json();

    let pages = data.total_pages;

    setTotalPages(pages);
    const filteredArticles = data.data.filter((item) => item.title);
    // getting the old value and new value from localstorage
    let phrases = localStorage.getItem(`${currentPage}`);
    phrases = JSON.parse(phrases);
    if (phrases !== null) {
      let phrasesFromLocalStorage = Object.values(phrases);
      setArticles([...filteredArticles, ...phrasesFromLocalStorage]);
    } else {
      setArticles(filteredArticles);
    }
  };

  useEffect(() => {
    apiCall(currentPage);
  }, [currentPage]);

  const handleClick = (e) => {
    let targetBtn = e.target.innerHTML;
    apiCall(targetBtn);
    setCurrentPage(Number(targetBtn));
  };

  //step:2 Adding the new phrases to list of elements
  const addPharse = (e) => {
    e.preventDefault();
    const id = Math.floor(Math.random() * 1000);
    const newPhrase = {
      id,
      title: inputValue,
    };
    setArticles([...articles, newPhrase]);
    //step :3
    let phrases = localStorage.getItem(`${currentPage}`);
    phrases = JSON.parse(phrases);
    if (phrases !== null) {
      localStorage.setItem(
        `${currentPage}`,
        JSON.stringify({ ...phrases, [inputValue]: newPhrase })
      );
    } else {
      localStorage.setItem(
        `${currentPage}`,
        JSON.stringify({ [inputValue]: newPhrase })
      );
    }
  };

  return (
    <React.Fragment>
      <div className="pagination">
        <div>
          <input
            type="text"
            name="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={addPharse}>ADDPHARSE</button>
        </div>

        {Array(totalPages)
          .fill()
          .map((page, index) => {
            return (
              <button
                className={currentPage === index + 1 ? "active" : "inactive"}
                data-testid="page-button"
                key={"page-button-" + index}
                onClick={handleClick}
              >
                {index + 1}
              </button>
            );
          })}
      </div>

      <ul className="results">
        {articles.map((article, index) => {
          return (
            <li key={"title-" + index} data-testid="result-row">
              {article.title}
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

export default Articles;
