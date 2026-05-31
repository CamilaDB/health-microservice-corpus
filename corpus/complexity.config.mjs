import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: [
    // 'src/**/*.controller.ts',
    'src/**/*.service.ts',
    // 'src/**/*.repository.ts',
  ],
  extends: [...tseslint.configs.recommended],
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    complexity: ['warn', 0],
  },
});
