import { expect, describe, test, beforeAll, afterAll } from '@jest/globals';
import { testServer } from '../../test-server';
import request from 'supertest'
import { prisma } from '../../../src/data/postgres';

describe('Rest Todo Controller', () => {


    const todo1 = { text: "HOla 1" }
    const todo2 = { text: "HOla 2" }
    const todo4 = { text: "HOla 4" }
    const todo5 = { text: "HOla 5" }
    beforeAll(async () => {
        await testServer.start();

        await prisma.todo.deleteMany()
        await prisma.todo.createMany({
            data: [todo1, todo2]
        })
    })

    afterAll(() => {
        testServer.close()
    })


    test('should return TODOS api/todos', async () => {

        const response = await request(testServer.app)
            .get("/api/todos")
            .expect(200)

        console.log(response.body)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBe(2)
        expect(response.body[0].text).toBe(todo1.text)
        expect(response.body[1].text).toBe(todo2.text)

    })

    test("Should return a todo api/todos/:id", async () => {
        const todo3 = { text: "HOla 3" }
        const todo = await prisma.todo.create({ data: todo3 })

        const response = await request(testServer.app)
            .get("/api/todos/" + todo.id)
            .expect(200)

        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.text).toBe(todo3.text)

    })

    test("Should return a 404 NotFound api/todos/:id", async () => {

        const id = "99999999"
        const response = await request(testServer.app)
            .get("/api/todos/" + id)
            .expect(404)

        expect(response.body).toEqual({ error: 'Todo with id ' + id + ' not found' })
    })

    test('should return a new Todo api/todos', async () => {

        const response = await request(testServer.app)
            .post('/api/todos')
            .send(todo4)
            .expect(201)

        expect(response.body).toEqual({
            id: expect.any(Number),
            text: todo4.text,
            completedAt: null
        })
    })

    test('should return an error new Todo api/todos', async () => {

        const response = await request(testServer.app)
            .post('/api/todos')
            .send({})
            .expect(400)

        expect(response.body).toEqual({
            error: expect.any(String)
        })
    })

    test('should return an updated Todo api/todos', async () => {

        const todo = await prisma.todo.create({ data: todo5 })

        const response = await request(testServer.app)
            .put('/api/todos/' + todo.id)
            .send({ text: "UPDATED hola", completedAt: "2022-10-10" })
            .expect(200)

        expect(response.body).toEqual({
            id: expect.any(Number),
            text: "UPDATED hola",
            completedAt: "2022-10-10T00:00:00.000Z"
        })
    })

    test('should return 404 if todo not Found', async () => {
        const id = "99999999"
        const response = await request(testServer.app)
            .put('/api/todos/' + id)
            .send({ text: "UPDATED hola", completedAt: "2022-10-10" })
            .expect(404)

        expect(response.body).toEqual({ error: 'Todo with id ' + id + ' not found' })

    })


    test('should return updated Todo only if the date is updated', async () => {
        const todo = await prisma.todo.create({ data: todo5 })

        const response = await request(testServer.app)
            .put('/api/todos/' + todo.id)
            .send({completedAt: "2022-10-10" })
            .expect(200)

        expect(response.body).toEqual({
            id: expect.any(Number),
            text: todo.text,
            completedAt: "2022-10-10T00:00:00.000Z"
        })
    })

    test('should delete a todo', async () => {
        const todo = await prisma.todo.create({ data: todo5 })

        const response = await request(testServer.app)
            .delete('/api/todos/' + todo.id)
            .expect(200)

        expect(response.body).toEqual({
            id: expect.any(Number),
            text: todo.text,
            completedAt: null
        })

    })

    test('should return 404 if todo not Found when delete', async () => {
        const id = "99999999"
        const response = await request(testServer.app)
            .delete('/api/todos/' + id)
            .expect(404)

        expect(response.body).toEqual({ error: 'Todo with id ' + id + ' not found' })

    })
})