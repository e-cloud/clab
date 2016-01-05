/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')

angular.module('app.contact', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('connect', {
            url: '/connect',
            template: require('./contact.html'),
            controller: 'ConnectController',
            controllerAs: 'connect',
            data: {pageTitle: 'connect'}
        })

    })
    .controller('ConnectController', function ($scope) {
        $scope.hi = 'hello'
    })
