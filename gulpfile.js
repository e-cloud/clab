/**
 * Created by scott on 2015/12/8.
 */
'use strict';
let gulp = require("gulp");
let gutil = require("gulp-util");
let webpack = require("webpack");
let WebpackDevServer = require("webpack-dev-server");
let webpackConfig = require("./webpack.config.js");
let gulp_plugins = require('gulp-load-plugins')()
let run_sequence = require('run-sequence')
let Debug = true
let distDir = 'dist'

require('./gulp/util')

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function () {
    gulp.watch(["src/**/*"], ['webpack:build-dev']);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function (callback) {
    // modify some webpack config options
    let myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", ['static:copy','build:style'], function (callback) {
    // run webpack
    devCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", ["build-dev"], function () {
    // modify some webpack config options
    let myConfig = Object.create(webpackConfig);

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: distDir,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

gulp.task('static:copy', function () {
    return gulp.src(['./src/*.*', './src/lib/*.css'], {base: './src'})
        .pipe(gulp.dest(distDir))
})

gulp.create_tasks({
    build_scss: function () {
        let styleConfig = Debug ? {
            errLogToConsole: true,
            outputStyle: 'compact',
            sourceComments: true,
            sourceMap: true,
            outFile: './'
        } : {
            outputStyle: 'compressed',
            sourceComments: false
        }

        return gulp.src('src/**/*.scss', {base: 'src'})
            .pipe(gulp_plugins.sass(styleConfig))
            .pipe(gulp.dest(distDir))
    },
    add_css_autoprefixer: function () {
        return gulp.src(distDir + '/**/*.css', {base: distDir})
            .pipe(gulp_plugins.autoprefixer('last 10 version', '> 1%', 'ie 9'))
            .pipe(gulp.dest(distDir))
    },
    minify_css: function () {
        if (Debug) {
            return
        }

        return gulp.src(distDir + '/**/*.css', {base: distDir})
            .pipe(gulp_plugins.minifyCss({
                // root: distDir,
                sourceMap: Debug,
                compatibility: 'ie9'
            }))
            .pipe(gulp.dest(distDir))
    }
})

gulp.task('build:style', function (cb) {
    run_sequence('build_scss', 'add_css_autoprefixer', 'minify_css', cb)
})
