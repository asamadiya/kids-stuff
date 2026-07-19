import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // The illustration toolkit and story worlds are pure-SVG helper modules,
    // not Fast-Refresh component entry points: they intentionally export
    // reusable primitives and lowercase world renderers. Fast Refresh does not
    // apply to them, so its component-only heuristic is turned off here.
    files: ['src/illustrations/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
