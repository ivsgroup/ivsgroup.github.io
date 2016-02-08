module.exports = function(grunt) {

  grunt.config('watch.stylus', {
      files: ['theme/**/*.styl'],
      tasks: [
        'stylus'
      ]
  });

  grunt.config('watch.css', {
      files: ['theme/**/*.css', '!theme/main.css'],
      tasks: [
        'cssmin'
      ]
  });

  grunt.config('watch.scripts', {
      files: ['app/**/*.js', 'vendor/**/*.js', '!app/_bootstrap.js', '!app/app.js'],
      tasks: [
        'pack',
        'concat:scripts'
      ]
  });

  grunt.config('watch.templates', {
      files: ['app/templates/**/*.xml'],
      tasks: [
        'concat:templates'
      ]
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};

