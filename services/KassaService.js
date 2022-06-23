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

        const sendData = {
            type: data.type,
            status: "PAYED",
            text: data.text || "",
            price: data.price,
            id: order.id,
            items: []
        }

        for(let item of data.items){
            if(item.setProducts && item.setProducts.length > 0){
                for(let s of item.setProducts){
                    for(let i = 0; i < item.count; i++){
                        s.uid = i
                        sendData.items.push(JSON.parse(JSON.stringify(s)))
                    }

                }
            }
            else{
                for(let i = 0; i < item.count; i++) {
                    item.uid = i
                    sendData.items.push(JSON.parse(JSON.stringify(item)))
                }
            }
        }
        try{
            for( let item of sendData.items){
                await fetch(`http://${this.eoServer}/new/?name=${item.name}&unit=${sendData.id}&id=${sendData.id}-${item.id}-${item.uid}&station=${item.station}`, {
                    method: 'get'
                })
            }
            await fetch(`http://${this.eoServer}/newCheck/?id=${sendData.id}&checkType=${sendData.type === "IN" ? "1" : "2"}&code=&guestName=`, {
                method: 'get'
            })


        }
        catch (e) {
            return {error: e, result: "Ошибка при отправке заказа на электронную очередь. Сфотайте заказ и покажите менеджеру для получения."}
        }


    }


    async cancelToEO(data, order){

        const sendData = {
            type: data.type,
            status: "PAYED",
            text: data.text || "",
            price: data.price,
            id: order.id,
            items: []
        }

        for(let item of data.items){
            if(item.setProducts && item.setProducts.length > 0){
                for(let s of item.setProducts){
                    for(let i = 0; i < s.count; i++){
                        s.uid = i
                        sendData.items.push(JSON.parse(JSON.stringify(s)))
                    }

                }
            }
            else{
                for(let i = 0; i < item.count; i++) {
                    item.uid = i
                    sendData.items.push(JSON.parse(JSON.stringify(item)))
                }
            }
        }

        try{
            for( let item of sendData.items){
                await fetch(`http://${this.eoServer}/del/?name=${item.name}&unit=${sendData.id}&id=${sendData.id}-${item.id}-${item.uid}&station=${item.station}`, {
                    method: 'get'
                })
            }
            await fetch(`http://${this.eoServer}/delCheck/?id=${sendData.id}&checkType=${sendData.type === "IN" ? "1" : "2"}&code=&guestName=`, {
                method: 'get'
            })


        }
        catch (e) {
            return {error: e, result: "Ошибка при отправке заказа на электронную очередь. Сфотайте заказ и покажите менеджеру для получения."}
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