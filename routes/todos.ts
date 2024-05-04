import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator";
import { z } from "zod"

const todoSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string(),
    description: z.string(),
})

const createTodoSchema = todoSchema.omit({id: true})

const fakeTodos: z.infer<typeof todoSchema> [] = [
    {id: 1, title: "Groceries", description: "Go to the grocery store"},
    {id: 2, title: "Rent", description: "Pay the monthly rent"},
    {id: 3, title: "Pick up Kids", description: "Pick up the kids from school"},
]

export const todoRoutes = new Hono()
    .get('/', async (c) => {
        return c.json({
            "status": 200,
            "data": fakeTodos,
            "error": null,
            "message": "Successfully retrieved todos",
        })
    })
    .post('/', zValidator("json", createTodoSchema), async (c) => {
        const todo = c.req.valid("json")
        fakeTodos.push({...todo, id: fakeTodos.length + 1})
        return c.json({
            "status": 200,
            "data": todo,
            "error": null,
            "message": "Todo successfully created",
        })
    })
    .get('/:id{[0-9]+}', async (c) => {
        const id = Number.parseInt(c.req.param("id"))
        const todo = fakeTodos.find(todo => todo.id === id)

        if (!todo)
            return c.notFound()
        return c.json({
            "status": 200,
            "data": todo,
            "error": null,
            "message": "Successfully retrieved todo",
        })
    })
    .delete('/:id{[0-9]+}', async (c) => {
        const id = Number.parseInt(c.req.param("id"))
        const index = fakeTodos.findIndex(todo => todo.id === id)

        if (index === -1)
            return c.notFound()

        const deletedTodo = fakeTodos.splice(index, 1)[0]
        return c.json({
            "status": 200,
            "data": deletedTodo,
            "error": null,
            "message": "Successfully deleted todo",
        })
    })