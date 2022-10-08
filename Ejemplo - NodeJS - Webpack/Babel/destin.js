"use strict";

var array = [1, 2, 3, 4, 5, 6, 7, 8];
array.map(function (item) {
  return item * item;
}).forEach(function (item) {
  return console.log(item);
});
