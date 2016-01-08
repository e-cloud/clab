/**
 * Created by scott on 2015/12/7.
 */
'use strict';

let angular = require('angular')
let $ = require('jquery')
let writeChar = require('../../lib/writeChar')

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

        function writeTo(el, message, index, interval, charsPerInterval) {
            // Write a character or multiple characters to the buffer.
            let chars = message.slice(index, index + charsPerInterval);
            index += charsPerInterval;

            // Ensure we stay scrolled to the bottom.
            el.scrollTop = el.scrollHeight;

            writeChar.simple(el, chars);

            // Schedule another write.
            if (index < message.length) {
                writeTo.timeoutSignal = setTimeout(function () {
                    writeTo(el, message, index, interval, charsPerInterval)
                }, interval)
            }
        }

        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                let text = attr.expandable
                let targetElem = $('.expandable', elem)
                let originText = targetElem.text()
                let waitTimeout
                elem.on('mouseenter', function () {
                    clearTimeout(waitTimeout)
                    clearTimeout(writeTo.timeoutSignal)
                    elem.toggleClass('expanding')
                    targetElem.text('')
                    waitTimeout = setTimeout(function () {
                        writeTo(targetElem[0], text, 0, 30, 1);
                    }, 250)

                }).on('mouseleave', async function () {
                    clearTimeout(waitTimeout)
                    clearTimeout(writeTo.timeoutSignal)
                    elem.toggleClass('expanding')
                    targetElem.text('')
                    waitTimeout = setTimeout(function () {
                        writeTo(targetElem[0], originText, 0, 60, 1);
                    }, 500)

                })
            }
        }
    })
