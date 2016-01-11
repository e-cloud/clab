/**
 * Created by scott on 2015/12/25.
 */
'use strict';
import '../app/common/config'
import '../app/common/service'

let angular = require('angular')

angular.module('admin.constant', [])
    .constant('DEBUG_MODE', __DEV__)
    .constant('AppName', 'Creative Lab')

angular.module('admin.common', ['admin.constant', 'app.config', 'app.service'])
    /* -----------------------------------------------------------
     * 配置toastr
     * ----------------------------------------------------------- */
    .config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: true,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 3,
            autoDismiss: true,
            newestOnTop: true,
            messageClass: 'toast-message',
            positionClass: 'toast-bottom-right',
            preventOpenDuplicates: true,
            tapToDismiss: true,
            timeOut: 3000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        })
    })

    /* -----------------------------------------------------------
     * ladda 配置
     * ----------------------------------------------------------- */
    .config(function (laddaProvider) {
        laddaProvider.setOption({
            style: 'expand-left'
        });
    })

