'use strict';
var dcl = function (a) {
    DEVELOPMENT_MODE && console.log(a)
  },
  dce = function (a) {
    DEVELOPMENT_MODE && (console.error('Error!! (see next line)'), console.error(a))
  },
  getClosestMatchingAncestor = function (a, b) {
    do {
      if (a.matches(b)) return a;
      a = a.parentNode
    } while (a.parentNode)
  },
  addDelegateEventListener = function (a, b, c) {
    var d;
    return document.addEventListener(b, function (b) {
      b.stopPropagation(), d = getClosestMatchingAncestor(b.target, a), d && c(b, d)
    }), !0
  },
  addMultipleDelegatedEventListeners = function (a, b, c) {
    var d, e = b.split(',');
    for (d = 0; d < e.length; d++) addDelegateEventListener(a, e[d], c)
  };