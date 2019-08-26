'use strict';
/* eslint-disable no-unused-vars */
const STORE = (function() {
  const add = function(bookmark) {
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

  return {
    bookmarks: [],
    add,
    findById,
    findAndDelete,
    findAndUpdate
  };
}());