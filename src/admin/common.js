/**
 * Created by scott on 2015/12/25.
 */
'use strict';

let angular = require('angular')

angular.module('admin.common', [])
    .constant('DEBUG_MODE', __DEV__)
    .constant('AppName', 'Creative Lab')

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            var defaultState = $injector.get("defaultState");
            $state.go(defaultState);
        })
    })

    /* -----------------------------------------------------------
     * debug log config
     * ----------------------------------------------------------- */
    .config(function ($logProvider, DEBUG_MODE) {
        $logProvider.debugEnabled(DEBUG_MODE)
    })


    /* -----------------------------------------------------------
     * debug css class config
     * ----------------------------------------------------------- */
    .config(function ($compileProvider, DEBUG_MODE) {
        $compileProvider.debugInfoEnabled(DEBUG_MODE)
    })

