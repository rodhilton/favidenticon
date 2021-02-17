A fork of https://github.com/hepwori/favidenticon, the purpose is to make it easier to add your own URLs (good for internal work sites).

1. Add the wildcard for the site to manifest.json
2. Add a line to the `prefixesToColor` array. Each entry is an array that consists of A) a regex where the first capturing group is the "identifier" for the URL that will be hashed, B) an RGBA array for the foreground color, and C) an RGBA array for the background color

Then you can, in Chrome, "Load unpacked" and point it at the directory. 
