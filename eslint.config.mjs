import { defineConfig } from '@lobehub/lint';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';

export default defineConfig(
  {
    ignores: ['node_modules', 'coverage', '.coverage', 'dist', 'es', 'logs'],
    react: true,
    regexp: false,
    typescript: true,
  },
  {
    rules: {
      '@eslint-react/jsx-key-before-spread': 'off',
      '@eslint-react/no-children-only': 'off',
      '@eslint-react/no-children-to-array': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/no-nested-component-definitions': 'off',
      '@eslint-react/no-unnecessary-use-prefix': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      'import-x/consistent-type-specifier-style': 'off',
      'no-undef': 'off',
      'unicorn/better-regex': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
    },
  },
  {
    plugins: {
      'sort-keys-fix': sortKeysFix,
    },
  },
  {
    // `index.ts` re-exports this module as `{ default as Streamdown }`, so the
    // default export is part of the public API by design.
    files: ['src/Streamdown.tsx'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
    },
  },
);
