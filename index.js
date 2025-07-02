const prefixesToColor = [
  /*
    Format here is three elements:
    First, a regex which contains a capturing group for the "document id" (the thing you want to hash for uniqueness)
    Second, the foreground color
    Third, the background color
  */
  [/docs.google.com\/document\/d\/([_A-Za-z0-9-]+)\//, 'white', rgba(81, 142, 245, 255)],
  [/docs.google.com\/drawings\/d\/([_A-Za-z0-9-]+)\//, 'white', rgba(222, 83, 71, 255)],
  [/docs.google.com\/forms\/d\/([_A-Za-z0-9-]+)\//, 'white', rgba(114, 73, 188, 255)],
  [/docs.google.com\/presentation\/d\/([_A-Za-z0-9-]+)\//, 'white', rgba(245, 186, 19, 255)],
  [/docs.google.com\/spreadsheets\/d\/([_A-Za-z0-9-]+)\//, 'white', rgba(35, 165, 102, 255)],
];

function rgb(r, g, b) {
  return [r, g, b, 255];
}

function rgba(r, g, b, a) {
  return [r, g, b, a];
}

function hex(n) {
  return n; // Interpreted by toRgbaArray
}

function toRgbaArray(color) {
  if (Array.isArray(color)) return color;

  if (typeof color === 'number') {
    return [
      (color >> 16) & 0xff,
      (color >> 8) & 0xff,
      color & 0xff,
      255
    ];
  }

  if (typeof color === 'string') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 1;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return [data[0], data[1], data[2], data[3]];
  }

  throw new Error('Unsupported color format: ' + color);
}

function setCustomFavicon(iconBase64) {
  const linkElems = document.querySelectorAll('link[rel*="icon"]');
  for (const link of linkElems) {
    link.href = 'data:image/png;base64,' + iconBase64;
  }
}

function observeFavicon(iconBase64) {
  const head = document.querySelector('head');
  if (!head) return;

  const observer = new MutationObserver(() => {
    const current = document.querySelector('link[rel*="icon"]');
    if (!current || !current.href.startsWith('data:image/png;base64,')) {
      setCustomFavicon(iconBase64);
    }
  });

  observer.observe(head, {
    childList: true,
    attributes: true,
    subtree: true,
  });
}

(function applyCustomFavicon() {
  const url = document.URL;

  for (const [regex, fgInput, bgInput] of prefixesToColor) {
    const match = document.URL.match(regex);
    if (match) {
      const docId = match[1];
      const docHash = sha1(docId);
      const fgColor = toRgbaArray(fgInput);
      const bgColor = toRgbaArray(bgInput);

      const iconBase64 = new Identicon(docHash, {
        background: bgColor,
        foreground: fgColor
      }).toString();

      setCustomFavicon(iconBase64);
      observeFavicon(iconBase64);

      break; // Exit immediately after first match
    }
  }
})();
