import { FormEvent, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";

const App = () => {
  const [searchTerm, setSetsearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
      pageNumber.current = 1;
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewMoreClick = async () => {
    console.log(pageNumber);
    const nextPage = pageNumber.current + 1;
    console.log(nextPage);
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
      console.log(pageNumber);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <input
          type="text"
          required
          placeholder="Enter a search term"
          value={searchTerm}
          onChange={(e) => setSetsearchTerm(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} />
      ))}
      <button className="view-more-button" onClick={handleViewMoreClick}>
        View More
      </button>
    </div>
  );
};
export default App;
