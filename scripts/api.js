'use strict';
/* eslint-disable no-unused-vars */
/* global cuid, STORE */
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

  const getAllBookmarks = function() {
    return fetchSpecial(`${BASE_URL}`);
  };

  const createBookmark = function(formData) {
    return fetchSpecial(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: cuid(),
        title: formData.title,
        url: formData.url,
        rating: formData.rating,
        desc: formData.desc
      })
    });
  };

  const getBookmark = function(id) {
    return fetchSpecial(`${BASE_URL}/${id}`);
  };

  const updateBookmark = function(id, updateData) {
    return fetchSpecial(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
  };

  const deleteBookmark = function(id) {
    return fetchSpecial(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
  };

  return {
    getAllBookmarks,
    createBookmark,
    getBookmark,
    updateBookmark,
    deleteBookmark
  };
}());