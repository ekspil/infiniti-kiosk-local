const fetch = require("node-fetch")

class Order {
    constructor(eoServer) {
        this.eoServer = eoServer || "localhost:4001"
        this.guid = this.guid.bind(this)
        this.ExecuteCommand = this.ExecuteCommand.bind(this)
        this.eoDTO = function(data){

        }
    }

    async ExecuteCommand(Data, otherServer){
        let server = process.env.KKM_SERVER || "localhost:5893"
        if(otherServer) server = otherServer
        return await fetch(`http://${server}/Execute`, {
            method: 'post',
            body: JSON.stringify(Data) ,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic " + Buffer.from(process.env.KKM_USER + ":" + process.env.KKM_PASSWORD).toString('base64')  },
        })
    }

    async sendToEO(data, order){

        const body = {
            id: order.id,
            die: 0,
            alarm: 0,
            action: "PAYED",
            payed: 1,
            ready: 0,
            takeOut: 0,
            type: data.type,
            source: "KIOSK",
            flag: "",
            amount: "",
            guestName: "",
            extId: "",
            text: "",
            pin: "",
            positions: []
        }


        for (let item  of data.items) {

            const poss = {
                id: item.id,
                name: item.name,
                price: item.price,
                count: item.count || 1,
                code: item.codeOneC,
                station: item.station,
                corner: item.corner,
                mods: []

            }
            body.positions.push(poss)

        }

        try {
            const result = await fetch('http://'+this.eoServer+'/api/terminal/order/change', {
                method: "POST",
                body: JSON.stringify(body)
            })
            return await result.json()
        } catch (e) {
            return  {error: e, result: "Ошибка при отправке заказа на электронную очередь. Сфотайте заказ и покажите менеджеру для получения."}
        }

    }



    async cancelToEO(data, order){

        const body = {
            id: order.id,
            die: 0,
            alarm: 0,
            action: "DELETE",
            payed: 1,
            ready: 0,
            takeOut: 0,
            type: data.type,
            source: "KIOSK",
            flag: "",
            amount: "",
            guestName: "",
            extId: "",
            text: "",
            pin: "",
            positions: []
        }



        try {
            const result = await fetch('http://'+this.eoServer+'/api/terminal/order/change', {
                method: "POST",
                body: JSON.stringify(body)
            })
            return await result.json()
        } catch (e) {
            return  {error: e, result: "Ошибка при отправке заказа на электронную очередь. Сфотайте заказ и покажите менеджеру для получения."}
        }

    }


    guid() {

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

// Оплата безналом
    async payTerminal(data) {
        let NumDevice = 0
        let sum = data.items.reduce((sum, current) => {
                return sum + current.count * current.price
            }, 0);

        // Подготовка данных команды
        let Data = {
            Command: "PayByPaymentCard",
            NumDevice: NumDevice,
            CardNumber: "",
            Amount: sum,
            ReceiptNumber: data.id,
            IdCommand: this.guid(),
        }

        // Вызов команды
        return await this.ExecuteCommand(Data);
    }
// Возврат безнала
    async returnChekPayment(data) {

        const sum = data.items.reduce((sum, current) => {
            return sum + current.count * current.price
        }, 0);


        let Data = {
            Command: "ReturnPaymentByPaymentCard",
            NumDevice: 0,
            CardNumber: "",

            Amount: sum,

            ReceiptNumber: data.id,
            RRNCode: data.RRNCode,
            AuthorizationCode: data.AuthorizationCode,
            IdCommand: this.guid()

        };


        return await this.ExecuteCommand(Data);

    }
// Cancel безнала
    async cancelChekPayment(data) {


        let Data = {
            Command: "EmergencyReversal",
            NumDevice: 0,
            CardNumber: "",

            Amount: data.Amount,

            ReceiptNumber: data.ReceiptNumber,
            RRNCode: data.RRNCode,
            AuthorizationCode: data.AuthorizationCode,
            IdCommand: this.guid()

        };


        return await this.ExecuteCommand(Data);

    }

    //Сверка итогов

    async Settlement(data) {

        let NumDevice = 0

        // Подготовка данных команды
        var Data = {
            // Команда серверу
            Command: "Settlement",
            // Номер устройства. Если 0 то первое не блокированное на сервере
            NumDevice: NumDevice,
            // Уникальный идентификатор команды. Любая строка из 40 символов - должна быть уникальна для каждой подаваемой команды
            // По этому идентификатору можно запросить результат выполнения команды
            // Поле не обязательно
            IdCommand: this.guid()

        };

        // Вызов команды
        return await this.ExecuteCommand(Data);
    }

}
module.exports = Order