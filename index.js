var prefixesToColor = [
  /*
    Format here is three elements:
    First, a regex which contains a capturing group for the "document id" (the thing you want to hash for uniqueness)
    Second, the foreground color, as an RGBA array
    Third, the background color, as an RGBA array
  */
  [/docs.google.com\/document\/d\/([_A-Za-z0-9-]+)\//, [255, 255, 255, 255], [81, 142, 245, 255]],
  [/docs.google.com\/drawings\/d\/([_A-Za-z0-9-]+)\//, [255, 255, 255, 255], [222, 83, 71, 255]],
  [/docs.google.com\/forms\/d\/([_A-Za-z0-9-]+)\//, [255, 255, 255, 255], [114, 73, 188, 255]],
  [/docs.google.com\/presentation\/d\/([_A-Za-z0-9-]+)\//, [255, 255, 255, 255], [245, 186, 19, 255]],
  [/docs.google.com\/spreadsheets\/d\/([_A-Za-z0-9-]+)\//, [255, 255, 255, 255], [35, 165, 102, 255]],
];

for(var prefix of prefixesToColor) {
  let m = document.URL.match(prefix[0]);
  if(m) {
    docId = m[1];
    let docHash = sha1(docId);
    let fgColor = prefix[1];
    let bgColor = prefix[2];
    let iconBase64 = new Identicon(docHash, { background: bgColor, foreground: fgColor }).toString();
    let shortcutIcons = document.querySelectorAll('link[rel*="icon"]')
    for (var i = 0; i < shortcutIcons.length; i++) {
      shortcutIcons[i].href = 'data:image/png;base64,' + iconBase64;
    }
    break;
  }
}