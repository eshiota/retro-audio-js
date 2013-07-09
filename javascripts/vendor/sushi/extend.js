Namespace("SH.extend", function (obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function (el) {
    if (el) {
      for (var prop in el) {
        obj[prop] = el[prop];
      }
    }
  });

  return obj;
});
