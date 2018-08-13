const browserRefreshClient = require('browser-refresh-client');
const app = require('./app');
const PORT = 8080;

/* handle browser refresh */
const PATTERNS = '*.css *.less *.styl *.scss *.sass *.png *.jpeg *.jpg *.gif *.webp *.svg';
const isImage = path => /\.png$/.test(path);
const isStyle = path => /\.css$/.test(path);
browserRefreshClient
.enableSpecialReload(PATTERNS, { autoRefresh: false })
.onFileModified(function(path) {
  if (isImage(path)) {
    browserRefreshClient.refreshImages();
  } else if (isStyle(path)) {
    browserRefreshClient.refreshStyles();
  } else {
    browserRefreshClient.refreshPage();
  }
});

app.listen(PORT, function() {
  console.log('Listening on port %d', PORT);

  if (process.send) {
    process.send('online');
    console.log(process.env.BROWSER_REFRESH_URL);
  }
});
