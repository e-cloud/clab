/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')
let _ = require('lodash')
let $ = require('jquery')

angular.module('app.home', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/',
            template: require('./home.html'),
            controller: 'HomeController',
            controllerAs: 'home',
            data: { pageTitle: 'Home' }
        })
    })
    .constant('defaultState', 'home')

    .controller('HomeController', function ($window, $log, $scope, $timeout, projectModal, projectManager) {
        let vm = this, list

        initMethods()
        initListeners()
        initScope()

        function initListeners() {
            $scope.$on('$viewContentLoaded', function () {
                if (detectIE() >= 9 && !$window.svg4everybody) {
                    $.getScript('//cdn.bootcss.com/svg4everybody/2.0.0/svg4everybody.min.js', function () {
                        $window.svg4everybody()
                    })
                }
            })
        }

        function initMethods() {
            vm.viewProject = function viewProject(id) {
                projectModal.open(id)
            }
        }

        function initScope() {
            projectManager.getList()
                .then(function (data) {
                    list = _.toArray(data)
                    let gallery = list.slice(0, 6)
                    let galleryHalfLen = gallery.length / 2

                    vm.shadowGalleryTop = gallery.slice(0, galleryHalfLen)
                    vm.shadowGalleryBottom = gallery.slice(galleryHalfLen, gallery.length)

                    let temp = _.map(list, function (val, id) {
                        return id
                    })

                    vm.showingIndexes = temp.slice(0, gallery.length)
                    vm.candidateindexes = temp.slice(gallery.length, temp.length)

                    $timeout(function () {
                        randomImage()
                    }, 1000)
                })
        }

        function randomImage() {
            // get the random candidate project index in list
            let rLIndex = vm.candidateindexes[_.random(0, vm.candidateindexes.length - 1)]

            $timeout(function () {
                let rGIndex = _.random(0, vm.showingIndexes.length - 1)
                let rSIndex = vm.showingIndexes[rGIndex]
                let topLen = vm.shadowGalleryTop.length
                if (rGIndex >= topLen) {
                    vm.shadowGalleryBottom[rGIndex - topLen] = list[rLIndex]
                } else {
                    vm.shadowGalleryTop[rGIndex] = list[rLIndex]
                }

                vm.showingIndexes = _.without(vm.showingIndexes, rSIndex)
                vm.showingIndexes.push(rLIndex)
                vm.candidateindexes = _.without(vm.candidateindexes, rLIndex)
                vm.candidateindexes.push(rSIndex)

                $log.debug(vm.showingIndexes, vm.candidateindexes)

                $timeout(randomImage, _.random(0, 1, true) * 1000)
            }, 800)
        }
    })

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // IE 12 / Spartan
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge (IE 12+)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
