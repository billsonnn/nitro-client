'use strict';

const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    plugins: [
        new JavaScriptObfuscator({
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            shuffleStringArray: true,
            splitStrings: false,
            stringArray: true,
            unicodeEscapeSequence: false
        }, [ 'runtime.**.js', 'polyfills.**.js', 'vendor.**.js' ])
    ]
};