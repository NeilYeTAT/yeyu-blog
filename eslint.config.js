import js from '@eslint/js'
import next from '@next/eslint-plugin-next'
import reactQuery from '@tanstack/eslint-plugin-query'
import checkFile from 'eslint-plugin-check-file'
import import_ from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import typescript from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      eqeqeq: 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    },
  },

  ...typescript.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    ...typescript.configs.disableTypeChecked,
  },

  {
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/filename-naming-convention': ['error', { '**/*.{js,jsx,ts,tsx}': '[0-9a-z-.]+' }],
    },
  },

  {
    plugins: {
      import: import_,
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: [],
        },
      ],
    },
  },

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    rules: {
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'react/no-unescaped-entities': 'off',
    },
    settings: { react: { version: 'detect' } },
  },

  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },

  ...reactQuery.configs['flat/recommended'],

  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },

  prettier,

  {
    ignores: [
      '.next',
      'next-env.d.ts',
      'postcss.config.mjs',
      'public',
      'components/ui/*',
      'next-sitemap.config.js',
    ],
  },
]
