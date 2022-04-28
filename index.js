// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })


const Kassa = require("./services/KassaService")

const kassa = new Kassa()

// Declare a route



fastify.post('/api/kassa/payTerminal/', async (request, reply) => {

    const res = await kassa.payTerminal(request.body)
    const result = await res.json()
    return {ok: true, result}
})

fastify.post('/api/kassa/xReport/', async (request, reply) => {

    const res = await kassa.xReport(request.body)
    return {ok: true, res}

})

fastify.post('/api/kassa/zReport/', async (request, reply) => {

    const res = await kassa.zReport(request.body)
    await kassa.Settlement(request.body)
    return {ok: true, res}

})


fastify.post('/api/kassa/returnChekPayment/', async (request, reply) => {

    const res = await kassa.returnChekPayment(request.body)
    const result = await res.json()
    return {ok: true, result}

})


// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()