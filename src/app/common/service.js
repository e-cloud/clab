/**
 * Created by scott on 2015/12/7.
 */
let angular = require('angular')
let _ = require('lodash')

angular.module('app.service', [])
    .constant('ServerAPI', {
        projectList: '/projects',
        project: '/project',
        image: '/file',
        signIn: '/signin',
        signOut: '/signout',
        password: '/password'
    })
    .constant('serverAddress', '//45.79.133.245')
    .constant('APIVersion', 'v1')
    .constant('AuthCache', {
        key: null
    })
    .config(function (ServerAPI, APIVersion, serverAddress) {
        angular.forEach(ServerAPI, function (api, name) {
            ServerAPI[name] = `${serverAddress}/${APIVersion}${api}`
        })
    })
    .factory('projectManager', function ($log, $q, netWorkService) {

        let projectList = {}
        let isSignIned = false
        let userId = 'John Doe'

        return {
            getList,
            getProject,
            updateProject,
            deleteProject,
            createProject,
            signIn,
            signOut,
            password,
            hasSignIned,
            getId
        }

        function getId() {
            return userId
        }

        function hasSignIned() {
            return isSignIned
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

            d.resolve(projectList[id])

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

        function signIn(data) {
            return netWorkService.signIn(data)
                .then(function done(rs) {
                    $log.debug('signIn succeed')
                    userId = data.id
                    isSignIned = true
                    return rs
                }, function fail(rs) {
                    $log.error('signIn failed', rs)
                    return $q.reject(rs)
                })
        }

        function signOut(data) {
            return netWorkService.signOut(data)
                .then(function done(rs) {
                    $log.debug('signOut succeed')
                    isSignIned = false
                    return rs
                }, function fail(rs) {
                    $log.error('signOut failed', rs)
                    return $q.reject(rs)
                })
        }

        function password(data) {
            return netWorkService.password(data)
                .then(function done(rs) {
                    $log.debug('password succeed')
                    return rs
                }, function fail(rs) {
                    $log.error('password failed', rs)
                    return $q.reject(rs)
                })
        }

    })
    .factory('netWorkService', function ($http, $httpParamSerializerJQLike, $q, ServerAPI, AuthCache) {

        return {
            getProjectList,
            getProject,
            updateProject,
            deleteProject,
            createProject,
            signIn,
            signOut,
            password
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

        function signIn(data) {
            let d = $q.defer()

            $http.post(ServerAPI.signIn, $httpParamSerializerJQLike(data), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function (rs, status, getHeaders) {
                    AuthCache.key = getHeaders('code')
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }

        function signOut(data) {
            let d = $q.defer()

            $http.post(ServerAPI.signOut, data)
                .success(function (rs) {
                    AuthCache.key = null
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }

        function password(data) {
            let d = $q.defer()

            $http.post(ServerAPI.password, $httpParamSerializerJQLike(data), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function (rs) {
                    d.resolve(rs)
                })
                .error(function (rs) {
                    d.reject(rs)
                })

            return d.promise
        }
    })
    /* -----------------------------------------------------------
     * 对匹配的http请求及响应进行中间处理
     * ----------------------------------------------------------- */
    .factory('HttpInterceptor', function ($cookies, $q, AuthCache) {
        let interceptor = {
            request: function (config) {
                if (!config.timeout) {
                    config.timeout = 8000
                }

                if (config && AuthCache.key) {
                    config.headers.Authorization = `Basic ${AuthCache.key}`
                }

                return config || $q.when(config)
            }
        }

        return interceptor
    })
