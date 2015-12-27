/**
 * Created by scott on 2015/12/7.
 */
'use strict';
import './common/common'

import './home/home'
import './about/about'
import './contact/contact'
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
        'app.contact',
        'app.projects'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        /*$stateProvider.state('root', {
            abstract: true,
            template: require('./common/main_layout.html'),
            controller: 'RootController',
            controllerAs: 'rc',
            data: {pageTitle: 'root'}
        })*/

        $urlRouterProvider.otherwise(function ($injector) {
            let $state = $injector.get("$state");
            let defaultState = $injector.get("defaultState");
            $state.go(defaultState);
        })
    })

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
