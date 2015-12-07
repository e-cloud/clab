/**
 * Created by Scott on 2015/4/1.
 */
'use strict';

let angular = require('angular')
let app = require('./app.js')

function bootstrap(finishCb) {

    angular.element(document).ready(function () {
        console.log('angular.bootstrap', '### ' + app.name + ' ###', 'modules:', app.requires)

        angular.bootstrap(document, [app.name], {
            //strictDi: true
        })

        finishCb()
    })
}

export default bootstrap

