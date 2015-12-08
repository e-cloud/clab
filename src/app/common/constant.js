/**
 * Created by scott on 2015/12/7.
 */

let angular = require('angular')

const APP_DEBUG_MODE = true

angular.module('app.constant', [])
    .constant('DEBUG_MODE', APP_DEBUG_MODE)
    .constant('AppName', 'Creative Lab')
