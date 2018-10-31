const beautify = require('js-beautify').js

module.exports = {
  js (text) {
    return '\n' + beautify(text, {
      'indent_size': 2,
      'indent_char': ' ',
      'indent_with_tabs': false,
      'editorconfig': false,
      'eol': '\n',
      'end_with_newline': true,
      'indent_level': 0,
      'preserve_newlines': true,
      'max_preserve_newlines': 10,
      'space_in_paren': false,
      'space_in_empty_paren': false,
      'jslint_happy': true,
      'space_after_anon_function': true,
      'space_after_named_function': true,
      'brace_style': 'collapse',
      'unindent_chained_methods': false,
      'break_chained_methods': false,
      'keep_array_indentation': false,
      'unescape_strings': false,
      'wrap_line_length': 0,
      'e4x': false,
      'comma_first': false,
      'operator_position': 'before-newline'
    })
  }
}