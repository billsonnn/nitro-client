'use strict';

const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    plugins: [
        new JavaScriptObfuscator({
            compact: true,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            renameProperties: true,
            rotateStringArray: true,
            selfDefending: true,
            shuffleStringArray: true,
            stringArray: true
        }, [ 'runtime.**.js', 'polyfills.**.js', 'vendor.**.js' ])
    ]
};