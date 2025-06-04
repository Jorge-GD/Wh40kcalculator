import { createFeature, createReducer, on } from '@ngrx/store';
import { setTheme } from './theme.actions';

export interface ThemeState {
  currentTheme: string;
}

const initialState: ThemeState = {
  currentTheme: 'theme-imperium-light',
};

export const themeFeature = createFeature({
  name: 'theme',
  reducer: createReducer(
    initialState,
    on(setTheme, (state, { theme }) => ({ ...state, currentTheme: theme }))
  ),
});

export const {
  name: themeFeatureKey,
  reducer: themeReducer,
  selectThemeState,
  selectCurrentTheme,
} = themeFeature;
