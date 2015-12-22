/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')
let _ = require('lodash')

angular.module('app.projects', [])
    .config(function ($stateProvider) {
        $stateProvider.state('projects', {
            url: '/projects',
            template: require('./projects.html'),
            controller: 'ProjectGalleryController',
            controllerAs: 'projects',
            data: {pageTitle: 'project gallery'}
        })
    })
    .controller('ProjectGalleryController', function ($scope, $timeout) {
        $scope.hi = 'hello'

        $timeout(function () {
            let list = []
            list.length = 20
            _.fill(list, {
                id: 2,
                name: 'hello world',
                imageUrl: '/asset/spock.jpg',
                description: 'I am spock. hello, guys'
            })
            $scope.projectList = list
        }, 1000)
    })
