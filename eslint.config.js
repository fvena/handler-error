import eslintNode from "personal-style-guide/eslint/node";

export default [
  ...eslintNode,
  {
    rules: {
      "eslintsecurity/detect-object-injection": "off",
      "security/detect-object-injection": "off",
    },
  },
];
