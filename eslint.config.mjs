import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "dist/**", "node_modules/**"] },
  ...next,
];

export default config;
