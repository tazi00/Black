// eslint.config.js — Flat Config (clean & sane)
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const serverGuard = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Ban any function starting with "use" and a capital next char
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.name=/^use[A-Z].*/]',
        message:
          'React Hooks are not allowed in Server Components. Move to a Client Component and add "use client".',
      },
      {
        selector: 'JSXAttribute[name.name=/^on[A-Z].*/]',
        message:
          'DOM event handlers (onClick, onChange, ...) are not allowed in Server Components. Use a Client Component.',
      },
    ],
  },
};

const clientAllow = {
  files: ['**/*.client.{js,jsx,ts,tsx}'],
  rules: {
    'no-restricted-syntax': 'off',
  },
};

const eslintConfig = [
  // Next + TS legacy presets via compat
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Global ignore list
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  // Main rules
  {
    // helpful: flag unused `// eslint-disable` comments
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    plugins: { 'unused-imports': unusedImports },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      'no-alert': 'warn',
      // Dev-friendly warnings in editor; pre-commit/CI me CLI se error banenge
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // a11y & semantics
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'react/jsx-no-target-blank': 'warn',

      // Next.js best practices
      '@next/next/no-img-element': 'warn',
      '@next/next/no-sync-scripts': 'warn',

      // React Hooks hygiene
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      // Unused imports/vars
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  serverGuard,
  clientAllow, // keep this AFTER serverGuard so it overrides it
  // Put Prettier last to turn off conflicting stylistic rules
  prettier,
];

export default eslintConfig;
