const static = [
  'text/html',
  'text/css',
  'text/xml',
  'image/gif',
  'image/jpeg',
  'application/javascript',
  'application/atom+xml',
  'application/rss+xml',
  'text/mathml',
  // 'text/plain',
  'text/vnd.sun.j2me.app-descriptor',
  'text/vnd.wap.wml',
  'text/x-component',
  'image/png',
  'image/tiff',
  'image/vnd.wap.wbmp',
  'image/x-icon',
  'image/x-jng',
  'image/x-ms-bmp',
  'image/svg+xml',
  'image/webp',
  'application/font-woff',
  'application/java-archive',
  // 'application/json',
  'application/mac-binhex40',
  'application/msword',
  'application/pdf',
  'application/postscript',
  'application/rtf',
  'application/vnd.apple.mpegurl',
  'application/vnd.ms-excel',
  'application/vnd.ms-fontobject',
  'application/vnd.ms-powerpoint',
  'application/vnd.wap.wmlc',
  'application/vnd.google-earth.kml+xml',
  'application/vnd.google-earth.kmz',
  'application/x-7z-compressed',
  'application/x-cocoa',
  'application/x-java-archive-diff',
  'application/x-java-jnlp-file',
  'application/x-makeself',
  'application/x-perl',
  'application/x-pilot',
  'application/x-rar-compressed',
  'application/x-redhat-package-manager',
  'application/x-sea',
  'application/x-shockwave-flash',
  'application/x-stuffit',
  'application/x-tcl',
  'application/x-x509-ca-cert',
  'application/x-xpinstall',
  'application/xhtml+xml',
  'application/xspf+xml',
  'application/zip',
  'application/octet-stream',
  'application/octet-stream',
  'application/octet-stream',
  'application/octet-stream',
  'application/octet-stream',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'audio/midi',
  'audio/mpeg',
  'audio/ogg',
  'audio/x-m4a',
  'audio/x-realaudio',
  'video/3gpp',
  'video/mp2t',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/webm',
  'video/x-flv',
  'video/x-m4v',
  'video/x-mng',
  'video/x-ms-asf',
  'video/x-ms-wmv',
  'video/x-msvideo' ]
module.exports = {
  static,
  isPage (req) {
    return new RegExp('text/html').test(req.headers.accept)
  }
}
