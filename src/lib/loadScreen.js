/**
 * Created by Saint Scott on 2015/3/31.
 */
import $ from 'jquery'

let loadScreen = {
    loaded: function () {
        $('body').addClass('loaded');
        setTimeout(function () {
            $('body').addClass('load-finished');
        }, 3000);
    },
    loading: function () {
        $('body').removeClass();
    }
}
export default loadScreen
