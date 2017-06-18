var gulp = require('gulp'),
livereload = require('gulp-livereload'); // Requiring gulp-livereload task.
function errorLog(error) {
  console.error(error);
  this.emit('end');
}

// Build resources - JS and CSS
var shell = require('gulp-shell');
gulp.task('build', function(){
  var stream = gulp.src('dist/')
    .pipe(livereload());
	return stream;
});

//Run server after running the build - to make it serial
gulp.task('server', ['build'], shell.task([
  'killall node &',//kill other previous node process
//   "sudo lsof -i TCP:27017 | grep LISTEN | awk '{print $2}' | sudo xargs kill -9",//Kill mongodb
//   'sudo mongod --dbpath ./logs/mongo/db --logpath ./logs/mongo/mongod.log --fork',//start mongodb
  //'Taskkill /IM node.exe /F',
    'forever -o out.log -e err.log --watchDirectory app --watch -c "node --debug" server.js'
]))

// gulp.task('server', ['build'], shell.task([
//   'node server.js'
// ]))

// Watch Task
// Watches JS
gulp.task('watch', function () {
  livereload.listen(); // Calling lister on livereload task, which will start listening for livereload client.
  var stream = gulp.src('client/')
  .pipe(shell([
    'webpack-dev-server --config webpack.config.js'
    ]));
    gulp.watch(['dist/*'], ['build']);
  // gulp.watch('public/res/js/**/*.js', ['build']);
  //gulp.watch('public/res/css/**/*.css', ['build']);
  //gulp.watch('public/res/js/**/*.html', ['build']);
  return stream;
});
// gulp.task('default', ['uploadJS', 'uploadCSS']);
gulp.task('default', ['watch', 'server']);
