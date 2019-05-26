const Pool = require('pg').Pool
const pool = new Pool({
  user: 'nenqswulwiasqm',
  ssl: true,
  host: 'ec2-54-83-205-27.compute-1.amazonaws.com',
  database: 'dclcujmbu1lcua',
  password: '33090a8bc6f3d02f9b2ce16286286c041555422bc828789e7094d0c7aa73484e',
  port: 5432,
})

const signup = (req, res) => {
    let {name, age, email, password} = req.body
    pool.query(
        'INSERT INTO usuario(nombrecompleto, edad, email, puntos, password) VALUES($1, $2, $3, 0, $4)',
        [name, age, email, password]
    ).then(() => {
        res.status(201).send('User created!')
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const login = (req, res) => {
    let {email, password} = req.body
    pool.query(
        'SELECT * FROM usuario WHERE email = $1 AND password = $2;',
        [email, password]
    ).then(results=> {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const getPoints = (req, res) => {
    let email = req.query.email
    pool.query(
        'SELECT puntos FROM usuario WHERE email = $1;',
        [email]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const getAvailableCodes = (req, res) => {
    pool.query(
        'SELECT codigo.codigo, valorcodigo, valorenpuntos, marca FROM codigo LEFT JOIN codigosusados ON codigo.codigo = codigosusados.codigo WHERE codigosusados.codigo IS NULL;'
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const redimPoints = (req, res) => {
    let {userId, code} = req.body
    pool.query(
        'SELECT * FROM usePoints($1, $2)',
        [code, userId]
    ).then(results=> {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const getUsedCodes = (req, res) => {
    let userId = req.query.userId
    pool.query(
        'SELECT codigo.codigo, valorcodigo, marca FROM codigosusados INNER JOIN codigo ON codigo.codigo = codigosusados.codigo WHERE usuarioid = $1;',
        [userId]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const  saveCode = (req, res) => {
    let {code, points} = req.body
    pool.query(
        'INSERT INTO codigomaquina VALUES ($1,$2,$3);',
        [code, points, false]
    ).then(() => {
        res.status(201).send('Code added!')
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
}

const afterScan = (req, res) => {
    let {code, email} = req.query
    pool.query(
        'SELECT codeScan AS added FROM codeScan($1, $2)',
        [code, email]
    ).then(results => {
        res.status(200).json(results.rows)
    }).catch(error => {
        res.send(`Unable to save user error: ${error}`)
    })
    
}

module.exports = {
    login,
    signup,
    getPoints,
    getAvailableCodes,
    getUsedCodes,
    redimPoints,
    saveCode,
    afterScan
}