const ProjectDB = require('../../../models/projects')
const UserDB = require('../../../models/users')

exports.GetList = async (req, res) => {
    try {
        const result = await ProjectDB.GetList()
        res.send({ data: result })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.GetItem = async (req, res) => {
    try {
        const { id } = req.params
        if (!id || id.length !== 24) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }

        const result = await ProjectDB.GetItem({ id })
        res.send({ data: result })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.Create = async (req, res) => {
    try {
        const { _id } = req.user
        const {
            title,
            requirements,
            description
        } = req.body
        if (!title || !description || !requirements) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }

        const userData = await UserDB.GetItem({ _id })
        if (userData.projectId) {
            return res.status(400).send('프로젝트를 이미 진행중입니다.')
        }

        const { insertedId } = await ProjectDB.Create({ title, owner: _id, requirements, description })
        const result = await UserDB.UpdateProjectId({ _id, projectId: insertedId })
        if (result.matchedCount === 0) {
            return res.status(404).send('데이터를 찾을 수 없습니다.')
        }

        res.send('Success!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.UpdateItem = async (req, res) => {
    try {
        const { _id } = req.user
        const {
            title,
            requirements,
            description
        } = req.body
        if (!title && !description && !requirements) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }
        
        const userData = await UserDB.GetItem({ _id })
        if (!userData.projectId) {
            return res.status(404).send('진행중인 프로젝트가 없습니다.')
        }
        
        const projectData = await ProjectDB.GetItem({ id: userData.projectId, owner: _id })
        if (!projectData) {
            return res.status(400).send('프로젝트 주최자가 아닙니다.')
        }
        
        const updateResult = await ProjectDB.UpdateItem({ id: userData.projectId, title, requirements, description })
        if (updateResult.matchedCount === 0) {
            return res.status(404).send('데이터를 찾을 수 없습니다.')
        }

        res.send('Success!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.CreateApplication = async (req, res) => {
    try {
        const { _id: userId } = req.user
        const { id: projectId } = req.params
        const { title, description } = req.body
        if (!projectId || projectId.length !== 24 || !title || !description) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }
        
        const userData = await UserDB.GetItem({ _id: userId })
        if (userData.projectId) {
            return res.status(400).send('프로젝트를 이미 진행중입니다.')
        }

        const projectData = await ProjectDB.GetItem({ id: projectId })
        projectData.application.forEach(item => {
            const { userId: applicationMemberId } = item
            if (applicationMemberId === userId) {
                return res.status(400).send('이미 지원한 프로젝트 입니다.')
            }
        })

        const application = {
            userId,
            name: userData.name,
            grade: userData.grade,
            studentId: userData.studentId,
            contact: userData.contact,
            title, 
            description
        }
        const updateResult = await ProjectDB.UpdateItem({ id: projectId, application })
        if (updateResult.matchedCount === 0) {
            return res.status(404).send('데이터를 찾을 수 없습니다.')
        }

        res.send('Success!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.ApplyApplication = async (req, res) => {
    try {
        const { _id: userId } = req.user
        const { id: projectId } = req.params
        const { applicationId } = req.body

        if (!projectId && projectId.length !== 24 && !applicationId && applicationId.length !== 24) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }

        const projectData = await ProjectDB.GetItem({ id: projectId, owner: userId })
        if (!projectData) {
            return res.status(400).send('프로젝트 주최자가 아닙니다.')
        }

        let isExistApplication = false, memberData = {}
        projectData.application.forEach(item => {
            const { userId: applicationMemberId, name, grade, studentId, contact, description } = item
            if (applicationId === applicationMemberId) {
                isExistApplication = true
                memberData = {
                    userId: applicationMemberId,
                    name,
                    grade,
                    studentId,
                    contact,
                    description
                }
            }
        })

        if (!isExistApplication) {
            return res.status(404).send('지원서를 찾을 수 없습니다.')
        }

        const removeApplicationResult = await ProjectDB.UpdateApplicationItem({ id: projectId, applicationId })
        if (removeApplicationResult.matchedCount === 0) {
            return res.status(404).send('지원서를 찾을 수 없습니다.')
        }

        const updateMemberResult = await ProjectDB.UpdateItem({ id: projectId, member: memberData })
        if (updateMemberResult.matchedCount === 0) {
            return res.status(404).send('지원서를 찾을 수 없습니다.')
        }

        const updateUserResult = await UserDB.UpdateProjectId({ _id: applicationId, projectId: projectData._id })
        if (updateUserResult.matchedCount === 0) {
            return res.status(404).send('유저를 찾을 수 없습니다.')
        }

        res.send('Success!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}

exports.DeleteApplication = async (req, res) => {
    try {
        const { _id: userId } = req.user
        const { id: projectId } = req.params
        const { applicationId } = req.body

        if (!projectId && projectId.length !== 24 && !applicationId && applicationId.length !== 24) {
            return res.status(400).send('파라미터가 잘못되었습니다.')
        }

        const projectData = await ProjectDB.GetItem({ id: projectId, owner: userId })
        if (!projectData) {
            return res.status(400).send('프로젝트 주최자가 아닙니다.')
        }

        let isExistApplication = false
        projectData.application.forEach(item => {
            const { userId: applicationMemberId } = item
            if (applicationId === applicationMemberId) {
                isExistApplication = true
            }
        })

        if (!isExistApplication) {
            return res.status(404).send('지원서를 찾을 수 없습니다.')
        }

        const removeApplicationResult = await ProjectDB.UpdateApplicationItem({ id: projectId, applicationId })
        if (removeApplicationResult.matchedCount === 0) {
            return res.status(404).send('지원서를 찾을 수 없습니다.')
        }

        res.send('Success!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
}