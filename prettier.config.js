/** @type {import('prettier').Config} */
export default {
  arrowParens: 'avoid',
  printWidth: 100,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cva', 'cx', 'cn'],
  semi: false,
}
