'use strict';
/* eslint-disable no-unused-vars */
/* global STORE, API */
const BOOKMARKS = (function() {

  function generateHTML_Bookmark(bookmark) {
    const condensed = bookmark.expanded ? 'hidden' : '';
    const expanded = bookmark.expanded ? '' : 'hidden';
    return `
    <ul class="bookmark-list">
      <li class="bookmark-list-item" id="${bookmark.id}">
        <div class="bookmark-list-item-condensed-view" ${condensed}>
          <button class="expand-button">V</button>
          <span class="condensed-view-title">${bookmark.title}</span>
          <span class="condensed-view-rating">${bookmark.rating} Stars</span>
        </div>
        <div class="bookmark-list-item-expanded-view" ${expanded}>
          <button class="condense-button">^</button>
          <div class="expanded-view-title">${bookmark.title}</div>
          <div class="expanded-view-url"><a href="${bookmark.url}">Visit Site</a></div>
          <div class="expanded-view-rating">${bookmark.rating} Stars</div>
          <div class="expanded-view-desc">${bookmark.desc}</div>
          <div class="expanded-view-controls">
            <button class="expanded-view-controls-edit-button">Edit</button>
            <button class="expanded-view-controls-delete-button">Delete</button>
          </div>
        </div>
      </li>
    </ul>
    `;
  }

  function generateHTML_FullBookmarksList(bookmarksInStore) {
    const bookmarks = bookmarksInStore.map(bookmark => generateHTML_Bookmark(bookmark));
    return bookmarks.join('');
  }

  function generateHTML_NewBookmarkForm() {
    return `
    <form id="new-bookmark-form">
      <input type="button" value="Close" class="form-close-button">
      <fieldset>
        <legend>Add Bookmark</legend>
        <label for="title">Title</label>
        <input type="text" name="title" id="form-title-field" required>
        <label for="url">URL</label>
        <input type="url" name="url" id="form-url-field" value="https://" required>
        <label for="rating">Rating</label>
        <input type="number" name="rating" id="form-rating-field" min="1" max="5">
        <label for="desc">Description</label>
        <textarea rows="5" cols="50" name="desc" id="form-desc-field"></textarea>
      </fieldset>
      <input type="reset" value="Clear All" class="form-reset-button">
      <input type="submit" value="Add Bookmark" class="form-submit-button">
    </form>
    `;
  }

  function render() {
    if (!STORE.isAdding) {
      document.querySelector('.master-controls').removeAttribute('hidden');
      let bookmarksInStore = [ ...STORE.bookmarks ];
      bookmarksInStore = bookmarksInStore.filter(bookmark => bookmark.rating >= STORE.filterBy);
      const fullBookmarksList = generateHTML_FullBookmarksList(bookmarksInStore);
      $('.content-view').html(fullBookmarksList);
    }
    else {
      document.querySelector('.master-controls').setAttribute('hidden', true);
      const newBookmarkForm = generateHTML_NewBookmarkForm();
      $('.content-view').html(newBookmarkForm);
    }
  }

  function getIDFromElement(bookmark) {
    return $(bookmark).closest('.bookmark-list-item').attr('id');
  }

  function formDataToObject(form) {
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((val, name) => obj[name] = val);
    return obj;
  }

  ////////////////////////////// EVENT LISTENERS //////////////////////////////

  function handleAddClicked() {
    $('.master-controls').on('click', '.master-controls-add-button', () => {
      STORE.toggleIsAdding();
      render();
    });
  }

  function handleAdding_SubmitClicked() {
    $('.content-view').on('submit', '#new-bookmark-form', event => {
      event.preventDefault();
      const formElement = document.querySelector('#new-bookmark-form');
      const formObj = formDataToObject(formElement);
      API.createBookmark(formObj)
        .then(bookmarkOnServer => {
          return STORE.add(bookmarkOnServer);
        })
        .then(bookmarkOnStore => {
          STORE.findAndUpdate(STORE.currentExpandedID, { expanded: false });
          STORE.findAndUpdate(bookmarkOnStore.id, { expanded: true });
          STORE.setCurrentExpandedID(bookmarkOnStore.id);
          STORE.toggleIsAdding();
          render();
        });
    });
  }

  function handleAdding_CloseClicked() {
    $('.content-view').on('click', '.form-close-button', () => {
      STORE.toggleIsAdding();
      render();
    });
  }

  function handleFilterSelected() {
    $('.master-controls').on('change', '#master-controls-filter-select', () => {
      const rating = $('#master-controls-filter-select').val();
      STORE.setFilterBy(rating);
      render();
    });
  }

  function handleURLFieldInput() {
    $('.content-view').on('keyup', '#form-url-field', () => {
      if ($('#form-url-field').val().substr(0 , 8) !== 'https://') {
        $('#form-url-field').val('https://');
      }
    });
  }

  function handleCondenseClicked() {
    $('.content-view').on('click', '.condense-button', event => {
      const bookmarkID = getIDFromElement(event.currentTarget);
      STORE.findAndUpdate(bookmarkID, { expanded: false });
      STORE.setCurrentExpandedID(null);
      render();
    });
  }

  function handleExpandClicked() {
    $('.content-view').on('click', '.expand-button', event => {
      STORE.findAndUpdate(STORE.currentExpandedID, { expanded: false });
      const bookmarkID = getIDFromElement(event.currentTarget);
      STORE.findAndUpdate(bookmarkID, { expanded: true });
      STORE.setCurrentExpandedID(bookmarkID);
      render();
    });
  }

  function handleExpanded_DeleteClicked() {
    $('.content-view').on('click', '.expanded-view-controls-delete-button', event => {
      const bookmarkID = getIDFromElement(event.currentTarget);
      API.deleteBookmark(bookmarkID)
        .then(() => {
          STORE.findAndDelete(bookmarkID);
          render();
        });
    });
  }

  function handleExpanded_EditClicked() {
    // TODO
  }

  function bindEventListeners() {
    handleAddClicked();
    handleAdding_SubmitClicked();
    handleAdding_CloseClicked();
    handleFilterSelected();
    handleURLFieldInput();
    handleCondenseClicked();
    handleExpandClicked();
    handleExpanded_DeleteClicked();
    handleExpanded_EditClicked();
  }

  return {
    render,
    bindEventListeners
  };
}());