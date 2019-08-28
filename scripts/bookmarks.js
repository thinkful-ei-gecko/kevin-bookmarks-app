'use strict';
/* eslint-disable no-unused-vars */
/* global STORE, API */
const BOOKMARKS = (function() {

  function starGenerator(rating) {
    switch(rating) {
      case 1:
        return '★☆☆☆☆';
      case 2:
        return '★★☆☆☆';
      case 3:
        return '★★★☆☆';
      case 4:
        return '★★★★☆';
      case 5:
        return '★★★★★';
      default:
        return 'No Rating';
    }
  }

  function generateHTML_Bookmark(bookmark) {
    if (!bookmark.expanded) {
      return `
        <li class="bookmark-list-item" id="${bookmark.id}">
          <div class="bookmark-list-item-condensed-view">
            <div class="condensed-view-title">${bookmark.title}</div>
            <div class="condensed-view-rating">${starGenerator(bookmark.rating)}</div>
          </div>
        </li>
      `;
    }
    else {
      return `
        <li class="bookmark-list-item" id="${bookmark.id}">
          <div class="bookmark-list-item-expanded-view">
            <div class="expanded-view-title">${bookmark.title}</div>
            <div class="expanded-view-rating">${starGenerator(bookmark.rating)}</div>
            <break></break>
            <div class="expanded-view-url"><a href="${bookmark.url}" target="_blank">Visit Site</a></div>
            <break></break>
            <div class="expanded-view-desc">${bookmark.desc}</div>
          </div>
          <div class="expanded-view-controls">
            <button class="expanded-view-controls-edit-button">Edit</button>
            <button class="expanded-view-controls-delete-button">Delete</button>
          </div>
        </li>
      `;
    }
  }

  function generateHTML_FullBookmarksList(bookmarksInStore) {
    const bookmarks = bookmarksInStore.map(bookmark => generateHTML_Bookmark(bookmark));
    return `
      <ul class="bookmark-list">
        ${bookmarks.join('')}
      </ul>
    `;
  }

  function generateHTML_NewBookmarkForm() {
    return `
      <form id="new-bookmark-form">
        <input type="button" value="X" class="form-close-button">
        <fieldset>
          <legend>Add Bookmark</legend>
          <label for="form-title-field">Title</label>
          <input type="text" name="title" id="form-title-field" required>
          <label for="form-url-field">URL</label>
          <input type="url" name="url" id="form-url-field" value="https://" required>
          <label for="form-rating-field">Rating</label>
          <select name="rating" id="form-rating-field">
            <option value="-1">-- Rate this Bookmark --</option>
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
          </select>
          <label for="form-desc-field">Description</label>
          <textarea name="desc" id="form-desc-field"></textarea>
        </fieldset>
        <div class="form-controls">
          <input type="reset" value="Clear All" class="form-reset-button">
          <input type="submit" value="Add Bookmark" class="form-submit-button">
        <div class="form-controls">
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
    $('.content-view').on('click', '.bookmark-list-item-expanded-view', event => {
      const bookmarkID = getIDFromElement(event.currentTarget);
      STORE.findAndUpdate(bookmarkID, { expanded: false });
      STORE.setCurrentExpandedID(null);
      render();
    });
  }

  function handleExpandClicked() {
    $('.content-view').on('click', '.bookmark-list-item-condensed-view', event => {
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
    // TODO rating and desc only
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