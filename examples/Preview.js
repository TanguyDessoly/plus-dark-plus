//RANDOM CODE FOUND ON THE WEB
const config = require('../../../../config')
const api = require('../../../../utils/api')()

router.post('/',
    ctStart(path.join(__filename, ':/')),
    (req, res, next) => {
        res.locals.myDatas = []
        res.locals.showMessage = false
        res.locals.message = ''
        res.locals.error = false
        return next()
    },
    [
        // check for error =====================================================================
        (req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let message = errors.mapped()
                res.locals.myDatas.push(message)
                res.locals.error = true
                return next('route')
            }
            return next()
        }
    ],
    // set all body or query in bodyquery locals
    (req, res, next) => {
        res.locals.bodyquery = {}
        for (let query in req.query) {
            let key = query.slice()
            res.locals.bodyquery[key] = req.query[query]
        }
        for (let body in req.body) {
            let key = body.slice()
            res.locals.bodyquery[key] = req.body[body]
        }
        // let message = `bodyquery parameters: ${JSON.stringify(res.locals.bodyquery)}`
        // res.locals.myDatas.push(message)
        // userLog.info({ message, __filename, id: res.locals.bodyquery.userId })
        return next()
    },
    async (req, res, next) => {

        let sql = `
        INSERT INTO product(
            productCreateBy, productType,productParentId
        )
        VALUES(
            ?,?, 'Article', (SELECT pop.productId FROM (SELECT productId FROM product WHERE productCode = 'Logistique') AS pop)
        )`
        let params = [req.user.userId]
        let result
        try {
            kmSysLog.debug(pool.format(sql, params).replace(/(  \r\n|\n|\r)/gm, ''))

            result = await pool.query(sql, params)
        } catch (error) {
            let message = `${error} - ${__filename} - not able to create an product`
            kmSysLog.error({ message, error, __filename, sql: pool.format(sql, params).replace(/(  \r\n|\n|\r)/gm, '') })
            res.locals.error = true
            return next('route')
        }
        res.locals.insertProductId = result.insertId
        res.locals.myDatas = result.insertId
        next()
    },

    async (req, res, next) => {
        let sql = `SELECT u.userFirstName,u.userLastName
            FROM user AS u 
            WHERE u.userId = ?
            AND u.kmClientId = ?
        `
        let params = [req.user.userId, req.user.kmClientId]
        let result = []
        try {
            // console.log(pool.format(sql, params).replace(/(  \r\n|\n|\r)/gm, ''))
            result = await pool.query(sql, params)
        } catch (error) {
            let message = `${error} - ${__filename} - not able to get user info to log product`
            kmSysLog.error({ message, error, __filename, sql: pool.format(sql, params).replace(/(  \r\n|\n|\r)/gm, '') })
            res.locals.error = true
            return next('route')
        }
        res.locals.currentUser = result[0]
        return next()
    },
    (req, res, next) => {
        let message = `add`
        productLog.info({
            message,
            detail: {
                addByUserFirstName: res.locals.currentUser.userFirstName,
                addByUserLastName: res.locals.currentUser.userLastName,
                addBy: req.user.userId
            },
            id: res.locals.insertProductId

        })
        return next()
    },
    (req, res, next) => { return next('route') }
)

router.post('/',
    (req, res, next) => {
        res.locals.body = api({ message: res.locals.message, showMessage: res.locals.showMessage, code: res.locals.error === false ? 'ok' : 'ko', status: res.locals.error === false ? '201' : '400', data: res.locals.myDatas, details: {} })
        return next()
    },
    ctEnd(path.join(__filename, ':/')),
    (req, res, next) => {
        return res.status(201).json(res.locals.body)
    }
)
module.exports = router
