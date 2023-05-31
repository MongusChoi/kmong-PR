const { connection } = require('mongoose')
const { ObjectId } = require('mongodb')
const projectsColl = connection.collection('projects')

module.exports = {
    UpdateItem: (param = {}) => {
        const { id, title, requirements, description, application, member } = param
        const updateQuery = { $set: {}, $push: {} }

        if (title) updateQuery.$set.title = title
        if (requirements) updateQuery.$set.requirements = requirements
        if (description) updateQuery.$set.description = description
        if (application) updateQuery.$push.application = application
        if (member) updateQuery.$push.members = member

        return projectsColl.updateOne({ _id: new ObjectId(id) }, updateQuery)
    },
    UpdateApplicationItem: (param = {}) => {
        const { id, applicationId } = param

        return projectsColl.updateOne({ _id: new ObjectId(id) }, { $pull: { application: { userId: applicationId } } })
    }
}