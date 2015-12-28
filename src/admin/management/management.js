/**
 * Created by scott on 2015/12/25.
 */
'use strict';

const angular = require('angular')
const _ = require('lodash')

angular.module('admin.management', [])
    .config(function ($stateProvider) {
        $stateProvider.state('management', {
            url: '/management',
            template: require('./management.html'),
            controller: 'ManagementController',
            controllerAs: 'management',
            data: {pageTitle: 'management'}
        })
    })
    .run(function (taOptions) {
        taOptions.toolbar[3]=_.without(taOptions.toolbar[3], 'insertImage', 'insertVideo')
    })
    .controller('ManagementController', function ($scope, $timeout, projectModal) {

        var vm = this
        $scope.hi = 'hello'

        $timeout(function () {
            let list = []
            list.length = 20
            _.fill(list, {
                id: 2,
                name: 'hello world',
                imageUrl: './asset/spock.jpg',
                description: 'I am spock. hello, guys'
            })
            vm.projects = list
        }, 1000)

        vm.updateProject = function (project) {
            projectModal.open(project)
        }

        vm.createProject = function (project) {
            projectModal.open(project)
        }
    })


    .factory('projectModal', function ($modal) {
        function open(project) {
            var modalInstance = $modal.open({
                animation: true,
                template: require('./project-modal.html'),
                controller: 'ProjectModalController',
                controllerAs: 'pmc',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    project: function () {
                        return project
                    }
                }
            })
            return modalInstance.result
        }

        return {
            open: open
        }
    })

    .controller('ProjectModalController', function ($scope, project) {
        $scope.data = angular.copy(project)
    })


