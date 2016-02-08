var filter = require('mout/object/filter');


module.exports = function(grunt) {

  var manifest = grunt.config.get('manifest');
  var files = Object.keys(filter(manifest.files, function(v, k) {
     return (v.concat === undefined ? manifest.behavior.concat : !!v.concat);
  }));

  grunt.config('concat.scripts', {
    options: {
      separator: ';'
    },
    dest: 'app/app.js',
    src: files,
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};
