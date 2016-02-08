module.exports = function(grunt) {
  grunt.config('cssmin', {
    default: {
      options : {
        noAdvanced : true,
      },
      files: {
       'theme/main.css' : ['theme/_main.css'],
      }
    }
  } );

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
