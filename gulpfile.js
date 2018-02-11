const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
const autoprefixer = require('autoprefixer');
const cssnext = require('cssnext');
const browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		proxy: "127.0.0.1:8080",
		online: false
	});
});

gulp.task('reload', function () {
	browserSync.reload();
});

gulp.task('images', function(){
	gulp.src('public/images/**/*')
		.pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('public/images/'));
});

gulp.task('styles', () => {
  const postcssPlugins = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnext
  ];

  gulp.src(['styles/main*.scss'])
		.pipe(plugins.plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
		}}))
		.pipe(plugins.sass())
		.pipe(plugins.postcss(postcssPlugins))
		.pipe(gulp.dest('public/css/'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('build', function(){

});

gulp.task('scripts', function(){
	gulp.src(['scripts/*.js'])
		.pipe(plugins.plumber({
			errorHandler: function (error) {
				console.log(error.message);
				this.emit('end');
		}}))
    .pipe(gulp.dest('public/js/'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function(){
	gulp.watch("scripts/**/*.js", ['scripts']);
	gulp.watch("styles/**/*.scss", ['styles']);
	gulp.watch("views/**/*.pug", ['reload']);
});