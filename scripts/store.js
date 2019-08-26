'use strict';
/* eslint-disable no-unused-vars */
const STORE = (function() {
  const add = function(bookmark) {
    // needs to add one more property: expanded (boolean)
    Object.assign(bookmark, { expanded: false});
    this.bookmarks.push(bookmark);
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
    bookmarks: [], // all bookmarks in the STORE
    isAdding: false, // the STORE is in the "Add New Bookmark" state
    filterBy: -1, // the STORE defaults to the "Show All" state
    currentExpandedID: -1, // the STORE allows only one "Expanded" bookmark at a time (closing the previous expanded bookmark if there is one)

    add,
    findById,
    findAndDelete,
    findAndUpdate,
    toggleIsAdding,
    setFilterBy,
    setCurrentExpandedID
  };
}());