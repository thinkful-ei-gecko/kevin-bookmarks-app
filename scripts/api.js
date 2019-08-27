'use strict';
/* eslint-disable no-unused-vars */
/* global STORE */
const API = (function() {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/kevin-wei/bookmarks';

  function fetchSpecial(...args) {
    let error;
    return fetch(...args)
      .then(response => {
        if (!response.ok) {
          error = { code: response.status };
          if (!response.headers.get('content-type').includes('json')) {
            error.message = response.statusText;
            return Promise.reject(error);
          }
        }
        return response.json(); 
      })
      .then(data => {
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        } 
        return data;
      })
      .catch(error => console.error(`${error.code} ${error.message}`));
  }

  function getAllBookmarks() {
    return fetchSpecial(`${BASE_URL}`);
  }

  function createBookmark(formObj) {
    return fetchSpecial(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        title: formObj.title,
        url: formObj.url,
        rating: formObj.rating,
        desc: formObj.desc
      })
    });
  }

  function getBookmark(id) {
    return fetchSpecial(`${BASE_URL}/${id}`);
  }

  function updateBookmark(id, updateData) {
    return fetchSpecial(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
  }

  function deleteBookmark(id) {
    return fetchSpecial(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    getAllBookmarks,
    createBookmark,
    getBookmark,
    updateBookmark,
    deleteBookmark
  };
}());