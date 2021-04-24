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
            './pages/**/*.{js,jsx,ts,tsx}',
            './components/**/*.{js,jsx,ts,tsx}',
            './hooks/**/*.{js,jsx,ts,tsx}'
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
