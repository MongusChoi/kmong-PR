const { connection } = require('mongoose')
const { SECRET } = require('../../../global')
const usersColl = connection.collection('users')
const crypto = require('crypto')

module.exports = {
    Create: (param = {}) => {
        const { id, password, grade, name, studentId, major, age, gender, contact } = param

        const encryptedPwd = crypto.createHmac('sha1', SECRET).update(password).digest('base64');
        return usersColl.insertOne({
            id,
            password: encryptedPwd,
            name,
            grade,
            studentId,
            major,
            age,
            gender,
            contact
        })
    }
}