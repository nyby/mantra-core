'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithTracker = exports.useDeps = exports.createApp = undefined;

var _simpleDi = require('./simpleDi');

var _composeWithTracker2 = require('./composeWithTracker');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export this module's functions
var createApp = exports.createApp = function createApp() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_app2.default, [null].concat(args)))();
};

// export react-simple-di functions
var useDeps = exports.useDeps = _simpleDi.useDeps;

var composeWithTracker = exports.composeWithTracker = _composeWithTracker2.composeWithTracker;