import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { 
    files: [
      "src/**/*.js"
    ], 
    languageOptions: { 
      sourceType: "commonjs" 
    }, 
    ignores: [
      "dev/*", 
      "**/*.config.mjs", 
      "!**/eslint.config.mjs"
    ]
  },
  { 
    languageOptions: { 
      globals: globals.node 
    } 
  },
  pluginJs.configs.recommended,
];
