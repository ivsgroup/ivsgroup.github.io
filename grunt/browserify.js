var fs = require('fs');
var cp = require('child_process');

module.exports = function(grunt) {

  grunt.config('browserify', {
    options : {

      browserifyOptions : {
        transform : false
      },
    },

    pack : {
      files: {
        'app/_bootstrap.js': ['app/init.js'],
      }
    }
  });


  grunt.registerTask('pack', ['browserify']);

  grunt.loadNpmTasks('grunt-browserify');
};