/**
 * Created by yqdong on 2018/4/21.
 * qq: 1013501639
 * @author yqdong
 *
 */
import {util} from '../../util'
let router = {
  index: '',
  project: {
    create: '',
    manage: ''
  },
  console: {
    index: '',
    devView: '',
    docView: ''
  },
  login: ''
}
util.initializeConstants(router, 'router')
export default router
