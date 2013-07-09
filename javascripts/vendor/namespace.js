;(function (root) {
  root.Namespace = function (name, obj, scope) {
    var parts    = name.split(".")
      , curScope = scope || root
      , curPart
      , curObj
    ;

    obj = obj || {};

    while (typeof (curPart = parts.shift()) !== "undefined") {
      curObj = (parts.length > 0)
        ? ((typeof curScope[curPart] !== "undefined") ? curScope[curPart] : {})
        : obj;

      curScope[curPart] = curObj;

      curScope = curScope[curPart];
    }

    return curScope;
  };
})(this);
