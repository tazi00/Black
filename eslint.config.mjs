// eslint.config.js — Flat Config (clean & sane)
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

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

    rules: {
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

  // Put Prettier last to turn off conflicting stylistic rules
  prettier,
];

export default eslintConfig;
