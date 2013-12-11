// Grunt configuration.
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %> \n' +
      ' * <%= pkg.homepage ? pkg.homepage : "" %> \n' +
      ' * @author <%= pkg.author%> \n' + 
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.company %> <%= pkg.author %>;' + 
      ' Licensed <%= pkg.license %>\n */\n',
	  uglify: {
	    options: {
	      banner: '<%= banner %>'
	    },
	    min: {
	      files: {
	        'min/jquery.decorateScrollBar.min.js': ['src/jquery.decorateScrollBar.js']
	      }
	    }
	  },
		cssmin: {
			options: {
        banner: '<%= banner %>'
      },
		  min: {
				files: {
				  'min/jquery.decorateScrollBar.min.css': ['src/jquery.decorateScrollBar.css']
				}
		  }
		}

	});
 
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
 
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);
 
};
