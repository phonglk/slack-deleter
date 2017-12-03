var MANIFEST = chrome.runtime.getManifest(),
  DEVELOPMENT_MODE = !('update_url' in MANIFEST),
  APP_NAME = MANIFEST.name,
  APP_TYPE_ADMIN = 'admin',
  APP_TYPE_BASIC = 'basic',
  APP_TYPE = 0 <= APP_NAME.indexOf('admin') ? APP_TYPE_ADMIN : APP_TYPE_BASIC;
if (APP_TYPE == APP_TYPE_ADMIN) var APP_ID = 'cglgakohacggbahanjfableijdkohmfd',
  APP_ICON = './icon/icon-admin-32.png';
else var APP_ID = 'eledhnkjmlmljbbamapmggcjkbpcgdlb',
  APP_ICON = './icon/icon-basic-32.png';
var APP_URL_HOME = `https://chrome.google.com/webstore/detail/${APP_ID}`,
  APP_URL_SUPPORT = APP_URL_HOME + '/support',
  APP_URL_REVIEWS = APP_URL_HOME + '/reviews',
  FOOTER_URL_PS = 'https://www.petasittek.com/?utm_source=gce&utm_medium=footer&utm_campaign=mdfsae';