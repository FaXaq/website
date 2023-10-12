module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    [
      '@fullhuman/postcss-purgecss',
      process.env.NODE_ENV === 'production'
        ? {
          // the paths to all template files
          content: [
            '**/*.{js,jsx,ts,tsx}'
          ],
          // function used to extract class names from the templates
          defaultExtractor: (content) =>
            content.match(/[\w-/:]+(?<!:)/g) || [],
          safelist: ['html', 'body']
        }
        : false
    ]
  ]
}
