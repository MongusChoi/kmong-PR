const { connection } = require('mongoose')
const { ObjectId } = require('mongodb')
const projectsColl = connection.collection('projects')

module.exports = {
    GetList: (param = {}) => {
        return projectsColl.find({}).toArray()
    },
    GetItem: (param = {}) => {
        const { id, owner } = param
        const filter = {}

        if (id) filter._id = new ObjectId(id)
        if (owner) filter.owner = owner

        return projectsColl.findOne(filter)
    },
    GetApplicationData: (param = {}) => {
        const { id, owner } = param

        return projectsColl.findOne({ _id: new ObjectId(id), owner }, { projection: { application: true } })
    }
}