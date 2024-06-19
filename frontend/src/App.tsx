import { FormEvent, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";

const App = () => {
  const [searchTerm, setSetsearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
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
        <div>
          {recipe.image}
          {recipe.title}
        </div>
      ))}
    </div>
  );
};
export default App;
