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
        taOptions.toolbar[3] = _.without(taOptions.toolbar[3], 'insertImage', 'insertVideo')
    })
    .controller('ManagementController', function ($scope, $timeout, projectModal, projectManager, toastr) {

        let vm = this
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

        function getProjectList() {
            projectManager.getProjectList()
                .then(function (data) {
                    vm.projects = data
                })
        }

        vm.updateProject = function (project) {
            projectModal.open(project)
                .then(function (data) {
                    projectManager.updateProject(data)
                        .then(function () {

                        }, function () {

                        })
                }, function () {

                })
        }

        vm.createProject = function (project) {
            projectModal.open(project)
                .then(function (data) {
                    projectManager.createProject(data)
                        .then(function () {

                        }, function () {

                        })
                }, function () {

                })
        }

        vm.deleteProject = function (project) {
            projectManager.deleteProject(project.id)
                .then(function () {

                }, function () {

                })
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

    .controller('ProjectModalController', function ($scope, $modalInstance, project, ServerAPI, Upload) {
        let vm = this
        $scope.data = _.clone(project, true)

        $scope.upload = upload

        $scope.save = function (){
            $modalInstance.close($scope.data)
        }

        function upload() {
            Upload.upload({
                url: ServerAPI.image,
                fields: {filename: $scope.data.file.name},
                fileFormDataName: 'upload_file',
                file: $scope.data.file,
                timeout: 15 * 1000
            }).success(function (rs) {
                $scope.data.imageUrl = rs.url
            }).error(function (rs) {

            })
        }
    })


