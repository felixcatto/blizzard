const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const babel = require('gulp-babel');
const EventEmitter = require('events');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const webpackConfig = require('./webpack.config.js');
const babelConfig = require('./babelconfig.js');

const { series, parallel } = gulp;

const paths = {
  public: {
    src: 'public/**/*',
    dest: 'dist/public',
  },
  serverJs: {
    src: ['*/**/*.js', '!node_modules/**', '!dist/**', '!client/**', '!__tests__/**'],
    dest: 'dist',
  },
  clientJs: {
    src: 'client/**/*.js',
    dest: 'dist/client',
  },
  cssModule: {
    src: 'client/**/*module.scss',
    dest: 'dist/client',
  },
};

let server;
const startServer = async done => {
  server = spawn('node', ['dist/bin/server.js'], { stdio: 'inherit' });
  await waitOn({
    resources: ['http-get://localhost:4000/'],
    delay: 500,
  });
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

const copyPublic = () => gulp.src(paths.public.src).pipe(gulp.dest(paths.public.dest));
const copyPublicDev = () =>
  gulp
    .src(paths.public.src, { since: gulp.lastRun(copyPublicDev) })
    .pipe(gulp.symlink(paths.public.dest, { overwrite: false }));

// const bundleClientJs = done => compiler.run(done);
// const fakeBundleClientJs = done => webpackEmitter.once('webpackDone', () => done());

const transpileServerJs = () =>
  gulp
    .src(paths.serverJs.src, { since: gulp.lastRun(transpileServerJs) })
    .pipe(babel(babelConfig.server))
    .pipe(gulp.dest(paths.serverJs.dest));

// const transpileClientJsForSSR = () =>
//   gulp
//     .src(paths.clientJs.src, { since: gulp.lastRun(transpileClientJsForSSR) })
//     .pipe(babel(babelConfig.server))
//     .pipe(gulp.dest(paths.clientJs.dest));

const trackChangesInDist = () => {
  const watcher = gulp.watch(['dist/**/*']);
  watcher
    .on('add', path => console.log(`File ${path} was added`))
    .on('change', path => console.log(`File ${path} was changed`))
    .on('unlink', path => console.log(`File ${path} was removed`));
};

const watch = done => {
  gulp.watch(paths.public.src, series(copyPublicDev, restartServer, reloadDevServer));
  gulp.watch(paths.serverJs.src, series(transpileServerJs, restartServer, reloadDevServer));
  // gulp.watch(
  //   paths.clientJs.src,
  //   series(
  //     parallel(fakeBundleClientJs, series(transpileClientJsForSSR, restartServer)),
  //     reloadDevServer
  //   )
  // );
  trackChangesInDist();
  done();
};

const dev = series(
  clean,
  parallel(copyPublicDev, transpileServerJs, startDevServer),
  startServer,
  watch
);

const prod = series(copyPublic, transpileServerJs, startServer);

module.exports = {
  dev,
  prod,
};
