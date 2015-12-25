/**
 * Created by scott on 2015/12/25.
 */
'use strict';

let angular = require('angular')

angular.module('admin.login', [])
    .config(function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            template: require('./login.html'),
            controller: 'LoginController',
            controllerAs: 'login',
            data: {pageTitle: 'login'}
        })
    })
    .constant('defaultState', 'login')
    .controller('LoginController', function ($scope) {
        $scope.hi = 'hello'
    })
