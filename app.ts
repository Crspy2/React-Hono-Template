import { Hono } from 'hono'
import { logger } from 'hono/logger'
import {todoRoutes} from "./routes/todos.ts";

const app = new Hono()
app.use(logger())

app.notFound((c) => {
    return c.json({
        "status": 404,
        "data": null,
        "error": "Page Not Found",
        "message": null
    }, 404)
})

app.get('/', (c) => {
    return c.json({
        "status": 200,
        "data": null,
        "error": null,
        "message": "Hello Hono!"
    })
})


app.route("/api/todos", todoRoutes)
export default app