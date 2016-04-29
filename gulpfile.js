/**
 * Created by DaVer on 16/4/1.
 */

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('watch',function(){
	gulp.src('js/*.js').pipe(babel({presets:['es2015']})).pipe(gulp.dest('build'))
	gulp.watch('js/*.js',function(event){
		console.log(event);
		gulp.src('js/*.js').pipe(babel({presets:['es2015']})).pipe(gulp.dest('build'))
	})
});