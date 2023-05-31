const jwt = require('jsonwebtoken')
const UserDB = require('../../../models/users')
const global = require('../../../global')

// 토큰 발급 메소드
const _issueToken = (userId) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: userId }, global.SECRET, {
            expiresIn: '1h',                // 인증 유지 시간
            issuer: 'WSP'                   // 토큰 발급자
        }, (err, token) => {
            if (err) return reject(err)
            return resolve(token)
        })
    })
}

exports.SignUp = async (req, res) => {
    try {
        const {
            id,
            password,
            name,
            studentId,
            grade,
            major,
            age,
            gender,
            content
        } = req.body
        if (!id || !password || !name || !studentId || !grade || !major || !age || !gender || !content) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }

        const validIdResult = await UserDB.IsValidId({ id })
        if (!validIdResult) {
            return res.status(400).send('이미 존재하는 아이디 입니다.')
        }

        const result = await UserDB.Create({ id, password, name, studentId, grade, major, age, gender, content })
        const token = await _issueToken(result.insertedId)
        res.send({ token })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.SignIn = async (req, res) => {
    try {
        const { _id } = req.user
        const token = await _issueToken(_id)
        res.send({ token })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

exports.GetUserData = async (req, res) => {
    try {
        const { id: userId } = req.params
        console.log(req.user)
        res.send('Success!')
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}