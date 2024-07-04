import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";

type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSetsearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSetselectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSetselectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);

  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getfavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavouriteRecipes();
  }, []);

  // -
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
      <div className="tabs">
        <h1 onClick={() => setSetselectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSetselectedTab("favourites")}>Favorites</h1>
      </div>

      {selectedTab === "search" && (
        <>
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
            <RecipeCard
              recipe={recipe}
              onClick={() => setSetselectedRecipe(recipe)}
            />
          ))}
          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favourites" && (
        <>
          <div>
            {favouriteRecipes.map((recipe) => (
              <RecipeCard
                recipe={recipe}
                onClick={() => setSetselectedRecipe(recipe)}
              />
            ))}
          </div>
        </>
      )}

      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSetselectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};
export default App;
