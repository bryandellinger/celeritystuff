const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const ngAnnotate = require('gulp-ng-annotate');
const plumber = require('gulp-plumber');



gulp.task('clean:beincharge', () => {
    return del([
        './Content/js/beincharge/*.js'
    ]);
});

gulp.task('clean:copiednodemodules', () => {
    return del([
        './Scripts/copiedFromNodeModules/*.js'
    ]);
});

gulp.task('concat:beincharge', () => {
    return gulp.src([
        './Scripts/beincharge/*module*.js',
        './Scripts/beincharge/*.js',
        './Scripts/beincharge/*/*module*.js',
        './Scripts/beincharge/*/*.js'
    ])
        .pipe(plumber())
        .pipe(concat('beinchargebundle.js', { newLine: ';' }))
        .pipe(ngAnnotate({ add: true }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./Content/js/beincharge'))
        .pipe(rename('beinchargebundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./Content/js/beincharge'));
});

gulp.task('concatvendor:beincharge',  () => {
    return gulp.src([
        './node_modules/highcharts/highcharts.js',
        './node_modules/highcharts/modules/broken-axis.js',
        './node_modules/highcharts/modules/exporting.js',
        './node_modules/highcharts/modules/offline-exporting.js',
        './Scripts/lib/bootstrap-confirmation.min.js',
        './node_modules/toastr/toastr.js',
        './node_modules/angular/angular.js',
        './node_modules/angular-ui-router/release/angular-ui-router.js'
    ])
        .pipe(concat('beinchargevendorbundle.js'))
        .pipe(gulp.dest('./Content/js/beincharge'))
        .pipe(rename('beinchargevendorbundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./Content/js/beincharge'));
});

gulp.task('copynodemodules:beincharge', () => {
    return gulp.src([
        './node_modules/highcharts/highcharts.js',
        './node_modules/highcharts/modules/broken-axis.js',
        './node_modules/highcharts/modules/exporting.js',
        './node_modules/highcharts/modules/offline-exporting.js',
        './node_modules/toastr/toastr.js',
        './node_modules/angular/angular.js',
        './node_modules/angular-ui-router/release/angular-ui-router.js'
    ])
        .pipe(gulp.dest('./Scripts/copiedFromNodeModules'));
});


gulp.task('beincharge:dev', ['clean:beincharge', 'concat:beincharge', 'concatvendor:beincharge', 'clean:copiednodemodules', 'copynodemodules:beincharge']);
gulp.task('beincharge:release', ['clean:beincharge', 'concat:beincharge', 'concatvendor:beincharge', 'clean:copiednodemodules','copynodemodules:beincharge']);