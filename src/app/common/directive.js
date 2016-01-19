/**
 * Created by scott on 2015/12/7.
 */
'use strict';

let angular = require('angular')
let $ = require('jquery')
let writeChar = require('../../lib/writeChar')
let loadImage = require('blueimp-load-image')
let Promise = require('bluebird')

Promise.config({
    // Enables all warnings except forgotten return statements.
    warnings: {
        wForgottenReturn: false
    }
});

angular.module('app.directive', [])
    .directive('mainLayout', function () {
        return {
            restrict: 'EA',
            template: require('./main_layout.html'),
            replace: true
        }
    })
    .directive('customNav', function () {
        return {
            restrict: 'EA',
            template: require('./nav.html'),
            replace: true
        }
    })
    .directive('expandable', function () {

        async function writeTo(elem, message, index, interval, charsPerInterval) {
            // Write a character or multiple characters to the buffer.
            let chars = message.slice(index, index + charsPerInterval);
            index += charsPerInterval;

            // Ensure we stay scrolled to the bottom.
            elem.scrollTop = elem.scrollHeight;

            writeChar.simple(elem, chars);

            // Schedule another write.
            if (index < message.length) {
                await Promise.delay(interval);
                return writeTo(elem, message, index, interval, charsPerInterval)
            } else {
                return Promise.resolve();
            }
        }

        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                let expandText = attr.expandable
                let targetElem = $('.expandable', elem)
                let originText = targetElem.text()
                let entered = false, left = false, writing = false, expandPromise, originPromise
                elem.on('mouseenter', function () {
                    entered = true
                    left = false
                    if (!writing) {
                        writeExpand()
                    }

                }).on('mouseleave', function () {
                    entered = false
                    left = true
                    if (!writing) {
                        writeOrigin()
                    }
                })

                async function writeExpand() {
                    writing = true
                    elem.toggleClass('expanding')
                    targetElem.text('')
                    await Promise.delay(400)
                    return writeTo(targetElem[0], expandText, 0, 30, 1)
                        .then(async function () {
                            writing = false
                            if (left) {
                                await Promise.delay(500)
                                return writeOrigin()
                            }
                            return null
                        })
                }

                async function writeOrigin() {
                    writing = true
                    elem.toggleClass('expanding')
                    targetElem.text('')
                    await Promise.delay(600)
                    return writeTo(targetElem[0], originText, 0, 60, 1)
                        .then(function () {
                            writing = false
                            return null
                        })
                }
            }
        }
    })
    .directive('imageLoader', function ($q, $animateCss) {
        return {
            restrict: 'A',
            scope: {
                imageLoader: '='
            },
            template: require('./loader.html'),
            link ($scope, $elem, $attr) {

                $scope.$watch('imageLoader', function (newVal) {
                    if (!newVal) return

                    load(newVal)
                        .then(function () {
                            $elem.css('background-image', `url(${newVal})`)
                        }, function () {

                        })
                })
            }
        }

        function load(url) {
            let d = $q.defer()
            loadImage(url, function (img) {
                if (img.type === "error") {
                    d.reject()
                } else {
                    d.resolve()
                }
            })
            return d.promise
        }
    })
    .directive('loader', function () {
        return {
            restrict: 'E',
            template: require('./loader.html'),
            link ($scope, $elem, $attr) {

            }
        }
    })

