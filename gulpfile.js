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
var changed = require('gulp-changed');

var production = process.env.NODE_ENV === 'production';

var dependencies = [
    'alt',
    'react',
    'react-dom',
    'react-router',
    'react-pubsub',
    'react-tap-event-plugin',
    'material-ui',
    'react-infinite-scroller',
    'react-addons-create-fragment',
    'react-addons-transition-group',
    'react-addons-shallow-compare',
    'underscore',
    'draft-js',
    'react-codemirror',
    'material-ui-chip-input',
    'react-dropzone'
];

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
        'bower_components/showdown/dist/showdown.min.js',
        'node_modules/codemirror/mode/markdown/markdown.js'
    ]).pipe(concat('vendor.js'))
        .pipe(gulpif(production, uglify({ mangle: false })))
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
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
    return browserify('app/main.js')
        .external(dependencies)
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
    var bundler = watchify(browserify('app/main.js', watchify.args));
    bundler.external(dependencies);
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

gulp.task('default', ['styles', 'materialUi', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'materialUi', 'vendor', 'browserify']);