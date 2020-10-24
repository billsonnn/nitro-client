'use strict';

const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    plugins: [
        new JavaScriptObfuscator({
            compact: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            renameGlobals: true,
            renameProperties: false,
            rotateStringArray: false,
            selfDefending: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArray: true,
            unicodeEscapeSequence: false,
            domainLock: ['nitro.habborw.com']
        }, [ 'runtime.**.js', 'polyfills.**.js', 'vendor.**.js' ])
    ]
};