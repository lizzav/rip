const Router= require('express')
const router= new Router()
const taskRouter= require('./taskRouter')

router.use('/tasks',taskRouter)

module.exports=router