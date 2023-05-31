const { connection } = require('mongoose')
const { ObjectId } = require('mongodb')
const usersColl = connection.collection('users')
const crypto = require('crypto')
const config = require('../../../global')

module.exports = {
    GetItem: async (param = {}) => {
        const { _id } = param
        return usersColl.findOne({ _id: new ObjectId(_id) })
    },
    IsExist: async (param = {}) => {
        return (await usersColl.countDocuments({ _id: new ObjectId(param._id) })) > 0
    },
    IsValidId: async (param = {}) => {
        const { id } = param
        return (await usersColl.countDocuments({ id })) === 0
    },
    IsVerify: async (param = {}) => {
        const { id, password } = param
        const encrypted = crypto.createHmac('sha1', config.SECRET).update(password).digest('base64')

        const userData = await usersColl.findOne({ id })
        if (!userData) return false

        return {
            result: userData.password === encrypted,
            user: userData
        }
    },
}