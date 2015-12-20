/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')

angular.module('app.contact', [])
    .config(function ($stateProvider) {
        $stateProvider.state('contact', {
            url: '/contact',
            template: require('./contact.html'),
            controller: 'ContactController',
            controllerAs: 'contact',
            data: {pageTitle: 'contact'}
        })
    })
    .controller('ContactController', function ($scope) {
        $scope.hi = 'hello'
    })
