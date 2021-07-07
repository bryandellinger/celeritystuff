/// <binding BeforeBuild='build:dev' />
const gulp = require('gulp');
const task = require('./gulpfile.config.js');

// Migrating to Gulp 4.x -- https://codeburst.io/switching-to-gulp-4-0-271ae63530c0

const devJS = gulp.series(task.cleanJS, task.devCompileJS);
const releaseJS = gulp.series(task.cleanJS, task.releaseCompileJS);

const devStyles = gulp.series(task.cleanStyles, gulp.parallel(task.devCompileStyles, task.moveImages));
const releaseStyles = gulp.series(task.cleanStyles, gulp.parallel(task.releaseCompileStyles, task.moveImages));

const dev = gulp.parallel(devJS, devStyles);
const release = gulp.parallel(releaseJS, releaseStyles);


const watchJS = function () {
    const watchConfig = task.getWatchConfig();
    gulp.watch(watchConfig.js, devJS);
};

const watchStyles = function () {
    const watchConfig = task.getWatchConfig();
    gulp.watch(watchConfig.styles, devStyles);
};

const watch = gulp.parallel(watchJS, watchStyles);

// gulp.task('default', dev);
gulp.task('watch', watch);

gulp.task('build:dev', dev);
// gulp.task('devJS', devJS);
// gulp.task('devStyles', devStyles);

gulp.task('build:release', release);
// gulp.task('releaseJS', releaseJS);
// gulp.task('releaseStyles', releaseStyles);

// module.exports = {
//     dev,
//     release,
//     devJS,
//     devStyles,
//     releaseJS,
//     releaseStyles
// }
