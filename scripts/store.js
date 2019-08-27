'use strict';
/* eslint-disable no-unused-vars */
const STORE = (function() {
  const add = function(bookmark) {
    Object.assign(bookmark, { expanded: false });
    this.bookmarks.unshift(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const findAndUpdate = function(id, newData) {
    Object.assign(this.findById(id), newData);
  };

  const toggleIsAdding = function() {
    this.isAdding = !this.isAdding;
  };

  /**
   * @param {number} rating The rating to filter by (1 to 5, and -1 for "Show All")
   */
  const setFilterBy = function(rating) {
    this.filterBy = rating;
  };

  const setCurrentExpandedID = function(id) {
    this.currentExpandedID = id;
  };

  return {
    bookmarks: [ 
      {id: 'one', title: '[Bookmark One]', url: 'https://google.com', rating: 1, desc: 'This is a test bookmark for Google.', expanded: false}, 
      {id: 'two', title: '[Bookmark Two]', url: 'https://cnn.com', rating: 2, desc: 'This is a test bookmark for CNN.', expanded: false},
      {id: 'three', title: '[Bookmark Three]', url: 'https://yahoo.com', rating: 3, desc: 'This is a test bookmark for Yahoo.', expanded: false},
      {id: 'four', title: '[Bookmark Four]', url: 'https://facebook.com', rating: 4, desc: 'This is a test bookmark for Facebook.', expanded: false},
      {id: 'five', title: '[Bookmark Five]', url: 'https://weather.com', rating: 5, desc: 'This is a test bookmark for Weather.', expanded: false}
    ], // all bookmarks in the STORE
    isAdding: false, // the STORE is in the "Add New Bookmark" state
    filterBy: -1, // the STORE defaults to the "Show All" state
    currentExpandedID: null, // the STORE allows only one "Expanded" bookmark at a time (closing the previous expanded bookmark if there is one)

    add,
    findById,
    findAndDelete,
    findAndUpdate,
    toggleIsAdding,
    setFilterBy,
    setCurrentExpandedID
  };
}());