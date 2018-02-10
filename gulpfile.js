var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /\bgulp[\-.]/
		});
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var browserSync = require('browser-sync');

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

gulp.task('styles', function(){
	var postcssPlugins = [
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

// gulp.task('scripts', function(){
// 	gulp.src(['public/js/**/*.js'])
// 		.pipe(plugins.plumber({
// 			errorHandler: function (error) {
// 				console.log(error.message);
// 				this.emit('end');
// 		}}))
// 		.pipe(browserSync.reload({stream:true}));
// });

gulp.task('default', ['browser-sync'], function(){
	// gulp.watch("public/js/**/*.js", ['scripts']);
	gulp.watch("styles/**/*.scss", ['styles']);
	gulp.watch("views/**/*.pug", ['reload']);
});