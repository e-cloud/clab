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
    .controller('ManagementController', function ($scope, $state, $uibModalStack, $timeout, projectModal, projectManager, pwdModal, toastr) {

        let vm = this

        $scope.$on('$stateChangeStart', function () {
            $uibModalStack.dismissAll('state change')
        })

        getProjectList()

        function getProjectList() {
            projectManager.getList()
                .then(function (data) {
                    vm.projects = data
                })
        }

        vm.updateProject = function (project) {
            projectModal.open({project: project})
                .then(function (res) {
                    let data = res.attr
                    if (res.imageUrl) {
                        data.url = res.imageUrl
                    }
                    projectManager.updateProject(project.id, data)
                        .then(function () {
                            toastr.success('update project info successfully')
                            getProjectList()
                        }, function () {
                            toastr.error('update project failed, try again')
                        })
                }, function () {

                })
        }

        vm.createProject = function () {
            projectModal.open({project: {}, isCreate: true})
                .then(function (res) {
                    let data = res.attr
                    data.url = res.imageUrl
                    projectManager.createProject(data)
                        .then(function () {
                            toastr.success(`create project <${data.name}> successfully`)
                            getProjectList()
                        }, function () {
                            toastr.error(`create project <${data.name}> failed, try again`)
                        })
                }, function () {

                })
        }

        vm.deleteProject = function (project) {
            projectManager.deleteProject(project.id)
                .then(function () {
                    toastr.success(`delete project <${project.attr.name}> successfully`)
                    getProjectList()
                }, function () {
                    toastr.error(`delete project <${project.attr.name}> failed, try again`)
                })
        }

        vm.changePwd = function () {
            pwdModal.open()
                .then(function () {
                    vm.signout()
                })
        }

        vm.signout = function () {
            projectManager.signOut()
                .then(function () {
                    $state.go('login')
                })
        }
    })

    .factory('projectModal', function ($uibModal) {
        function open(option) {
            var modalInstance = $uibModal.open({
                animation: true,
                template: require('./project-modal.html'),
                controller: 'ProjectModalController',
                controllerAs: 'pmc',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    option: function () {
                        return option
                    }
                }
            })
            return modalInstance.result
        }

        return {
            open: open
        }
    })

    .controller('ProjectModalController', function ($scope, $log, $uibModalInstance, option, ServerAPI, Upload, toastr, serverAddress, DEBUG_MODE) {
        let vm = this
        $scope.data = _.clone(option.project, true)
        $scope.isCreate = option.isCreate

        $scope.upload = upload

        $scope.save = function () {
            $uibModalInstance.close($scope.data)
        }

        if (DEBUG_MODE) {
            $scope.serverAddress = serverAddress + '/'
        } else {
            $scope.serverAddress = ''
        }

        $scope.uploadState = {
            progress: 0
        }

        $scope.$on('$destroy', function () {
            $scope.uploadInstance && $scope.uploadInstance.abort()
        })

        function upload() {
            $scope.uploadState.progress = 0

            $scope.uploadInstance = Upload.upload({
                url: ServerAPI.image,
                fields: {filename: $scope.data.file.name},
                fileFormDataName: 'upload_file',
                file: $scope.data.file,
                timeout: 15 * 1000
            })

            $scope.uploadInstance.then(function success(rs) {
                toastr.success('upload image successfully')
                $scope.data.imageUrl = rs.data.url
                $scope.uploadState.type = 'success'
            }, function error(rs) {
                toastr.error('upload error, please try again!')
                $log.debug(rs)
            }, function notify(evt) {
                $scope.uploadState.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
                $log.debug(evt)
            }).finally(function () {
                $scope.uploadState.loading = false
            })

            $scope.uploadState.type = 'info'
            $scope.uploadState.loading = true
        }
    })
    .factory('pwdModal', function ($uibModal) {
        function open() {
            var modalInstance = $uibModal.open({
                animation: true,
                template: require('./changePwd.html'),
                controller: 'PwdModalController',
                controllerAs: 'pwd',
                backdrop: 'static'
            })
            return modalInstance.result
        }

        return {
            open: open
        }
    })
    .controller('PwdModalController', function ($scope, $uibModalInstance, projectManager, toastr) {
        $scope.save = function () {
            projectManager.password({
                    id: projectManager.getId(),
                    oldPassword: $scope.oldPwd,
                    newPassword: $scope.newPwd
                })
                .then(function () {
                    $uibModalInstance.close()
                    toastr.success('Password has Been Changed! Please Sign in again.')
                }, function () {
                    toastr.error('Change Password Failed. Try Again!')
                })
        }
    })


