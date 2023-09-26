const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/components/task/models/task')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)
test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "From my test"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('should not delete other user tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})



//
// Task Test Ideas
//
// Should not create task with invalid description/completed
test('should not create task with invalid description/completed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "this    ",
            // completed: "not" 
        })
        .expect(400)
})

// Should not update task with invalid description/completed
test('should not update task with invalid description/completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "this "
        })
        .expect(400)
})

// Should delete user task
test('should delete user task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const task = await Task.findById(userOne._id)
    expect(task).toBeNull()
})

// Should not delete task if unauthenticated
test('should not delete task if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .expect(401)
})

// should not update other users task by id  
test('should not update other users task by id', async() => {
    await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
        description:"this is updated"
    })
    .expect(404)
})


// Should fetch user task by id
test('should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(200)

    expect(response._body).not.toBeNull()
})

// Should not fetch user task by id if unauthenticated
test('should not fetch user task by id if unauthenticated', async () => {
    const response = await request(app)
        .get(`/tasks/${taskThree._id}`)
        .expect(401)

    expect(response._body.error).not.toBeNull()
})

// Should not fetch other users task by id
test('should not fetch other users task by id', async () => {
    await request(app)
        .get(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})

// Should fetch only completed tasks
test('should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

// Should fetch only incomplete tasks 
test('should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

// Should sort tasks by description/completed/createdAt/updatedAt
test('should sort tasks by description/completed/createdAt/updatedAt', async () => {
    await request(app)
        .get('/tasks?sortBy=createdAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

// Should fetch page of tasks
test('should fetch page of tasks', async () => {
    await request(app)
        .get('/tasks?limit=2')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})