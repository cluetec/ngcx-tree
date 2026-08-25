import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angularEslint from 'angular-eslint';
import storybook from 'eslint-plugin-storybook';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const disableTypeCheckedRules = tseslint.configs.disableTypeChecked.rules;
const recommendedTypeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map(
  (config) => ({
    ...config,
    files: ['**/*.ts'],
  })
);
const angularTsRecommendedConfigs = angularEslint.configs.tsRecommended.map(
  (config) => ({
    ...config,
    files: ['**/*.ts'],
  })
);
const angularTemplateConfigs = [
  ...angularEslint.configs.templateRecommended,
  ...angularEslint.configs.templateAccessibility,
].map((config) => ({
  ...config,
  files: ['**/*.html'],
}));

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'storybook-static/**',
      '.tmp/**',
      'eslint.config.*',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: disableTypeCheckedRules,
  },
  eslint.configs.recommended,
  ...recommendedTypeCheckedConfigs,
  ...angularTsRecommendedConfigs,
  {
    files: ['**/*.ts'],
    ignores: ['projects/ngcx-tree/.storybook/**/*.ts'],
    processor: angularEslint.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
    },
  },
  {
    files: ['projects/ngcx-tree/.storybook/**/*.ts'],
    rules: {
      ...disableTypeCheckedRules,
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...angularTemplateConfigs,
  ...storybook.configs['flat/recommended'],
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
