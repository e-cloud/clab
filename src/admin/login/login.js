/**
 * Created by scott on 2015/12/25.
 */
'use strict';

let angular = require('angular')

angular.module('admin.login', [])
    .config(function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            template: require('./login.html'),
            controller: 'LoginController',
            controllerAs: 'login',
            data: {pageTitle: 'login'}
        })
    })
    .constant('defaultState', 'login')
    .controller('LoginController', function ($scope, $state, projectManager, toastr) {
        let vm = this
        $scope.signIn = function () {
            projectManager.signIn({
                id: vm.username,
                password: vm.password
            }).then(function () {
                $state.go('management')
            }, function () {
                $state.go('management')
                toastr.error('Please try again.', 'Sign In Failed')
            })
        }
    })
