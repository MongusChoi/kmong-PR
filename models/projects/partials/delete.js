const { connection } = require('mongoose')
const { ObjectId } = require('mongodb')
const projectsColl = connection.collection('projects')

module.exports = {
    DeleteItem: (param = {}) => {
        return projectsColl.deleteOne({ _id: new ObjectId(param._id), owner: param.owner })
    }
}