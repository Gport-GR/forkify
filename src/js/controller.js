import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeview from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeview from './views/addRecipeview.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    console.log(id);

    recipeview.renderSpinner();
    //0)Update results view to mark selected results
    resultsView.update(model.getSearchResultsPage());
    console.log(model.getSearchResultsPage());
    //1)updating bookmarkview
    bookmarksView.update(model.state.bookmarks);

    //2)Loading recipe

    await model.loadRecipe(id);

    //3)Render recipe
    recipeview.render(model.state.recipe);
    

  } catch (err) {
    recipeview.renderError()
    console.error(err);
    
  }
};

const controlSearchResults = async function () {
  try {
    // resultsView.renderSpinner();
    //1)Get search query
    const query = searchView.getQuery();
    console.log(query);
    resultsView.renderSpinner();

    if(!query) return;
    //2) Load search results
    await model.loadSearchResults(query);
          console.log(model.state.search.results);

    //3) Render Results
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

    
  } catch (err) {
    console.error(err);
    
  }
}

const controlPagination = function(goto) {
  resultsView.render(model.getSearchResultsPage(goto));
  paginationView.render(model.state.search);
}

const controlServings = function(upd) {
  //update the recipe servigs
  model.updateServings(upd);
  //Update the recipe view
  // recipeview.render(model.state.recipe);
  recipeview.update(model.state.recipe);
  

}

const controlAddBookmark = function() {
// Add remove bookmark  
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id)
//2)update bookmarks
    recipeview.update(model.state.recipe)
    //3) Render bookmarks
    bookmarksView.render(model.state.bookmarks)
  
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
  console.log(newRecipe);
  ///Show load spinner
    addRecipeview.renderSpinner();
  //Upload Recipe
  await model.UploadRecipe(newRecipe);
  console.log(model.state.recipe);
  //Rendeer Recipe
  recipeview.render(model.state.recipe);
    //Display Success MSG
  addRecipeview.renderMessage();

  //Render Bookmark view
  bookmarksView.render(model.state.bookmarks);

  //change ID in URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  //Close form Window
  setTimeout(function() {
    // addRecipeview.toggleWindow()
  }, MODAL_CLOSE_SEC * 1000);
  
  } catch (err) {
    console.error(err)
    addRecipeview.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeview.addHandlerRenderer(controlRecipes);
  recipeview.addHandlerUpdateServigs(controlServings);
  recipeview.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeview.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
  
};
init();

// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

