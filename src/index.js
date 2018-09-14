import {
  useDeps as _useDeps
} from './simpleDi';

import {
  composeWithTracker as _composeWithTracker,
} from './composeWithTracker';

import App from './app';

// export this module's functions
export const createApp = (...args) => (new App(...args));

// export react-simple-di functions
export const useDeps = _useDeps;

export const composeWithTracker = _composeWithTracker;
