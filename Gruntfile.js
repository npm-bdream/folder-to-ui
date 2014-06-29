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
                    "./public/css/nutella-default.css":"./public/less/themes/nutella-default.less",
                    "./public/css/nutella-electric.css":"./public/less/themes/nutella-electric.less",
                    "./public/css/nutella-ubuntu.css":"./public/less/themes/nutella-ubuntu.less",
                    "./public/css/nutella-velvety.css":"./public/less/themes/nutella-velvety.less",
                    "./public/css/glow-default.css":"./public/less/themes/glow-default.less",
                    "./public/css/glow-electric.css":"./public/less/themes/glow-electric.less",
                    "./public/css/glow-ubuntu.css":"./public/less/themes/glow-ubuntu.less",
                    "./public/css/glow-velvety.css":"./public/less/themes/glow-velvety.less"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('themes_working', ['less','watch']);

};