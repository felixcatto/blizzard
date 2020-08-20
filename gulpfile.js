const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const babel = require('gulp-babel');
const EventEmitter = require('events');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const readline = require('readline');
const webpackConfig = require('./webpack.config.js');
const babelConfig = require('./babelconfig.js');

const { series, parallel } = gulp;

const paths = {
  public: {
    src: 'public/**/*',
    dest: 'dist/public',
  },
  serverJs: {
    src: [
      '*/**/*.js',
      'knexfile.js',
      '!node_modules/**',
      '!dist/**',
      '!client/**',
      '!views/**',
      '!__tests__/**',
      '!seeds/**',
      '!migrations/**',
    ],
    dest: 'dist',
  },
  serverViews: {
    src: 'views/**/*',
    dest: 'dist/views',
  },
  client: {
    src: 'client/**/*.(js|scss)',
    dest: 'dist/client',
  },
  cssModule: {
    src: 'client/**/*module.scss',
    dest: 'dist/client',
  },
  madge: {
    allFilesSrc: ['**', '!node_modules/**'],
    jsFilesSrc: 'dist/**/*.js',
    dest: 'dist',
  },
};

let server;
let isWaitonListening = false;
const startServer = async done => {
  server = spawn('node', ['dist/bin/server.js'], { stdio: 'inherit' });

  if (!isWaitonListening) {
    isWaitonListening = true;
    await waitOn({
      resources: ['http-get://localhost:4000'],
      delay: 500,
      interval: 1000,
      validateStatus: status => status !== 503,
    });
    isWaitonListening = false;
  }

  done();
};

const restartServer = done => {
  server.kill();
  startServer(done);
};
process.on('exit', () => {
  console.log('*** EXIT ***');
  server && server.kill(); // eslint-disable-line
});

const webpackEmitter = new EventEmitter();
const compiler = webpack(webpackConfig);
compiler.hooks.done.tap('done', () => webpackEmitter.emit('webpackDone'));

const startDevServer = done => compiler.watch({}, done);

const reloadDevServer = done => {
  const [devServer] = webpackConfig.plugins;
  devServer.emit('reload');
  done();
};

const clean = () => del(['dist']);

const copyAll = () => gulp.src(paths.madge.allFilesSrc).pipe(gulp.dest(paths.madge.dest));
const transpileMadgeJs = () =>
  gulp
    .src(paths.madge.jsFilesSrc)
    .pipe(babel(babelConfig.client))
    .pipe(gulp.dest(paths.madge.dest));

const copyPublic = () => gulp.src(paths.public.src).pipe(gulp.dest(paths.public.dest));
const copyPublicDev = () =>
  gulp
    .src(paths.public.src, { since: gulp.lastRun(copyPublicDev) })
    .pipe(gulp.symlink(paths.public.dest, { overwrite: false }));

const bundleClient = done => compiler.run(done);
const fakeBundleClient = done => webpackEmitter.once('webpackDone', () => done());

const transpileServerJs = () =>
  gulp
    .src(paths.serverJs.src, { since: gulp.lastRun(transpileServerJs) })
    .pipe(babel(babelConfig.server))
    .pipe(gulp.dest(paths.serverJs.dest));

const transpileServerViews = () =>
  gulp
    .src(paths.serverViews.src, { since: gulp.lastRun(transpileServerViews) })
    .pipe(babel(babelConfig.server))
    .pipe(gulp.dest(paths.serverViews.dest));

const trackChangesInDist = () => {
  const watcher = gulp.watch(['dist/**/*']);
  watcher
    .on('add', path => console.log(`File ${path} was added`))
    .on('change', path => console.log(`File ${path} was changed`))
    .on('unlink', path => console.log(`File ${path} was removed`));
};

const watchManualRestart = done => {
  const terminal = readline.createInterface({ input: process.stdin });
  terminal.on('line', input => {
    if (input === 'rs') series(parallel(transpileServerJs, transpileServerViews), restartServer)();
  });
  done();
};

const watch = done => {
  gulp.watch(paths.public.src, series(copyPublicDev, restartServer, reloadDevServer));
  gulp.watch(paths.serverJs.src, series(transpileServerJs, restartServer));
  gulp.watch(paths.serverViews.src, series(transpileServerViews, restartServer, reloadDevServer));
  gulp.watch(paths.client.src, series(fakeBundleClient, reloadDevServer));
  trackChangesInDist();
  done();
};

const dev = series(
  clean,
  watchManualRestart,
  parallel(copyPublicDev, transpileServerJs, transpileServerViews, startDevServer),
  startServer,
  watch
);

const build = series(clean, copyPublic, bundleClient, transpileServerJs, transpileServerViews);

module.exports = {
  dev,
  build,
  buildForMadge: series(clean, copyAll, transpileMadgeJs),
};
