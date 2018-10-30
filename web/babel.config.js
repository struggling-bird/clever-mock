module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ['prismjs', {
      'languages': ['javascript', 'json', 'css', 'markup'],
      'plugins': ['line-numbers'],
      'theme': 'twilight',
      'css': true
    }]
  ]
}
