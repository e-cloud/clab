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
require('angular-toastr')
require('angular-ladda')
require('ng-file-upload')

require('textangular/dist/textAngular-sanitize.min')
require('../lib/textAngular.js')

let _ = require('lodash')
let angular = require('angular')
let app = angular.module('admin', [
        'ngCookies',
        'ngAnimate',
        'ngMessages',
        'ui.router',
        'ui.bootstrap',
        'ngFileUpload',
        'textAngular',
        'toastr',
        'angular-ladda',

        'admin.common',

        'admin.login',
        'admin.management'
    ])

    .controller('RootController', function ($scope) {
        $scope.hello = 'hello'
    })

    .run(function ($rootScope, $log, $state, AppName, projectManager) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.pageTitle = $state.current.data.pageTitle + ' - ' + AppName
        })

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {

            $log.debug({
                'toState': JSON.stringify(toState),
                'fromState': JSON.stringify(fromState)
            })

            let isAuthenticationRequired = toState.name.indexOf('management') > -1 && !projectManager.hasSignIned()

            if(isAuthenticationRequired){
                event.preventDefault()
                return $state.go('login')
            }

        })
    })


bootstrap(app)

export default app
