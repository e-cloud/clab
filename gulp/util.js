/**
 * Created by scott on 2015/12/8.
 */
'use strict';
let gulp = require('gulp')

gulp.create_tasks = function (group) {
    for (var id in group) {
        gulp.task(id, group[id])
    }
}
