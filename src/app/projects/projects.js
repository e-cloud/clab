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
    .controller('ProjectGalleryController', function ($scope, $timeout, projectModal, projectManager) {
        $scope.hi = 'hello'
        this.viewProject = viewProject

        $scope.$on('$viewContentLoaded', function () {
            projectManager.getList()
                .then(function (data) {
                    $scope.projectList = data
                })
        })

        function viewProject(id) {
            projectModal.open(id)
        }
    })
    .factory('projectModal', function ($modal) {
        function open(projectID) {
            let modalInstance = $modal.open({
                animation: true,
                template: require('./project-modal.html'),
                controller: 'ProjectModalController',
                controllerAs: 'pmc',
                size: 'lg',
                resolve: {
                    project: function (projectManager) {
                        return projectManager.getProject(projectID)
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
        $scope.project = project
    })
