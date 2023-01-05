// Require the framework and instantiate it
let eoServer = process.argv[2];
console.log(eoServer)
require("dotenv").config()
const fastify = require('fastify')({ logger: true })
const fetch = require('node-fetch')
console.log(process.env.KKM_SERVER)

const Kassa = require("./services/KassaService")

const kassa = new Kassa(eoServer)

// Declare a route

fastify.register(require('fastify-cors'), {
    credentials: true,
    origin: true
})





fastify.post('/api/kassa/payTerminal/', async (request, reply) => {
    let ok = false
    try{
        const res = await kassa.payTerminal(request.body)
        const pay = await res.json()
        // const pay = {Status: 0}
        const data = {
            bill: request.body,
            pay,
        }
        if(!pay.Error && pay.Status === 0){

            const res = await fetch(`https://api.rb24.ru/api/kiosk/create`, {
                method: 'post',
                body: JSON.stringify(data) ,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // const res = await fetch(`http://localhost/api/kiosk/create`, {
            //     method: 'post',
            //     body: JSON.stringify(data) ,
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            const result = await res.json()

            if(!result || result.moneyBack){

                const res = await kassa.cancelChekPayment(pay)

                return {ok: false, result: {message: result.message}, error: true}

            }



            if(!result.order) throw new Error("LOCAL_SERVER_REPORT_ERROR Неверный ответ от сервера")


            //
            // const result = {
            //     order: {
            //         id: 1
            //     }
            // }
            //

            ok = true


            if(result.order.iiko){
                return {ok, order: result.order}
            }
            const sendToEO = await kassa.sendToEO(request.body, result.order)

            return {ok, order: result.order}

        }
        return {ok, result: pay}

    }
    catch (e) {
        return {ok: false, result: e.message}
    }})


fastify.post('/api/kassa/returnChekPayment/', async (request, reply) => {
    let ok = false
    const res = await kassa.returnChekPayment(request.body)
    const pay = await res.json()
    //const pay = {Status: 0}
    const data = {
        bill: request.body,
        pay,
    }
    if(!pay.Error && pay.Status === 0){

        const res = await fetch(`https://api.rb24.ru/api/kiosk/cancel`, {
            method: 'post',
            body: JSON.stringify(data) ,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const result = await res.json()
        if(!result.order) throw new Error("LOCAL_SERVER_REPORT_ERROR Неверный ответ от сервера")
        ok = true

        const sendToEO = await kassa.cancelToEO(request.body, result.order)

        return {ok, order: result.order}

    }
    return {ok, result: pay}


})


fastify.post('/api/kassa/settlement/', async (request, reply) => {

    const res = await kassa.Settlement(request.body)
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