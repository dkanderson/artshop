'use strict';
module.exports = function (grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
          'gruntfile.js',
          'public/src/js/*.js',
          'lib/*.js',
          'server.js'
      ]
    },
    
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'public/src/js/vendor/*.js',
          'public/src/js/_*.js'
        ],
        dest: 'public/src/js/scripts.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'public/src/js/index.min.js': [
              'public/src/js/vendor/*.js',
              'public/src/js/_*.js'
          ]
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
      },
      dev: {
        options: {
          map: {
            prev: 'public/src/css/'
          }
        },
        src: 'public/src/css/main.css'
      },
      build: {
        src: 'public/src/css/main.css'
      }
    },
    
    less: {
        development: {
                options: {
                    paths: ['public/src']
                },
            files: {
              'public/src/css/main.css': 'public/src/less/main.less'
            }
        },
        production: {
                options: {
                    paths: ['public/src/css'],
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                        new (require('less-plugin-clean-css'))()
                    ]  
                },
            files: {
              'public/src/css/main.min.css': 'public/src/less/main.less'
            }
        }
    },
    watch: {
      less: {
        files: [
          'public/src/less/*.less'
        ],
        tasks: ['less:development', ]
      },
      js: {
        files: [
          'public/src/js/vendor/*.js',
          'public/src/js/_*.js',
          '<%= jshint.all %>'
        ],
        tasks: ['jshint',]
      },
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: true
        },
        files: [
          'public/src/css/main.css',
          'public/src/js/index.js',
          'index.hmtl'
        ]
      }
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'dev'
  ]);
  grunt.registerTask('dev', [
    'jshint',
    'less:development',
    'autoprefixer:dev'
  ]);
  grunt.registerTask('build', [
    'jshint',
    'less:production',
    'autoprefixer:build',
    'uglify'
  ]);
};
