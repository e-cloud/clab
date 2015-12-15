/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')
let _ = require('lodash')

angular.module('app.project', [])
    .config(function ($stateProvider) {
        /*$stateProvider.state('root.project', {
            abstract: true,
            url: '',
            //template: require('./project.html'),
            controller: 'ProjectController',
            controllerAs: 'project',
            data: {pageTitle: 'project'}
        })*/

        $stateProvider.state('root.detail', {
            url: '/project/{projectId:[0-9]{1,4}}',
            template: require('./detail.html'),
            controller: 'ProjectDetailController',
            controllerAs: 'detail',
            data: {pageTitle: 'project detail'}
        })
    })
    .controller('ProjectController', function ($scope) {
        $scope.hi = 'hello'
    })
    .controller('ProjectDetailController', function ($scope) {
        $scope.hi = 'hello'
    })
