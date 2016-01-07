/**
 * Created by scott on 2015/12/7.
 */
'use strict';
import './common/common'

import './home/home'
import './about/about'
import './connect/connect'
import './projects/projects'

import bootstrap from './bootstrap'

require('angular-ui-router')
require('angular-ui-bootstrap')
require('angular-animate')
require('angular-messages')
require('angular-cookies')

let _ = require('lodash')
let angular = require('angular')
let app = angular.module('app', [
        'ngCookies',
        'ngAnimate',
        'ngMessages',
        'ui.router',
        'ui.bootstrap',

        'app.common',

        'app.home',
        'app.about',
        'app.connect',
        'app.projects'
    ])

    .controller('RootController', function ($scope) {
        $scope.hello = 'hello'
    })

    .run(function ($rootScope, $log, $state, AppName) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.pageTitle = $state.current.data.pageTitle + ' - ' + AppName
        })

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {

            $log.debug({
                'toState': JSON.stringify(toState),
                'fromState': JSON.stringify(fromState)
            })

        })
    })

    .run(function ($templateCache) {
        $templateCache.put("nav.tpl.html", require('./common/nav.html'))
    })

bootstrap(app)

export default app
