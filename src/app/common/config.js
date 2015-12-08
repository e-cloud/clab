/**
 * Created by scott on 2015/12/7.
 */

let angular = require('angular')

angular.module('app.config', [])
    /* -----------------------------------------------------------
     * set up HttpInterceptor
     * ----------------------------------------------------------- */
    .config(function ($httpProvider, DEBUG_MODE) {
        // push an interceptor into the queue
        //$httpProvider.interceptors.push('HttpInterceptor')
        //$httpProvider.defaults.withCredentials = DEBUG_MODE
    })


    /* -----------------------------------------------------------
     * setup ngCookie
     * ----------------------------------------------------------- */
    .config(function ($cookiesProvider) {
        angular.extend($cookiesProvider.defaults, {
            expires: new Date(Date.now() + 1000 * 3600 * 24 * 180)
        })
    })


    /* -----------------------------------------------------------
     * debug log config
     * ----------------------------------------------------------- */
    .config(function ($logProvider, DEBUG_MODE) {
        $logProvider.debugEnabled(DEBUG_MODE)
    })


    /* -----------------------------------------------------------
     * debug css class config
     * ----------------------------------------------------------- */
    .config(function ($compileProvider, DEBUG_MODE) {
        $compileProvider.debugInfoEnabled(DEBUG_MODE)
    })


    /* -----------------------------------------------------------
     * 对原生 $log 服务进行包装，使其能够输出时间戳
     * ----------------------------------------------------------- */
    .config(function ($provide, $logProvider) {
        // Use the `decorator` solution to substitute or attach behaviors to
        // original service instance; @see angular-mocks for more examples....

        /*$provide.decorator('$log', function ($delegate) {
         if ($logProvider.debugEnabled()) {
         $delegate.trace = function () {
         console.trace.apply(console, arguments)
         }
         } else {
         $delegate.trace = angular.noop
         }
         return $delegate
         })*/


        /*$provide.decorator('$log', function ($delegate) {
         // Save the original $log.debug()
         var newLog = {}

         angular.forEach($delegate, function (val, key, list) {
         var targetFn = val

         newLog[key] = function () {
         var args = Array.prototype.slice.call(arguments),
         now  = moment().format('YYYY-MM-DD hh:mm:ss.SSS >> ')

         // Prepend timestamp
         args.unshift(now)

         // Call the original with the output prepended with formatted timestamp
         targetFn.apply(null, args)
         }
         })

         angular.extend($delegate, newLog)

         return $delegate
         })*/
    })


    /* -----------------------------------------------------------
     * 设置非法路径跳转
     * ----------------------------------------------------------- */
    .config(function ($urlRouterProvider) {
        /* $urlRouterProvider.otherwise(function ($injector) {
         var $state = $injector.get("$state");
         var defaultState = $injector.get("defaultState");
         $state.go(defaultState);
         })*/
    })
