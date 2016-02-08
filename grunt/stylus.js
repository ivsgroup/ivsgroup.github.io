module.exports = function(grunt) {
  grunt.config('stylus', {
    compile: {
      options: {
        compress : false
      },
      files: {
        'theme/stylus.css': 'theme/_main.styl',
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-stylus');
};

