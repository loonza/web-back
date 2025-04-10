// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: ['import'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "@typescript-eslint/no-unsafe-member-access": "off",
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'import/no-extraneous-dependencies': 0,
      'import/no-dynamic-require': 0,
      'import/no-internal-modules': 0,
      'import/no-webpack-loader-syntax': 0,
      'import/no-unassigned-import': 0,
      'import/no-useless-path-segments': 0,
      'import/no-relative-parent-imports': 0,
      'import/extensions': 0,
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/order': 'error',
      'import/no-duplicates': 'error',
      'import/no-deprecated': 'warn',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': ['error', { maxDepth: Infinity }],
      'import/no-unresolved': [2, { caseSensitive: true }],
    },
  },
);