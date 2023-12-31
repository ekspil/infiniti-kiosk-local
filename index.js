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




        const data = {
            bill: request.body
        }

        let result
        try{

            const res = await fetch(`https://api.rb24.ru/api/kiosk/create`, {
                method: 'post',
                body: JSON.stringify(data) ,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            result = await res.json()

        }
        catch{
            console.log("SERVICE_FETCH_ERROR")
        }

        if(!result.ok) {
            return {ok: false, result: result.message}
        }



        const res = await kassa.payTerminal(request.body)
        const pay = await res.json()

        if(pay.Error || pay.Status !== 0) return {ok: false, result: "Операция оплаты отклонена"}


        let resultClose
        const dataClose = {
            bill: request.body,
            pay,
            orderId: result.order.id,
            orderIikoId: result.order.iikoId,
            userId: result.order.userId
        }
        try{

            const res = await fetch(`https://api.rb24.ru/api/kiosk/close`, {
                method: 'post',
                body: JSON.stringify(dataClose) ,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            resultClose = await res.json()

        }
        catch{
            console.log("SERVICE_FETCH_ERROR")
        }
        if(!resultClose.order) throw new Error("LOCAL_SERVER_REPORT_ERROR Неверный ответ от сервера")
        ok = true






        return {ok, result: pay, order: resultClose.order.order}

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