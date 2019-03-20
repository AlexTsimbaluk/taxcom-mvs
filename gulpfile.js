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



// gulp.task('__build', ['clean', 'less', 'js'], function() {
// 	'use strict';
//     var buildCss = gulp.src([
//         'src/css/main.css',
//         'src/css/libs.min.css'
//         ])
//     .pipe(gulp.dest('dist/css'));

//     var buildImg = gulp.src('src/img/**/*')
//     .pipe(gulp.dest('dist/img'));

//     var buildFonts = gulp.src('src/fonts/**/*')
//     .pipe(gulp.dest('dist/fonts'));

//     var buildJs = gulp.src('src/js/**/*')
//     .pipe(gulp.dest('dist/js'));

//     var buildHtml = gulp.src('src/*.html')
//     .pipe(gulp.dest('dist'));
// });


/*
    clean
    bundle
    delete
    rename
    final-delete
    build
*/


// 0
gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
    // return del.sync(['dist']);
});

// 1
gulp.task('bundle', ['clean'], function() {
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
});

// 2
gulp.task('delete', function() {
    gulp.src(['dist/src/environments/environment.js', 'dist/src/js/main.js'], {read: false})
        .pipe(clean());
});

// 3
// gulp.task('rename', ['delete'], function() {
gulp.task('rename', function() {
    gulp.src('./dist/src/environments/environment.prod.js')
        .pipe(rename('environment.js'))
        .pipe(gulp.dest('./dist/src/environments'));

    gulp.src('./dist/src/js/app.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./dist/src/js'));
});

// 4
gulp.task('final-delete', ['rename'], function() {
    gulp.src(['dist/src/environments/environment.prod.js', 'dist/src/js/app.js'], {read: false})
        .pipe(clean());
});

// 5
gulp.task('build', ['final-delete'], function() {});







gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
        port:   9999,
		notify: false,
		ghostMode: false
	});
});

gulp.task('less', function() {
	'use strict';
	return gulp.src('src/less/main.less')
			.pipe(less())
			.pipe(autoprefixer(
				['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
				{ cascade: true })
			)
			// TODO - починить минификацию
			/*.pipe(gulp.dest('src/css/'))
			.pipe(concat('main.min.css'))
	        .pipe(cssnano())*/
			.pipe(gulp.dest('src/css/'))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	'use strict';
	return gulp.src([
                // 'src/js/*.js', '!src/js/app.js'
				'src/js/main.js'
			])
			.pipe(babel())
			.pipe(concat('app.js'))
			.pipe(gulp.dest('src/js'))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('js-min', function() {
	'use strict';
	return gulp.src('src/js/app.js')
			.pipe(rename('app.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('src/js'));
});


gulp.task('watch', ['browser-sync'], function() {
	'use strict';
	gulp.watch('src/*.html', browserSync.reload);

    gulp.watch(
    	[
    		'src/js/*.js', '!src/js/app.js'
    	],
    	['js']
	);

	gulp.watch([
			'src/less/*.less'
		], ['less']);
});

gulp.task('default', ['watch']);

