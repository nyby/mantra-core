'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithTracker = composeWithTracker;

var _reactKomposer = require('react-komposer');

function composeWithTracker(reactiveFn) {
  var L = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return null;
  };
  var E = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return null;
  };
  var options = arguments[3];

  var onPropsChange = function onPropsChange(props, onData, context, container) {
    var trackerCleanup = void 0;
    var handler = Tracker.nonreactive(function () {
      return Tracker.autorun(function () {
        if (container._unmounted) {
          return;
        }
        trackerCleanup = reactiveFn(props, onData, context, container);
      });
    });

    return function () {
      if (typeof trackerCleanup === 'function') {
        trackerCleanup();
      }
      return handler.stop();
    };
  };

  return (0, _reactKomposer.compose)(onPropsChange, L, E, options);
}