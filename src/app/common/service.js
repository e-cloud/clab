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

                    rs.data.forEach(function (project, id) {
                        if (!projectList[id]) {
                            projectList[id] = {}
                        }
                        angular.extend(projectList[id], project)
                    })

                    d.resolve(projectList)

                }, function fail(rs) {
                    if (rs.status === 304) {
                        d.resolve(projectList)
                    } else {
                        $log.error('getList failed', rs)
                        d.reject(rs)
                    }
                })

            return d.promise
        }

        function getProject(id) {
            let d = $q.defer()

            return {
                id: id,
                name: 'hello world',
                imageUrl: './asset/spock.jpg',
                description: 'I am spock. hello, guys'
            }


            netWorkService.getProject(id)
                .then(function done(rs) {
                    $log.debug('getProject succeed')

                    angular.extend(projectList[rs.data.id], rs.data)

                    d.resolve(projectList[rs.data.id])

                }, function fail(rs) {
                    if (rs.status === 304) {
                        d.resolve(projectList[id])
                    } else {
                        $log.error('getProject failed', rs)
                        d.reject(rs)
                    }
                })

            return d.promise
        }

        function updateProject(data) {
            return netWorkService.updateProject(data)
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

            $http.get(ServerAPI.projectList + '?t=' + Date.now * Math.random())
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

            $http.get(ServerAPI.project + 't?id=' + id)
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }

        function updateProject(data) {
            let d = $q.defer()

            $http.put(ServerAPI.project, data)
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

            $http.delete(ServerAPI.project + '?id=' + id)
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
