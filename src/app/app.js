/**
 * Created by scott on 2015/12/7.
 */
'use strict';

import './common/constant'
import './common/config'
import './common/filter'
import './common/service'
import './common/directive'

import './home/home'
import './about/about'
import './contact/contact'
import './projects/projects'
import './projectTpl/project'


require('angular-ui-router')
require('angular-ui-bootstrap')
require('angular-animate')
require('angular-messages')
require('angular-cookies')

let _ = require('lodash')
let angular = require('angular')
let app = angular.module('App', [
        'ngCookies',
        'ngAnimate',
        'ngMessages',
        'ui.router',
        'ui.bootstrap',

        'app.constant',
        'app.config',
        'app.directive',

        'app.home',
        'app.about',
        'app.contact',
        'app.projects',
        'app.project'
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
            var $state = $injector.get("$state");
            var defaultState = $injector.get("defaultState");
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

export default app
