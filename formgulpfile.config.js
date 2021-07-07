const gulp = require('gulp');
const logger = require('fancy-log'); // https://www.npmjs.com/package/fancy-log
const colors = require('ansi-colors'); // https://github.com/doowb/ansi-colors/blob/HEAD/example.js
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const del = require('del');
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');


/** JS */
const devCompileJS = () => {
    return gulp.src('Scripts/forms/forms.js')
        .pipe(webpackStream(getWebpackConfig('DEV')))
        .pipe(gulp.dest('wwwroot/js/forms'));
};

const releaseCompileJS = () => {
    return gulp.src('Scripts/forms/forms.js')
        .pipe(webpackStream(getWebpackConfig('RELEASE')))
        .pipe(gulp.dest('wwwroot/js/forms'));
};

const cleanJS = () => {
    return del(['wwwroot/js/forms/*.*'])
        .then((paths) => {
            logger.info(colors.blue('JS Cleaned:'));
            paths.forEach((x) => {
                console.log(colors.gray('           -- ' + x));// .split('\\').pop().split('/').pop()));
            });
        });
};


/** STYLES */
const devCompileStyles = () => {
    const styleConfig = getStyleConfig('DEV');

    // Compile sass files
    const scssStream = gulp.src(styleConfig.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass(styleConfig.sass.options)
            .on('error', sass.logError))
        .on('end', () => {
            logger.info(colors.blue('SASS Compiled'));
        });

    // Grab all css files
    const cssStream = gulp.src(styleConfig.css.src)
        .pipe(sourcemaps.init());

    // Return merged stream
    return merge(scssStream, cssStream)
        .pipe(concat('styles.css'))
        .pipe(autoprefixer(styleConfig.autoprefixer.options))
        .on('end', () => { logger.info(colors.blue('CSS Prefixes applied')); })
        // .pipe(sourcemaps.write('./')) //This will output sourcemaps to own file
        .pipe(sourcemaps.write())
        .on('end', () => { logger.info(colors.blue('CSS Sourcemaps appended')); })
        .pipe(gulp.dest(styleConfig.dest));
};

const releaseCompileStyles = () => {
    const styleConfig = getStyleConfig('RELEASE');

    // compile sass files
    const scssStream = gulp.src(styleConfig.sass.src)
        .pipe(sass(styleConfig.sass.options)
            .on('error', sass.logError))
        .on('end', () => { logger.info(colors.blue('SASS Compiled')); });

    // Grab all css files
    const cssStream = gulp.src(styleConfig.css.src);

    // Return merged stream
    return merge(scssStream, cssStream)
        .pipe(concat('styles.css'))
        .pipe(autoprefixer(styleConfig.autoprefixer.options))
        .on('end', () => { logger.info(colors.blue('Prefixes applied.')); })
        .pipe(gulp.dest(styleConfig.dest));
};

const moveImages = () => {
    // This is where zebra_datepicker looks for icons. not configurable.
    const zebraDatepickerImgPath = 'node_modules/zebra_datepicker/dist/css/bootstrap/icons.png';

    return gulp.src([zebraDatepickerImgPath])
        .pipe(gulp.dest('./wwwroot/css'));
};

const cleanStyles = () => {
    return del([
        './wwwroot/css/styles.css',
        './wwwroot/css/styles.css.map',
        './wwwroot/css/styles.min.css',
        './wwwroot/css/icons.png'
    ])
        .then((paths) => {
            logger.info(colors.blue('Styles Cleaned:'));
            paths.forEach((x) => {
                console.log(colors.gray('           -- ' + x)); // .split('\\').pop().split('/').pop()));
            });
        });
};


/** CONFIGURATIONS */
function getWebpackConfig(environment) {
    const CONFIG = {
        context: path.join(__dirname, './Scripts/forms'),
        entry: { // TODO: multiple entry points? https://github.com/webpack/webpack/issues/1189#issuecomment-156576084
            forms: './forms'
        },
        output: {
            path: path.join(__dirname, './wwwroot/js/forms'),
            filename: '[name].js',
            sourceMapFilename: '[name].js.map'
        },
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    include: path.resolve(__dirname, './Scripts'),
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', {
                                targets: {
                                    browsers: 'last 2 versions'
                                },
                                useBuiltIns: true,
                                // debug: true
                            }]]
                        }
                    }
                },
                {
                    test: /\.(handlebars|hbs)$/,
                    loader: 'handlebars-loader'
                },
                {
                    test: require.resolve('jquery'),
                    use: [
                        {
                            loader: 'expose-loader',
                            options: 'jQuery'
                        },
                        {
                            loader: 'expose-loader',
                            options: '$'
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js'], // https://webpack.js.org/configuration/resolve/#resolve-extensions
            alias: {
                handlebars: 'handlebars/dist/handlebars.js'
            }
        },
        optimization: {
            splitChunks: { // https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-2
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all'
                    }
                }
            }
        },
        node: {
            fs: 'empty'
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ]
    };

    if (environment === 'DEV') {
        CONFIG.mode = 'development';
        CONFIG.optimization.minimize = false;
        CONFIG.devtool = 'source-map';
        webpack.debug = true;
    }

    if (environment === 'RELEASE') {
        CONFIG.mode = 'production';
        CONFIG.optimization.minimize = true;
    }

    return CONFIG;
}

function getStyleConfig(environment) {
    const CONFIG = {
        sass: {
            src: './Styles/styles.scss',
            options: {
                includePaths: [
                    'node_modules/bootstrap-sass/assets/stylesheets'
                ]
            }
        },
        css: {
            src: [
                'node_modules/toastr/build/toastr.min.css',
                'node_modules/dropzone/dist/min/dropzone.min.css',
                'node_modules/chosen-js/chosen.min.css',
                'node_modules/zebra_datepicker/dist/css/bootstrap/zebra_datepicker.min.css'
            ]
        },
        dest: './wwwroot/css',
        autoprefixer: { // https://github.com/postcss/autoprefixer#options
            options: {
                browsers: ['last 2 versions'],
                cascade: false
            }
        }
    };

    // SASS OPTIONS: https://github.com/sass/node-sass#options
    if (environment === 'DEV') {
        CONFIG.sass.options = {
            outputStyle: 'compact',
            sourceComments: true,
            includePaths: [
                'node_modules/bootstrap-sass/assets/stylesheets'
            ]
        };
    }

    if (environment === 'RELEASE') {
        CONFIG.sass.options = {
            outputStyle: 'compressed',
            sourceComments: false,
            includePaths: [
                'node_modules/bootstrap-sass/assets/stylesheets'
            ]
        };
    }

    return CONFIG;
}

function getWatchConfig() {
    return {
        styles: './Styles/**/*.scss',
        js: './Scripts/forms/**/*.*'
    };
}

module.exports = {
    devCompileJS,
    releaseCompileJS,
    cleanJS,
    devCompileStyles,
    releaseCompileStyles,
    moveImages,
    cleanStyles,
    getWatchConfig
};
