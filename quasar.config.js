const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    cssAddon: true,

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20',
      },
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      env: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
      },
      htmlVariables: {
        ctx: {
          mode: {
            pwa: true,
          },
        },
      },
    },

    boot: ['i18n', 'axios', 'notify'],

    css: ['app.scss'],

    extras: [
      'roboto-font',
      'material-icons',
    ],

    devServer: {
      open: true, // opens browser window automatically
    },

    framework: {
      config: {},
      plugins: ['Notify'],
    },

    animations: [],

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      manifest: {
        name: 'My Quasar PWA',
        short_name: 'QuasarPWA',
        description: 'My Quasar Project',
        display: 'standalone',
        start_url: '/',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'quasar-project',
      },
    },

    bex: {
      contentScripts: ['my-content-script'],
    },
  };
});
