const { connection } = require('mongoose')
const projectsColl = connection.collection('projects')

module.exports = {
    Create: (param = {}) => {
        const {
            title,
            owner,
            requirements,
            description
        } = param

        return projectsColl.insertOne({ title, owner, requirements, description, application: [], members: [] })
    }
}