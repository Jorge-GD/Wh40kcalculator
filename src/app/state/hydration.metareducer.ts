import { ActionReducer, INIT, UPDATE, Action } from '@ngrx/store';
import { ThemeState } from './theme.reducer';

export const hydrationMetaReducer = (
  reducer: ActionReducer<unknown>
): ActionReducer<unknown> => {
  return (state: unknown, action: Action) => {
    if (action.type === INIT || action.type === UPDATE) {
      try {
        const stored = localStorage.getItem('theme');
        if (stored) {
          const themeState: ThemeState = { currentTheme: stored };
          return reducer({ ...state, theme: themeState }, action);
        }
      } catch {
        // ignore read errors
      }
    }
    const nextState = reducer(state, action);
    try {
      const theme = nextState.theme?.currentTheme;
      if (theme) {
        localStorage.setItem('theme', theme);
      }
    } catch {
      // ignore write errors
    }
    return nextState;
  };
};
