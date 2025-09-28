// eslint.config.js — Flat Config
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const serverGuard = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    'no-restricted-syntax': [
      'error',
      // Hooks in Server Components ko block
      {
        selector: 'CallExpression[callee.name=/^use[A-Z].*/]',
        message:
          'React Hooks are not allowed in Server Components. Move to a Client Component and add "use client".',
      },
      // DOM event handlers in Server Components ko block
      {
        selector: 'JSXAttribute[name.name=/^on[A-Z].*/]',
        message:
          'DOM event handlers (onClick, onChange, ...) are not allowed in Server Components. Use a Client Component.',
      },
    ],
  },
};

const clientAllow = {
  // Client-only files ko allow
  files: ['**/*.client.{js,jsx,ts,tsx}'],
  rules: {
    'no-restricted-syntax': 'off',
  },
};

const eslintConfig = [
  // Next + TS presets via compat
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Global ignores
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  // Main rules + plugins + resolver
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      'jsx-a11y': jsxA11y,
    },

    settings: {
      // Path aliases resolve kare '@/*' -> 'src/*'
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      react: { version: 'detect' },
    },

    linterOptions: { reportUnusedDisableDirectives: true },

    rules: {
      // Dev-friendly; CI me error banana chaho to env-flag use karo
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',

      // Imports hygiene
      'import/no-unresolved': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // a11y
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',

      // Next.js
      '@next/next/no-img-element': 'warn',
      '@next/next/no-sync-scripts': 'warn',

      // Hooks hygiene
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  serverGuard,
  clientAllow,

  // Prettier last
  prettier,
];

export default eslintConfig;
