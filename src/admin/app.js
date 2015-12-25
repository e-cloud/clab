/**
 * Created by scott on 2015/12/25.
 */
/**
 * Created by scott on 2015/12/7.
 */
'use strict';

import './common'
import './login/login'
import './management/management'

import bootstrap from '../app/bootstrap'

require('angular-ui-router')
require('angular-ui-bootstrap')
require('angular-animate')
require('angular-messages')
require('angular-cookies')
require('ng-file-upload')

let _ = require('lodash')
let angular = require('angular')
let app = angular.module('admin', [
        'ngCookies',
        'ngAnimate',
        'ngMessages',
        'ui.router',
        'ui.bootstrap',
        'ngFileUpload',

        'admin.common',

        'admin.login',
        'admin.management'
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


bootstrap(app)

export default app
