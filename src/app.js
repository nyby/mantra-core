import {injectDeps} from './simpleDi';

export default class App {
  constructor(context) {
    if (!context) {
      const message = 'Context is required when creating a new app.';
      throw new Error(message);
    }

    this.context = context;
    this.actions = {};
    this._root = null;
  }

  _bindContext(_actions) {
    const actions = {};
    for (let key in _actions) {
      if (_actions.hasOwnProperty(key)) {
        const actionMap = _actions[key];
        const newActionMap = {};
        for (let actionName in actionMap) {
          if (actionMap.hasOwnProperty(actionName)) {
            newActionMap[actionName] = actionMap[actionName].bind(null, this.context);
          }
        }
        actions[key] = newActionMap;
      }
    }

    return actions;
  }

  loadModule(name, module) {
    this._checkForInit();

    if (!module) {
      const message = 'Should provide a module to load.';
      throw new Error(message);
    }

    if (module.__loaded) {
      const message = 'This module is already loaded.';
      throw new Error(message);
    }

    if (name === 'coreModule' && module.root) {
      if (typeof module.root !== 'function') {
        const message = 'Core module must have a root component.';
        throw new Error(message);
      }

      this._root = module.root;
    }

    const actions = module.actions || {};
    this.actions = {
      ...this.actions,
      ...actions,
    };

    if (module.load) {
      if (typeof module.load !== 'function') {
        const message = 'module.load should be a function.';
        throw new Error(message);
      }

      // This module has no access to the actions loaded after this module.
      const boundedActions = this._bindContext(this.actions);
      module.load(this.context, boundedActions);
    }

    module.__loaded = true;
  }

  init() {
    this._checkForInit();

    if (!this._root) {
      const message = 'The application must have a "coreModule".';
      throw new Error(message);
    }

    const inject = (comp) => {
      return injectDeps(this.context, this.actions)(comp);
    };

    this._root = this._root(inject, this.context, this.actions);

    this.__initialized = true;
  }

  _checkForInit() {
    if (this.__initialized) {
      const message = 'App is already initialized.';
      throw new Error(message);
    }
  }
}
