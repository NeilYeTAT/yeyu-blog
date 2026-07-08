export default {
  ignore: {
    rules: [
      'react/no-danger',
      'jsx-a11y/no-autofocus',
      'react-doctor/use-lazy-motion',
      'react-doctor/require-pnpm-hardening',
    ],
    files: [
      'src/generated/**',
      'ui/shadcn/**',
      'lib/core/sound/**',
      'next-sitemap.config.js',
      'prisma/schema.prisma',
    ],
    overrides: [
      {
        files: ['components/modules/diff/**'],
        rules: ['react-doctor/no-array-index-as-key', 'react-doctor/no-render-in-render'],
      },
      {
        files: ['components/search/HighlightedSnippet.tsx'],
        rules: ['react/no-danger'],
      },
    ],
  },
}
