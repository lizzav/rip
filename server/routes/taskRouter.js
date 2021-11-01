const Router= require('express')
const router= new Router()
const taskController = require('../controllers/taskController')

router.get('/',taskController.getAll)
router.post('/', taskController.create)
router.get('/one', taskController.getOne)
router.delete('/', taskController.delete)
router.put('/', taskController.update)

module.exports=router