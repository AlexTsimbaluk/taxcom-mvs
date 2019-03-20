'use strict';

var gulp = require('gulp'),
    babel = require('gulp-babel'),
	del = require('del'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	rename = require('gulp-rename'),
	cssnano = require('gulp-cssnano'),
	browserSync = require('browser-sync')
	;


// 0
// Удаляем папку dist перед сборкой
// gulp.task('clean', (done) => {
gulp.task('clean', () => {
    return del(['dist']);
    // done();
});

// 1
gulp.task('bundle', gulp.series('clean', (done) => {
    var buildCss = gulp.src('./src/css/**/*')
        .pipe(gulp.dest('./dist/css'));

    var buildImg = gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img'));

    var buildFonts = gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));

    var buildJs = gulp.src('./src/js/**/*')
        .pipe(gulp.dest('./dist/js'));

    var buildVendorJs = gulp.src('./src/libs/**/*')
        .pipe(gulp.dest('./dist/libs'));

    var buildHtml = gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));

    done();
}));

// 2
/*gulp.task('delete', function() {
    gulp.src(['dist/src/environments/environment.js', 'dist/src/js/main.js'], {read: false})
        .pipe(clean());
});*/

// 3
/*gulp.task('rename', function() {
    gulp.src('./dist/src/environments/environment.prod.js')
        .pipe(rename('environment.js'))
        .pipe(gulp.dest('./dist/src/environments'));

    gulp.src('./dist/src/js/app.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./dist/src/js'));
});*/

// 4
/*gulp.task('final-delete', gulp.series('rename', function() {
    gulp.src(['dist/src/environments/environment.prod.js', 'dist/src/js/app.js'], {read: false})
        .pipe(clean());
}));*/

// 5
// gulp.task('build', gulp.series('final-delete', function() {}));


gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'src'
		},
        port:   9999,
		notify: false,
		ghostMode: false
	});
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('less', () => {
	'use strict';
	return gulp.src('src/less/main.less')
		.pipe(less())
		.pipe(autoprefixer(
			['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
			{ cascade: true })
		)
		.pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({stream: true}))
    ;
});

gulp.task('css-min', () => {
    return gulp.src([
            'src/css/main.css'
        ])
        .pipe(rename('main.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}))
    ;
});

gulp.task('js', () => {
	return gulp.src([
			'src/js/main.js'
		])
		.pipe(babel())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.reload({stream: true}))
    ;
});

gulp.task('js-min', () => {
	return gulp.src([
            'src/js/app.js'
        ])
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'))
    ;
});


gulp.task('watch', function() {
	gulp.watch('src/*.html', gulp.series('html'));

    gulp.watch(
    	[
    		'src/js/main.js'
    	],
        gulp.series('js', 'js-min')
    );

    gulp.watch(
        [
            'src/less/*.less'
        ],
        gulp.series('less', 'css-min')
    );
});

gulp.task('default', gulp.parallel('watch', 'browser-sync'));

