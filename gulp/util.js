/**
 * Created by scott on 2015/12/8.
 */
'use strict';
let gulp = require('gulp')
let _ = require('lodash')

/**
 *
 * @param {Object} taskGroup
 *  {
 *      dependencies now are invoke parallelly as gulp designs. todo:we may turn it into sequence
 *      des: [],
 *      sequence: Boolean,
 *      runner: function(){}
 *  }
 */
gulp.createTasks = function (taskGroup) {
    _.forEach(taskGroup, function (task, id) {
        if (_.isFunction(task)) {
            gulp.task(id, task)
        } else if (_.isObject(task)) {
            try {
                gulp.task(id, task.dep, task.runner)
            } catch (error) {
                throw TypeError('The task', id, 'is an object like {dependencies: [], runner: function(){}}')
            }
        } else {
            throw TypeError('The task', id, 'is not a function or an object like {des: [], runner: function(){}}')
        }
    })
}
