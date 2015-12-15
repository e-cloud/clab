/**
 * Created by scott on 2015/12/7.
 */
'use strict';

let angular = require('angular')

angular.module('app.directive', [])
    .directive('customNav', function () {
        return {
            restrict: 'EA',
            template: require('./nav.html'),
            replace: true
        }
    })
