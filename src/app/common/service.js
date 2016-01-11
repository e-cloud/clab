/**
 * Created by scott on 2015/12/7.
 */
let angular = require('angular')
let _ = require('lodash')

angular.module('app.service', [])
    .constant('ServerAPI', {
        projectList: '/projects',
        project: '/project',
        image: '/file'
    })
    .constant('serverAddress', '//45.79.133.245')
    .constant('APIVersion', 'v1')
    .config(function (ServerAPI, APIVersion, serverAddress) {
        angular.forEach(ServerAPI, function (api, name) {
            ServerAPI[name] = `${serverAddress}/${APIVersion}${api}`
        })
    })
    .factory('projectManager', function ($log, $q, netWorkService) {

        let projectList = {}

        return {
            getList: getList,
            getProject: getProject,
            updateProject: updateProject,
            deleteProject: deleteProject,
            createProject: createProject
        }

        function getList() {

            let d = $q.defer()

            netWorkService.getProjectList()
                .then(function done(rs) {
                    $log.debug('getList succeed')

                    rs.forEach(function (project) {
                        if (!projectList[project.id]) {
                            projectList[project.id] = project
                        } else {
                            _.assign(projectList[project.id], project)
                        }
                    })

                    d.resolve(projectList)

                }, function fail(rs) {
                    $log.error('getList failed', rs)
                    d.reject(rs)
                })

            return d.promise
        }

        function getProject(id) {
            let d = $q.defer()

            netWorkService.getProject(id)
                .then(function done(rs) {
                    $log.debug('getProject succeed')

                    _.assign(projectList[rs.id], rs.data)

                    d.resolve(projectList[rs.id])

                }, function fail(rs) {
                    $log.error('getProject failed', rs)
                    d.reject(rs)
                })

            return d.promise
        }

        function updateProject(id, data) {
            return netWorkService.updateProject(id, data)
                .then(function done(rs) {
                    $log.debug('updateProject succeed')
                    return rs
                }, function fail(rs) {
                    $log.error('updateProject failed', rs)
                    return $q.reject(rs)
                })
        }

        function deleteProject(id) {
            return netWorkService.deleteProject(id)
                .then(function done(rs) {
                    $log.debug('deleteProject succeed')
                    delete projectList[id]
                    return rs
                }, function fail(rs) {
                    $log.error('deleteProject failed', rs)
                    return $q.reject(rs)
                })
        }

        function createProject(data) {
            return netWorkService.createProject(data)
                .then(function done(rs) {
                    $log.debug('createProject succeed')
                    return rs
                }, function fail(rs) {
                    $log.error('createProject failed', rs)
                    return $q.reject(rs)
                })
        }

    })
    .factory('netWorkService', function ($http, $q, ServerAPI) {

        return {
            getProjectList: getProjectList,
            getProject: getProject,
            updateProject: updateProject,
            deleteProject: deleteProject,
            createProject: createProject
        }

        function getProjectList() {
            let d = $q.defer()

            $http.get(ServerAPI.projectList)
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise

        }

        function getProject(id) {
            let d = $q.defer()

            $http.get(ServerAPI.project + '/' + id)
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }

        function updateProject(id, data) {
            let d = $q.defer()

            $http.put(ServerAPI.project + '/' + id, data)
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }

        function deleteProject(id) {
            let d = $q.defer()

            $http.delete(ServerAPI.project + '/' + id)
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }

        function createProject(data) {
            let d = $q.defer()

            $http.post(ServerAPI.project, data)
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }
    })
