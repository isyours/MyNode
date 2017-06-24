/**
 * Created by Administrator on 2016/12/26.
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var changed = require('gulp-changed');
var rename = require("gulp-rename");

// var production = process.env.NODE_ENV === 'production';
var production = true;

var dependencies = [
    "alt",
    "react",
    "react-addons-shallow-compare",
    "react-codemirror",
    "react-custom-scrollbars",
    "react-dom",
    "react-dropzone",
    "react-headroom",
    "react-infinite-scroller",
    "react-intl",
    "react-material-tags",
    "react-pubsub",
    "react-router",
    "react-sticky",
    "react-tap-event-plugin",
    "codemirror",
    "draft-js",
    "draft-js-export-html",
    "formsy-material-ui",
    "formsy-react",
    "highlight.js",
    "material-ui",
    "material-ui-chip-input",
    "socket.io-client"
];

var noCompressDependencies = [
    "showdown-highlight"
];

gulp.task('loading', function() {
    return gulp.src([
        'bower_components/nprogress/nprogress.js'
    ]).pipe(concat('loading.js'))
        .pipe(gulpif(production, streamify(uglify({ mangle: false }))))
        .pipe(gulp.dest('public/js'));
});

gulp.task('loading-css', function() {
    return gulp.src([
        'bower_components/nprogress/nprogress.css'
    ]).pipe(changed('public/css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('highlight-css', function() {
    return gulp.src([
        'node_modules/highlight.js/styles/darcula.css'
    ]).pipe(changed('public/css'))
        .pipe(rename("highlight.css"))
        .pipe(gulp.dest('public/css'));
});

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/lodash/dist/lodash.core.js',
        'bower_components/lodash/dist/lodash.fp.js',
        'bower_components/lodash/dist/mapping.fp.js',
        'bower_components/toastr/toastr.js',
        'bower_components/PubSubJS/src/pubsub.js',
        'bower_components/showdown/dist/showdown.min.js'
    ]).pipe(concat('vendor.js'))
        .pipe(gulpif(production, streamify(uglify())))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
    return browserify()
        .require(dependencies)
        .bundle()
        .pipe(source('vendor.bundle.js'))
        .pipe(gulpif(production, streamify(uglify())))
        .pipe(gulp.dest('public/js'));
});

gulp.task('browserify-vendor-no-compress', function() {
    return browserify()
        .require(noCompressDependencies)
        .bundle()
        .pipe(source('vendor.bundle.no-compress.js'))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor', 'browserify-vendor-no-compress'], function() {
    var externalList = dependencies.concat(noCompressDependencies);
    return browserify('app/main.js')
        .external(externalList)
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulpif(production, streamify(uglify())))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor', 'browserify-vendor-no-compress'], function() {
    var externalList = dependencies.concat(noCompressDependencies);
    var bundler = watchify(browserify('app/main.js', watchify.args));
    bundler.external(externalList);
    bundler.transform(babelify);
    bundler.on('update', rebundle);
    return rebundle();

    function rebundle() {
        var start = Date.now();
        return bundler.bundle()
            .on('error', function(err) {
                gutil.log(gutil.colors.red(err.toString()));
            })
            .on('end', function() {
                gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
            })
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('public/js/'));
    }
});

/*
 |---------------------------------------------------------------------------
 | Add material-design-icon to release path
 |---------------------------------------------------------------------------
 */
gulp.task('materialUi', function () {
    return gulp.src([
            'node_modules/material-design-icons/iconfont/codepoints',
            'node_modules/material-design-icons/iconfont/material-icons.css',
            'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.eot',
            'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ijmap',
            'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.svg',
            'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
            'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff',
            'node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
            '*!README.md'])
        .pipe(changed('public/css'))
        .pipe(gulp.dest('public/css'));
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function() {
    return gulp.src('app/stylesheets/main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(production, cssmin()))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch('app/stylesheets/**/*.less', ['styles']);
});

gulp.task('default', ['styles', 'materialUi', 'vendor', 'loading', 'loading-css', 'highlight-css', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'materialUi', 'vendor', 'loading', 'loading-css', 'highlight-css', 'browserify']);