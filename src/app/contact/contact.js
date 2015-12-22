/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')

angular.module('app.contact', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('learn', {
            url: '/contact/learn',
            template: require('./learn.html'),
            controller: 'LearnController',
            controllerAs: 'learn',
            data: {pageTitle: 'learn'}
        })

        $urlRouterProvider.when('/contact', '/contact/learn')

        $stateProvider.state('collaborate', {
            url: '/contact/collaborate',
            template: require('./collaborate.html'),
            controller: 'CollaborateController',
            controllerAs: 'collaborate',
            data: {pageTitle: 'collaborate'}
        })

        $stateProvider.state('press', {
            url: '/contact/press',
            template: require('./press.html'),
            controller: 'PressController',
            controllerAs: 'press',
            data: {pageTitle: 'press'}
        })
    })
    .controller('LearnController', function ($scope) {
        $scope.hi = 'hello'
    })
    .controller('CollaborateController', function ($scope) {
        $scope.hi = 'hello'
    })
    .controller('PressController', function ($scope) {
        $scope.hi = 'hello'
    })
