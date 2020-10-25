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
            identifierNamesGenerator: 'mangled',
            log: false,
            renameGlobals: true,
            renameProperties: false,
            rotateStringArray: false,
            selfDefending: true,
            shuffleStringArray: false,
            splitStrings: false,
            stringArray: false,
            unicodeEscapeSequence: false,
            domainLock: ['nitro.habborw.com']
        }, [ 'runtime.**.js', 'polyfills.**.js', 'vendor.**.js' ])
    ]
};