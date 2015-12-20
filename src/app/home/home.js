/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')
let _ = require('lodash')

angular.module('app.home', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/',
            template: require('./home.html'),
            controller: 'HomeController',
            controllerAs: 'rc',
            data: {pageTitle: 'home'}
        })

    })
    .constant('defaultState', 'home')
    .controller('HomeController', function ($scope) {
        $scope.hi = 'hello'
    })
