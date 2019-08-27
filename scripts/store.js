'use strict';
/* eslint-disable no-unused-vars */
const STORE = (function() {
  
  const add = function(bookmark) {
    Object.assign(bookmark, { expanded: false });
    this.bookmarks.unshift(bookmark);
    return bookmark;
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const findAndUpdate = function(id, newData) {
    const bookmark = this.findById(id);
    if (bookmark !== undefined) {
      Object.assign(bookmark, newData);
    }
  };

  const toggleIsAdding = function() {
    this.isAdding = !this.isAdding;
  };

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