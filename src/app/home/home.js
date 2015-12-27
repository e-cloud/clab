/**
 * Created by scott on 2015/12/8.
 */
'use strict';

let angular = require('angular')
let _ = require('lodash')

angular.module('app.home', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/',
            template: require('./home.html'),
            controller: 'HomeController',
            controllerAs: 'home',
            data: {pageTitle: 'Home'}
        })
    })
    .constant('defaultState', 'home')
    .controller('HomeController', function ($scope, $timeout, projectModal) {

        let vm = this,
            imageUrl = [
                'https://farm9.staticflickr.com/8461/8048823381_0fbc2d8efb.jpg',
                'https://farm5.staticflickr.com/4144/5053682635_b348b24698.jpg',
                'https://farm3.staticflickr.com/2827/10384422264_d9c7299146.jpg',
                'https://farm7.staticflickr.com/6083/6055581292_d94c2d90e3.jpg',
                'https://farm3.staticflickr.com/2827/10384422264_d9c7299146.jpg',
                'https://farm8.staticflickr.com/7187/6895047173_d4b1a0d798.jpg'
            ]

        let gallery = _.map(imageUrl, function (url, id) {
            return {
                id: id,
                name: 'hello world',
                intro: 'welcome to hell',
                show: true,
                thumbnailUrl: url
            }
        })

        vm.shadowGalleryTop = gallery.slice(0, 3)
        vm.shadowGalleryBottom = gallery.slice(3, gallery.length)

        vm.viewProject= function viewProject(id) {
            projectModal.open(id)
        }

        $timeout(function () {
            randomImage()
        }, 3000)



        function randomImage() {
            let rGIndex = _.random(0, gallery.length - 1)

            gallery[rGIndex].show = false
            $timeout(function () {
                let rImgIndex = _.random(0, imageUrl.length - 1)
                gallery[rGIndex].show = true
                gallery[rGIndex].thumbnailUrl = imageUrl[rImgIndex]

                $timeout(randomImage, _.random(3, 6, true) * 1000)
            }, 800)

        }

    })
