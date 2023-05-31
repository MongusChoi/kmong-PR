const { connection } = require('mongoose')
const { ObjectId } = require('mongodb')
const usersColl = connection.collection('users')

module.exports = {
    UpdateProjectId: (param = {}) => {
        const { _id, projectId, isOwner } = param
        const updateQuery = { $set: { projectId } }
        if (isOwner) updateQuery.$set.isOwner = isOwner
        
        return usersColl.updateOne({ _id: new ObjectId(_id) }, updateQuery)
    }
}