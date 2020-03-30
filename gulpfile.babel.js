import gulp from 'gulp';
import pug from 'gulp-pug';
import stylus from 'gulp-stylus';
import rename from 'gulp-rename';

const pugFiles = 'pages/**/*.pug';
const stylusFiles = 'pages/**/*.styl';
const appStylus = 'app.styl';

async function doPUG(path) {
  return gulp.src(path)
    .pipe(pug())
    .pipe(rename({
      extname: '.wxml',
    }))
    .pipe(gulp.dest('pages'));
}

async function doStylus(path) {
  return gulp.src(path)
    .pipe(stylus({
      'include css': true,
    }))
    .pipe(rename({
      extname: '.wxss',
    }))
    .pipe(gulp.dest('pages'));
}

gulp.task('pug', async() => {
  return doPUG(pugFiles);
});
gulp.task('stylus', async() => {
  return doStylus(stylusFiles);
});
gulp.task('app', () => {
  return gulp.src(appStylus)
    .pipe(stylus({
      'include css': true,
    }))
    .pipe(rename({
      extname: '.wxss',
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', gulp.series(
  gulp.parallel('pug', 'stylus', 'app'),
  () => {
    gulp.watch(pugFiles, gulp.parallel('pug'));
    gulp.watch(stylusFiles, gulp.parallel('stylus'));
    gulp.watch(appStylus, gulp.parallel('app'));
  },
  taskDone => taskDone(),
));

gulp.task('default', gulp.parallel(
  'pug',
  'stylus',
  'app',
  taskDone => taskDone(),
));
