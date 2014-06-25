// Start grunt app
module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            options: { spawn: false },
            theme: {
                files: [
                        './public/less/**/*.less'
                ],
                tasks: ['less:theme']
            }
        },
        less: {
            theme: {
                options: {
                    cleancss: true
                },
                files: {
                    "./public/css/default.css":"./public/less/default/default.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('themes_working', ['watch']);

};