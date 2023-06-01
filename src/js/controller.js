import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

// import "core-js/stable";
// import "regenerator-runtime/runtime";

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // actualizar resultView
    resultsView.update(model.getSearchResultsPage());

    // cargar receta
    await model.loadRecipe(id);

    // renderizar receta
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // query
    const query = searchView.getQuery();
    if (!query) return;

    // cargar resultados
    await model.loadSearchResult(query);

    // renderizar resultados
    resultsView.render(model.getSearchResultsPage());

    // renderizar paginación
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // renderizar nuevos resultados
  resultsView.render(model.getSearchResultsPage(goToPage));

  // renderizar paginación
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // actualizar servings
  model.updateServings(newServings);

  // actualizar recipeView
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.render(model.state.recipe); // iria update pero no me funciona :(
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
