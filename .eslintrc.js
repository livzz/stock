module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ["google", "prettier"],
  globals: {
    __static: true,
  },
  plugins: ["html"],
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    indent: 0,
    "consistent-return": 0,
    "linebreak-style": 0,
    "require-jsdoc": 0
  },
};
