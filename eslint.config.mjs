import next from "eslint-config-next";

export default [
  { ignores: [".next/**", "dist/**", "node_modules/**"] },
  ...next,
];
