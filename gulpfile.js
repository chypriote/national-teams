const gulp = require('gulp');
const g = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
const reporter = require('postcss-reporter');
const browser = require('postcss-browser-reporter');
const cssnext = require('postcss-cssnext');
const browserSync = require('browser-sync')
const cssnano = require('cssnano');;
const errorHandler = function (error) {console.log(error);this.emit('end');};

gulp.task('browser-sync', function () {
	browserSync({
		proxy: "127.0.0.1:8080",
		online: false
	});
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('images', function (){
	return gulp.src('public/assets/**/*')
		.pipe(g.plumber({errorHandler}))
		.pipe(g.cache(g.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('public/assets/'));
});

gulp.task('styles', () => {
  return gulp.src(['styles/main*.scss'])
		.pipe(g.plumber({errorHandler}))
		.pipe(g.sass())
		.pipe(g.postcss([
			cssnext({warnForDuplicates: false}), cssnano(), reporter(), browser(),
		]))
		.pipe(gulp.dest('public/css/'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function (){
	return gulp.src(['scripts/*.js'])
		.pipe(g.plumber({errorHandler}))
		.pipe(g.babel({
			presets: ['env', 'minify']
		}))
		.pipe(g.uglify())
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build', gulp.parallel('scripts', 'styles', 'images'));

gulp.task('default', gulp.series('browser-sync', function (){
	gulp.watch("scripts/**/*.js", ['scripts']);
	gulp.watch("styles/**/*.scss", ['styles']);
	gulp.watch("views/**/*.pug", ['reload']);
}));
