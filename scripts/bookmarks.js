'use strict';
/* eslint-disable no-unused-vars */
/* global STORE, API */
const BOOKMARKS = (function() {
  function serializeJson(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }

  /**
   * default view (includes condensed and expanded)
   */
  function generateHTML_Bookmark(bookmark) {
    return `
      
    `;
  }

  function generateHTML_FullBookmarksList(bookmarksInStore) {
    const bookmarks = bookmarksInStore.map(bookmark => generateHTML_Bookmark(bookmark));
    return bookmarks.join('');
  }

  /**
   * form "modal"
   */
  function generateHTML_AddBookmarkForm() {
    return `
    <form id="add-bookmark-form">
      <fieldset>
        <legend></legend>
      </fieldset>
    </form>
    `;
  }

  function render() {
    if (!STORE.isAdding) {
      let bookmarksInStore = [ ...STORE.bookmarks ];
      const fullBookmarksList = generateHTML_FullBookmarksList(bookmarksInStore);
      $('.content-view').html(fullBookmarksList);
    }
    else {
      //
    }
  }

  function handleAddClicked() {
    STORE.toggleIsAdding();
    render();
  }

  function handleAdding_SubmitClicked() {
    $('#add-bookmark-form').submit(event => {
      event.preventDefault();
      let formElement = document.querySelector("#add-bookmark-form");
      console.log( serializeJson(formElement) );
    });
    STORE.toggleIsAdding();
    render();
  }

  function handleAdding_ResetClicked() {

  }

  function handleAdding_CloseClicked() {
    STORE.toggleIsAdding();
    render();
  }

  function handleFilterByRatingSelected() {
    let filterBy;
    STORE.setFilterBy(filterBy);
    render();
  }

  function handleExpandClicked() {
    render();
  }

  function handleExpanded_DeleteClicked() {
    render();
  }

  function handleExpanded_EditClicked() {

  }

  function bindEventListeners() {
    handleAddClicked();
    handleAdding_SubmitClicked();
    handleAdding_ResetClicked();
    handleAdding_CloseClicked();
    handleFilterByRatingSelected();
    handleExpandClicked();
    handleExpanded_DeleteClicked();
    handleExpanded_EditClicked();
  }

  return {
    render,
    bindEventListeners
  };
}());