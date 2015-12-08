/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')
let _ = require('lodash')

angular.module('app.projects', [])
    .config(function ($stateProvider) {
        $stateProvider.state('root.projects', {
            url: '/projects',
            template: require('./projects.html'),
            controller: 'ProjectGalleryController',
            controllerAs: 'projects',
            data: {pageTitle: 'project gallery'}
        })
    })
    .controller('ProjectGalleryController', function ($scope, $timeout) {
        $scope.hi = 'hello'

        $timeout(function(){
            let list = []
            list.length = 50
            _.fill(list, {
                id: 2,
                name: 'hello world',
                imageUrl: '******'
            })
            $scope.projectList = list
        }, 3000)
    })
