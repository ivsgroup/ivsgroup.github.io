module.exports = function(grunt) {
  var path = require("path"),
      fs = require("fs");

  grunt.initConfig({
    pkg: require('./package.json'),
    manifest : (fs.existsSync("./manifest.json") ? require('./manifest.json') : false),
    absolute_root : path.resolve(__dirname)
  });

  grunt.file.expand({filter:'isDirectory'}, 'grunt/**').forEach(grunt.loadTasks);
  
  // default task is to init dev env
  grunt.registerTask('default', [
    'pack',
    'concat',
    'stylus',
    'cssmin',
    'concat:templates'
  ]);

};
