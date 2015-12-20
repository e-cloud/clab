/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')

angular.module('app.about', [])
    .config(function ($stateProvider) {
        $stateProvider.state('about', {
            url: '/about',
            template: require('./about.html'),
            controller: 'AboutController',
            controllerAs: 'about',
            data: {pageTitle: 'about'}
        })
    })
    .controller('AboutController', function ($scope) {
        $scope.hi = 'hello'
    })
