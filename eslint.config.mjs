import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Añadiendo la regla 'semi' para asegurar que siempre se usen puntos y coma
  {
    rules: {
      "semi": ["error", "always"]  // Genera un error si no se usa el punto y coma
    }
  }
];
