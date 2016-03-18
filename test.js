/**
 * Created by scott on 16-3-16.
 */
'use strict'

const webpack = require('webpack')


webpack(require('./webpack.config.development.js'), function (err, stats) {

    console.log('[webpack:build]', stats.toString({
        assets: true,
        colors: true,
        version: true,
        hash: true,
        timings: true,
        chunks: false
    }))
    callback()
}).run()
