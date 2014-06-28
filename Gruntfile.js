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
                    "./public/css/default.css":"./public/less/themes/default.less",
                    "./public/css/dark.css":"./public/less/themes/dark.less",
                    "./public/css/eco.css":"./public/less/themes/eco.less",
                    "./public/css/other01.css":"./public/less/themes/other01.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('themes_working', ['less','watch']);

};