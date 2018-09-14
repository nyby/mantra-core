'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _simpleDi = require('./simpleDi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function () {
  function App(context) {
    (0, _classCallCheck3.default)(this, App);

    if (!context) {
      var message = 'Context is required when creating a new app.';
      throw new Error(message);
    }

    this.context = context;
    this.actions = {};
    this._root = null;
  }

  (0, _createClass3.default)(App, [{
    key: '_bindContext',
    value: function _bindContext(_actions) {
      var actions = {};
      for (var key in _actions) {
        if (_actions.hasOwnProperty(key)) {
          var actionMap = _actions[key];
          var newActionMap = {};
          for (var actionName in actionMap) {
            if (actionMap.hasOwnProperty(actionName)) {
              newActionMap[actionName] = actionMap[actionName].bind(null, this.context);
            }
          }
          actions[key] = newActionMap;
        }
      }

      return actions;
    }
  }, {
    key: 'loadModule',
    value: function loadModule(name, module) {
      this._checkForInit();

      if (!module) {
        var message = 'Should provide a module to load.';
        throw new Error(message);
      }

      if (module.__loaded) {
        var _message = 'This module is already loaded.';
        throw new Error(_message);
      }

      if (name === 'coreModule' && module.root) {
        if (typeof module.root !== 'function') {
          var _message2 = 'Core module must have a root component.';
          throw new Error(_message2);
        }

        this._root = module.root;
      }

      var actions = module.actions || {};
      this.actions = (0, _extends3.default)({}, this.actions, actions);

      if (module.load) {
        if (typeof module.load !== 'function') {
          var _message3 = 'module.load should be a function.';
          throw new Error(_message3);
        }

        // This module has no access to the actions loaded after this module.
        var boundedActions = this._bindContext(this.actions);
        module.load(this.context, boundedActions);
      }

      module.__loaded = true;
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      this._checkForInit();

      if (!this._root) {
        var message = 'The application must have a "coreModule".';
        throw new Error(message);
      }

      var inject = function inject(comp) {
        return (0, _simpleDi.injectDeps)(_this.context, _this.actions)(comp);
      };

      this._root = this._root(inject, this.context, this.actions);

      this.__initialized = true;
    }
  }, {
    key: '_checkForInit',
    value: function _checkForInit() {
      if (this.__initialized) {
        var message = 'App is already initialized.';
        throw new Error(message);
      }
    }
  }]);
  return App;
}();

exports.default = App;