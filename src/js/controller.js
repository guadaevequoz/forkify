import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

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
    bookmarksView.update(model.state.bookmarks);

    // cargar receta
    await model.loadRecipe(id);

    // renderizar receta
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
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
  // agregar o eliminar bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // actualizar view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //spinner
    addRecipeView.renderSpinner();

    //subir la receta
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //renderizar receta
    recipeView.render(model.state.recipe);

    //mensaje de éxito
    addRecipeView.renderMessage();

    //cerrar ventana
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
