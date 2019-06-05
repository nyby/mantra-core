import { compose } from 'react-komposer';

export function composeWithTracker(reactiveFn, L = () => null, E = () => null, options) {
  const onPropsChange = (props, onData, context, container) => {
    let trackerCleanup;
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        if (container._unmounted) {return;}
        trackerCleanup = reactiveFn(props, onData, context);
      });
    });

    return () => {
      if (typeof (trackerCleanup) === 'function') {
        trackerCleanup();
      }
      return handler.stop();
    };
  };

  return compose(onPropsChange, L, E, options);
}
