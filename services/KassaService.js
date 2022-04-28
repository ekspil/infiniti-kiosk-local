const fetch = require("node-fetch")

class Order {
    constructor() {
        this.print = this.print.bind(this)
        this.guid = this.guid.bind(this)
        this.ExecuteCommand = this.ExecuteCommand.bind(this)
    }

    async ExecuteCommand(Data, otherServer){
        let server = process.env.KKM_SERVER
        if(otherServer) server = otherServer
        return await fetch(`http://${server}/Execute`, {
            method: 'post',
            body: JSON.stringify(Data) ,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic " + Buffer.from(process.env.KKM_USER + ":" + process.env.KKM_PASSWORD).toString('base64')  },
        })
    }


    guid() {

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    async print(order, printer){
        // Подготовка данных команды
        const Data = {
            Command: "PrintDocument",
            NumDevice: printer || 0,
            IsFiscalCheck: false,
            NotPrint: false,
            IdCommand: this.guid(),

            // Строки чека
            CheckStrings: [
                {
                    PrintImage: {
                        //Картинка в Base64. Картинка будет преобразована в 2-х цветное изображение- поэтому лучше посылать 2-х цветный bmp
                        Image: "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CCHD4AAAAAASAH/AEAAA//4AAAAAAAAAAAOBwP/5/H4488/gAAAAAAgAf4AKAAD//gAAAAAAAAAAA8Hgf/j8fzzxx+AAAAAAAUB/wCAAAD/8AAAAAAAAAAADgcD/+fx/OOPP4AAAAAAQEP/AggAAH/AAAAAAAAAAAAPPA44/AAHg8ccAAAAAABAgf8ECAAAH4AAAAAAAAAAAA44Hnn8AAcDzzwAAAAAACAT/xAIAAAOAAAAAAAAAAAADzwOefwABwPPPAAAAAAAQBH/AAAAAA8AAAAAAAAAAAAP+AP/5//AH/n/gAAAAAAAB/5ACAAADgAAAAAAAAAAAA/8Af/j/+Af+P+AAAAAACAF/4AIAAAPAAAAAAAAAAAAD/wD/+f/4B/5/4AAAAAAIAP/AAgAAA4AAAAAAAAAAAAAB/AHA4H/ngADgAAAAAAgAf8AEAAADwAAAAAAAAAAAAAH8A8Hgf8cAAeAAAAAAAAB/gARgAAfAAAwAAAAAAAAAAfwDwOB/54AB4AAAAAAFAH/ACHwAA8AAPAAAAAAAAAB+P//P4H/HA8/gAAAAAAAAf8BAfwAHwAH8AAAAAAAAAH8//8fgf+eBx+AAAAAAAUB/wJB/wAPAB/wAAAAAAAAAfz//z+B/54PP4AAAAAAIEP+Agn/wB8Af/AAAAAAAAAB/54AH/AH88AeAAAAAAAggf8ECH/4DwH/4AAAAAAAAAH/ngA/8AfjwDwAAAAAACgT/xAgP/wfB/+AAAAAAAAAAf+eAB/wB/PAPAAAAAAAACH/AAgP/58f/wAAAAAAAAAOf/+B4B/AH//gAAAAAABSB/5BSAf////+AAAAAAAAAA8//8DgD+Af/+AAAAAAAAIJ/4EIA/////wAAAAAAAAADj//wOAPwB//4AAAAAAAQUP/CAAB////8AAAAAAAAAAAAAAHnHg8AAAAAAAAAABAQ/8CCAB////gAAAAAAAAAAAAAA88cDgAAAAAAAAAACAB/xAIAD///4AAAAAAAAAAAAAABxxwPAAAAAAAAAAAQBH/AAgAH///AAAAAAAAAAAP//+PPHHvH///gAAAAAAAC/5AAAAP//4AAAAAAAAAAA///8ccceef//+AAAAAACAC/IAIAAP//AAAAAAAAAAAD///zzxxxx///4AAAAAAIAJ6AAgAAf/wAAAAAAAAAAAP///HH+H/n///gAAAAAAgANUAEAAAf+AAAAAAAAAAAA4AA88/gf8eAAeAAAAAACgDKgAQAAB/gAAAAAAAAAAADwADxx+B/54AA4AAAAAACAHvACAAAB+AAAAAAAAAAAAOP+PPP/2/Hn/ngAAAAAABA/4CgAAAP4AAAAAAAAAAAA8/88ccfweeP+OAAAAAAAIB/wIAAAAfgAAAAAAAAAAADj/jzzx+Bx5/54AAAAAAAEH/AgAAAD+AAAAAAAAAAAAPP/PHH//DHj/jgAAAAAABgf8EAAAAH4AAAAAAAAAAAA4/488/j8Aef+eAAAAAAP+f/9f8AAA/gAAAAAAAAAAADz/zxx+P4B4/44AAAAAA//P/j/wAAB+AAAAAAAAAAAAOP+PPP4/CHn/ngAAAAAD/6/1//AAAP4AAAAAAAAAAAA8/88cfgeeeP+OAAAAAAP/9fX/8AAAfgAAAAAAAAAAADj/jzz+Bxx5/54AAAAAA//15//wAAD+AAAAAAAAAAAAPP+PHH+HvHj/DgAAAAAD//7P//AAAH4AAAAAAAAAAAA4AA8A/8DgeAAeAAAAAAP//F//8AAAfAAAAAAAAAAAADwADwB/wPB4AA4AAAAAA///X//wAAA8AAAAAAAAAAAAP///AH/A+H///gAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///8AD8Aef//+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///wAPwBx///4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///AA/AHH///gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/A/OBsPfwzhw/AYDA5+H4AAAAAAAAAAAAAAAAAAAAAH+P84Owx/jMHH+BgMDf9/gAAAAAAAAAAAAAAAAAAAAAYd45/zHGHMY84cGAf9w2DAAAAAAAAAAAAAAAAAAAAABh2Bn/M4YMzHzAwYB/gDAcAAAAAAAAAAAAAAAAAAAAAH+YDOc/hgzGbcfB/nuD8PwAAAAAAAAAAAAAAAAAAAAAf7gc7j/GDs7tx8H+Mw/j+AAAAAAAAAAAAAAAAAAAAAB7mAxuOOYOz8zAAcc7DwfAAAAAAAAAAAAAAAAAAAAAAGHYGHwwZgzPjMABgz8YBgAAAAAAAAAAAAAAAAAAAAAAYcw4PDhmPMeMYcGHHhx3HAAAAAAAAAAAAAAAAAAAAAB/j/A4P+f4zwx/gf4eH+f4AAAAAAAAAAAAAAAAAAAAAH8H4Dg/x+DGDD8B/g4H4fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAQAADAOAAAAAAAAAAAAAAAAAABAAAAAAAAAAAADg4fwH8YDv/4fgAMYGP8Y4MAccB+Bw/gwOAAAAAAAAAMDD/g/5gM//n/ABzg5/7ngwBxwP8GH/HAwAAAAAAAAA4OeHHjnVxwYcOADGBjDuPDAHDy44c8OMDAAAAAAAAADAxgc4Ef+HDjgcAc4OcG58MAcP/DBjA5wMAAAAAAAAAODmA7gA/4OGOAwfxgYwdj4wBwf8OHMBzAwAAAAAAAAAwM4DsADjgw4wDH/P/nXudzAHBxg4ZwHf/AAAAAAAAADg7gG4AHMDhjAM/8f+P+YzsAcDOBh3Ac/8AAAAAAAAAMDOA7gAdwMOMBzBzi5/jnOwBwO4OGcBnBwAAAAAAAAA4OcDmAA/A4Y4HMDGBjAGMfAHAfAYcwHMDAAAAAAAAADAxwccGD4Djjw5wc4OcA5w8AcB8Dhjg5wMAAAAAAAAAP/j/w/4HgP+H/jAxgYwBjBwP/DwH/H/DA4AAAAAAAAA/8H8D/AcA/4P8cDODnAOcHB/4OA/4P4cHAAAAAAAAAAkgGgBwAQAkgHAAEIAAAAQEBJAAAkgNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
                    },
                },
                { PrintText: { Text: "<<->>" }, },
                { PrintText: { Text: "<<->>" }, },
                {
                    PrintText: {
                        Text: ">#0#< \"TERMINAL E\"",
                        Font: 1, // 1-4, 0 - по настройкам ККМ
                        Intensity: 15, // 1-15, 0 - по настройкам ККМ
                    },
                },
                { PrintText: { Text: "<<->>" }, },
                { PrintText: { Text: "<<->>" }, },
                {
                    PrintText: {
                        Text: ">#0#< РЕЙС: " + order.dataValues.route,
                        Font: 1, // 1-4, 0 - по настройкам ККМ
                        Intensity: 15, // 1-15, 0 - по настройкам ККМ
                    },
                },
                { PrintText: { Text: "<<->>" }, },
                { PrintText: { Text: "<<->>" }, },
                { PrintText: { Text: "Вылет/Прилет" }, },

            ],
        };
        let cornerArray = []

        for(let pos of order.positions){
            let c = cornerArray.find(i => i === pos.corner)
            if(!c) cornerArray.push(pos.corner)
        }

        for(let cor of cornerArray) {
            let string = {
                        PrintText: {
                            Text: "<#1#>> Владивосток/"+String(cor).toUpperCase() ,
                            Font: 2, // 1-4, 0 - по настройкам ККМ
                            Intensity: 15, // 1-15, 0 - по настройкам ККМ
                        },
                    }
            Data.CheckStrings.push(string)
        }

        Data.CheckStrings.push({
            PrintText: {
                Text: "<#1#>> Проверьте правильность выхода на посадку",
                Font: 3, // 1-4, 0 - по настройкам ККМ
                Intensity: 15, // 1-15, 0 - по настройкам ККМ
            },
        })

        Data.CheckStrings.push({ PrintText: { Text: "<<->>" }, })
        Data.CheckStrings.push({ PrintText: { Text: "<<->>" }, })
        Data.CheckStrings.push({ PrintText: { Text: "<<->>" }, })





        for(let pos of order.positions){

            const string = {
                PrintText: {
                    Text: pos.name + "<#1#>"+ pos.price + "  " + pos.count + "  " + (pos.price * pos.count).toFixed(1) + " руб"
                },
            }
            Data.CheckStrings.push(string)
        }


        Data.CheckStrings.push({ PrintText: { Text: "<<->>" }, })

        let  summa = order.positions.reduce((sum, current) => {
            return sum + current.count * current.price
        }, 0);
        Data.CheckStrings.push({
            PrintText: {
                Text: "<#1#>>ИТОГО: "+summa.toFixed(1)+" руб." ,
                Font: 2, // 1-4, 0 - по настройкам ККМ
                Intensity: 15, // 1-15, 0 - по настройкам ККМ
            },
        })

        const result = await fetch(`http://${process.env.KKM_SERVER}/Execute`, {
            method: 'post',
            body: JSON.stringify(Data) ,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic " + Buffer.from(process.env.KKM_USER + ":" + process.env.KKM_PASSWORD).toString('base64')  },
        })
        const json = await result.json()
        return json
    }

    async printFiscal(data) {
        const kkmServer = data.kkmServer
        const isFiscal = true
        const slip = data.slip || ""
        const NumDevice = data.printer || 0
        const TypeCheck = data.typeCheck
        const IsBarCode = data.isBarCode

        const my_aray_letters = await this.returnArrayLetters("T"+String(data.route))


        let cart = data.items


        let cartSum = function(){

            return cart.reduce((sum, current) => {
                return sum + current.count * current.price
            }, 0);

        }
        // Подготовка данных команды
        let Data = {
            // Команда серверу
            Command: "RegisterCheck",

            //***********************************************************************************************************
            // ПОЛЯ ПОИСКА УСТРОЙСТВА
            //***********************************************************************************************************
            // Номер устройства. Если 0 то первое не блокированное на сервере
            NumDevice: NumDevice,
            // ИНН ККМ для поиска. Если "" то ККМ ищется только по NumDevice,
            // Если NumDevice = 0 а InnKkm заполнено то ККМ ищется только по InnKkm
            InnKkm: "",
            //---------------------------------------------
            // Заводской номер ККМ для поиска. Если "" то ККМ ищется только по NumDevice,
            KktNumber: "",
            // **********************************************************************************************************

            // Время (сек) ожидания выполнения команды.
            //Если За это время команда не выполнилась в статусе вернется результат "NotRun" или "Run"
            //Проверить результат еще не выполненной команды можно командой "GetRezult"
            //Если не указано или 0 - то значение по умолчанию 60 сек.
            // Поле не обязательно. Это поле можно указывать во всех командах
            Timeout: 30,
            // Уникальный идентификатор команды. Любая строка из 40 символов - должна быть уникальна для каждой подаваемой команды
            // По этому идентификатору можно запросить результат выполнения команды
            // Поле не обязательно
            IdCommand: this.guid(),
            // Это фискальный или не фискальный чек
            IsFiscalCheck: isFiscal,
            // Тип чека;
            // 0 – продажа;                             10 – покупка;
            // 1 – возврат продажи;                     11 - возврат покупки;
            // 8 - продажа только по ЕГАИС (обычный чек ККМ не печатается)
            // 9 - возврат продажи только по ЕГАИС (обычный чек ККМ не печатается)
            TypeCheck: TypeCheck,
            // Не печатать чек на бумагу
            NotPrint: false, //true,
            // Количество копий документа
            NumberCopies: 0,
            // Продавец, тег ОФД 1021
            CashierName: "Киоск самообслуживния",
            // ИНН продавца тег ОФД 1203
            CashierVATIN: "430601071197",
            // Телефон или е-Майл покупателя, тег ОФД 1008
            // Если чек не печатается (NotPrint = true) то указывать обязательно
            // Формат: Телефон +{Ц} Email {С}@{C}
            ClientAddress: "",
            // Aдрес электронной почты отправителя чека тег ОФД 1117 (если задан при регистрации можно не указывать)
            // Формат: Email {С}@{C}
            SenderEmail: "info@terminaleda.ru",
            // Система налогообложения (СНО) применяемая для чека
            // Если не указанно - система СНО настроенная в ККМ по умолчанию
            // 0: Общая ОСН
            // 1: Упрощенная УСН (Доход)
            // 2: Упрощенная УСН (Доход минус Расход)
            // 3: Единый налог на вмененный доход ЕНВД
            // 4: Единый сельскохозяйственный налог ЕСН
            // 5: Патентная система налогообложения
            // Комбинация разных СНО не возможна
            // Надо указывать если ККМ настроена на несколько систем СНО
            TaxVariant: "",

            // Строки чека
            CheckStrings: [
                // Строка с печатью простого текста
                // При вставке в текст в середину строки символов "<#10#>" Левая часть строки будет выравнена по левому краю, правая по правому, где 10 - это на сколько меньше станет строка ККТ
                // При вставке в текст в середину строки символов "<#10#>>" Левая часть строки будет выравнена по правому краю, правая по правому, где 10 - отступ от правого клая
                { PrintText: { Text: my_aray_letters[0] }, },
                { PrintText: { Text: my_aray_letters[1] }, },
                { PrintText: { Text: my_aray_letters[2] }, },
                { PrintText: { Text: my_aray_letters[3] }, },
                { PrintText: { Text: my_aray_letters[4] }, },
                { PrintText: { Text: "  " }, },
                { PrintText: { Text: "  " }, },
                // Строка с печатью текста определенным шрифтом
                // Строка с печатью фискальной строки

            ],

            // Наличная оплата (2 знака после запятой)
            Cash: 0.00,
            // Сумма электронной оплаты (2 знака после запятой)
            ElectronicPayment: 0.00,
            // Сумма из предоплаты (зачетом аванса) (2 знака после запятой)
            AdvancePayment: 0,
            // Сумма постоплатой(в кредит) (2 знака после запятой)
            Credit: 0,
            // Сумма оплаты встречным предоставлением (сертификаты, др. мат.ценности) (2 знака после запятой)
            CashProvision: 0,

        };

        const summa = cartSum().toFixed(2)
        if(data.payType === "CASH"){
            Data.Cash = summa
        }
        if(data.payType === "CASHLESS"){
            Data.ElectronicPayment = summa
        }

        for(let n in slip)  {

            let slipString = { PrintText: { Text: slip[n] }, }
            Data.CheckStrings.push(slipString)
        }


        for(let i in cart){


            let fiscalString =             {
                Register: {
                    // Наименование товара 64 символа
                    Name: cart[i].name,
                    // Количество товара (3 знака после запятой)
                    Quantity: cart[i].count,
                    // Цена за шт. без скидки (2 знака после запятой)
                    Price: cart[i].price,
                    // Конечная сумма строки с учетом всех скидок/наценок; (2 знака после запятой)
                    Amount: cart[i].price*cart[i].count,
                    // Отдел, по которому ведется продажа
                    Department: 0,
                    // НДС в процентах или ТЕГ НДС: 0 (НДС 0%), 10 (НДС 10%), 20 (НДС 20%), -1 (НДС не облагается), 120 (НДС 20/120), 110 (НДС 10/110)
                    Tax: -1,
                    //Штрих-код EAN13 для передачи в ОФД (не печатется)
                    EAN13: "1254789547853",
                    // Признак способа расчета. тег ОФД 1214. Для ФФД.1.05 и выше обязательное поле
                    // 1: "ПРЕДОПЛАТА 100% (Полная предварительная оплата до момента передачи предмета расчета)"
                    // 2: "ПРЕДОПЛАТА (Частичная предварительная оплата до момента передачи предмета расчета)"
                    // 3: "АВАНС"
                    // 4: "ПОЛНЫЙ РАСЧЕТ (Полная оплата, в том числе с учетом аванса в момент передачи предмета расчета)"
                    // 5: "ЧАСТИЧНЫЙ РАСЧЕТ И КРЕДИТ (Частичная оплата предмета расчета в момент его передачи с последующей оплатой в кредит )"
                    // 6: "ПЕРЕДАЧА В КРЕДИТ (Передача предмета расчета без его оплаты в момент его передачи с последующей оплатой в кредит)"
                    // 7: "ОПЛАТА КРЕДИТА (Оплата предмета расчета после его передачи с оплатой в кредит )"
                    SignMethodCalculation: 4,
                    // Признак предмета расчета. тег ОФД 1212. Для ФФД.1.05 и выше обязательное поле
                    // 1: "ТОВАР (наименование и иные сведения, описывающие товар)"
                    // 2: "ПОДАКЦИЗНЫЙ ТОВАР (наименование и иные сведения, описывающие товар)"
                    // 3: "РАБОТА (наименование и иные сведения, описывающие работу)"
                    // 4: "УСЛУГА (наименование и иные сведения, описывающие услугу)"
                    // 5: "СТАВКА АЗАРТНОЙ ИГРЫ (при осуществлении деятельности по проведению азартных игр)"
                    // 6: "ВЫИГРЫШ АЗАРТНОЙ ИГРЫ (при осуществлении деятельности по проведению азартных игр)"
                    // 7: "ЛОТЕРЕЙНЫЙ БИЛЕТ (при осуществлении деятельности по проведению лотерей)"
                    // 8: "ВЫИГРЫШ ЛОТЕРЕИ (при осуществлении деятельности по проведению лотерей)"
                    // 9: "ПРЕДОСТАВЛЕНИЕ РИД (предоставлении прав на использование результатов интеллектуальной деятельности или средств индивидуализации)"
                    // 10: "ПЛАТЕЖ (аванс, задаток, предоплата, кредит, взнос в счет оплаты, пени, штраф, вознаграждение, бонус и иной аналогичный предмет расчета)"
                    // 11: "АГЕНТСКОЕ ВОЗНАГРАЖДЕНИЕ (вознаграждение (банковского)платежного агента/субагента, комиссионера, поверенного или иным агентом)"
                    // 12: "СОСТАВНОЙ ПРЕДМЕТ РАСЧЕТА (предмет расчета, состоящем из предметов, каждому из которых может быть присвоено вышестоящее значение"
                    // 13: "ИНОЙ ПРЕДМЕТ РАСЧЕТА (предмет расчета, не относящемуся к предметам расчета, которым может быть присвоено вышестоящее значение"
                    // 14: "ИМУЩЕСТВЕННОЕ ПРАВО" (передача имущественных прав)
                    // 15: "ВНЕРЕАЛИЗАЦИОННЫЙ ДОХОД"
                    // 16: "СТРАХОВЫЕ ВЗНОСЫ" (суммы расходов, уменьшающих сумму налога (авансовых платежей) в соответствии с пунктом 3.1 статьи 346.21 Налогового кодекса Российской Федерации)
                    // 17: "ТОРГОВЫЙ СБОР" (суммы уплаченного торгового сбора)
                    // 18: "КУРОРТНЫЙ СБОР"
                    // 19: "ЗАЛОГ"
                    SignCalculationObject: 1,
                    // Единица измерения предмета расчета. Можно не указывать
                    MeasurementUnit: "шт"

                }
            }

            Data.CheckStrings.push(fiscalString)

        }




        //Если чек без ШК то удаляем строку с ШК
        if (IsBarCode == false) {
            //Data.Cash = 100;
            for (var i = 0; i < Data.CheckStrings.length; i++) {
                if (Data.CheckStrings[i] != undefined && Data.CheckStrings[i].BarCode != undefined) {
                    Data.CheckStrings[i].BarCode = null;
                };
                if (Data.CheckStrings[i] != undefined && Data.CheckStrings[i].PrintImage != undefined) {
                    Data.CheckStrings[i].PrintImage = null;
                };
            };
        };

        //Скидываем данные об агенте - т.к.у Вас невярнека ККТ не зарегистрирована как Агент.
        Data.AgentSign = null;
        Data.AgentData = null;
        Data.PurveyorData = null;
        for (var i = 0; i < Data.CheckStrings.length; i++) {
            if (Data.CheckStrings[i] != undefined && Data.CheckStrings[i].Register != undefined) {
                Data.CheckStrings[i].Register.AgentSign = null;
                Data.CheckStrings[i].Register.AgentData = null;
                Data.CheckStrings[i].Register.PurveyorData = null;
            };
        };

        // Вызов команды
        return await this.ExecuteCommand(Data, kkmServer);


    }

    async ReturnCheck(NumDevice, cart, slip) {

        let cartSum = function(){

            return cart.reduce((sum, current) => {
                return sum + current.count * current.price
            }, 0);

        }
        // Подготовка данных команды
        var Data = {
            // Команда серверу
            Command: "RegisterCheck",

            //***********************************************************************************************************
            // ПОЛЯ ПОИСКА УСТРОЙСТВА
            //***********************************************************************************************************
            // Номер устройства. Если 0 то первое не блокированное на сервере
            NumDevice: NumDevice,
            // ИНН ККМ для поиска. Если "" то ККМ ищется только по NumDevice,
            // Если NumDevice = 0 а InnKkm заполнено то ККМ ищется только по InnKkm
            InnKkm: "",
            //---------------------------------------------
            // Заводской номер ККМ для поиска. Если "" то ККМ ищется только по NumDevice,
            KktNumber: "",
            // **********************************************************************************************************

            // Время (сек) ожидания выполнения команды.
            //Если За это время команда не выполнилась в статусе вернется результат "NotRun" или "Run"
            //Проверить результат еще не выполненной команды можно командой "GetRezult"
            //Если не указано или 0 - то значение по умолчанию 60 сек.
            // Поле не обязательно. Это поле можно указывать во всех командах
            Timeout: 30,
            // Уникальный идентификатор команды. Любая строка из 40 символов - должна быть уникальна для каждой подаваемой команды
            // По этому идентификатору можно запросить результат выполнения команды
            // Поле не обязательно
            IdCommand: this.guid(),
            // Это фискальный или не фискальный чек
            IsFiscalCheck: true,
            // Тип чека;
            // 0 – продажа;                             10 – покупка;
            // 1 – возврат продажи;                     11 - возврат покупки;
            // 8 - продажа только по ЕГАИС (обычный чек ККМ не печатается)
            // 9 - возврат продажи только по ЕГАИС (обычный чек ККМ не печатается)
            TypeCheck: 1,
            // Не печатать чек на бумагу
            NotPrint: false, //true,
            // Количество копий документа
            NumberCopies: 0,
            // Продавец, тег ОФД 1021
            CashierName: "Киоск самообслуживния",
            // ИНН продавца тег ОФД 1203
            CashierVATIN: "430601071197",
            // Телефон или е-Майл покупателя, тег ОФД 1008
            // Если чек не печатается (NotPrint = true) то указывать обязательно
            // Формат: Телефон +{Ц} Email {С}@{C}
            ClientAddress: "test@mail.com",
            // Aдрес электронной почты отправителя чека тег ОФД 1117 (если задан при регистрации можно не указывать)
            // Формат: Email {С}@{C}
            SenderEmail: "sochi@mama.com",
            // Система налогообложения (СНО) применяемая для чека
            // Если не указанно - система СНО настроенная в ККМ по умолчанию
            // 0: Общая ОСН
            // 1: Упрощенная УСН (Доход)
            // 2: Упрощенная УСН (Доход минус Расход)
            // 3: Единый налог на вмененный доход ЕНВД
            // 4: Единый сельскохозяйственный налог ЕСН
            // 5: Патентная система налогообложения
            // Комбинация разных СНО не возможна
            // Надо указывать если ККМ настроена на несколько систем СНО
            TaxVariant: "",

            // Строки чека
            CheckStrings: [
                // Строка с печатью простого текста
                // При вставке в текст в середину строки символов "<#10#>" Левая часть строки будет выравнена по левому краю, правая по правому, где 10 - это на сколько меньше станет строка ККТ
                // При вставке в текст в середину строки символов "<#10#>>" Левая часть строки будет выравнена по правому краю, правая по правому, где 10 - отступ от правого клая
                { PrintText: { Text: "  " }, },
                // Строка с печатью текста определенным шрифтом
                // Строка с печатью фискальной строки

            ],

            // Наличная оплата (2 знака после запятой)
            Cash: 0.00,
            // Сумма электронной оплаты (2 знака после запятой)
            ElectronicPayment: cartSum().toFixed(2),
            // Сумма из предоплаты (зачетом аванса) (2 знака после запятой)
            AdvancePayment: 0,
            // Сумма постоплатой(в кредит) (2 знака после запятой)
            Credit: 0,
            // Сумма оплаты встречным предоставлением (сертификаты, др. мат.ценности) (2 знака после запятой)
            CashProvision: 0,

        };

        for(let n in slip)  {

            let slipString = { PrintText: { Text: slip[n] }, }
            Data.CheckStrings.push(slipString)
        }


        for(let i in cart){


            let fiscalString =             {
                Register: {
                    // Наименование товара 64 символа
                    Name: cart[i].name,
                    // Количество товара (3 знака после запятой)
                    Quantity: cart[i].count,
                    // Цена за шт. без скидки (2 знака после запятой)
                    Price: cart[i].price,
                    // Конечная сумма строки с учетом всех скидок/наценок; (2 знака после запятой)
                    Amount: cart[i].price*cart[i].count,
                    // Отдел, по которому ведется продажа
                    Department: 0,
                    // НДС в процентах или ТЕГ НДС: 0 (НДС 0%), 10 (НДС 10%), 20 (НДС 20%), -1 (НДС не облагается), 120 (НДС 20/120), 110 (НДС 10/110)
                    Tax: -1,
                    //Штрих-код EAN13 для передачи в ОФД (не печатется)
                    EAN13: "1254789547853",
                    // Признак способа расчета. тег ОФД 1214. Для ФФД.1.05 и выше обязательное поле
                    // 1: "ПРЕДОПЛАТА 100% (Полная предварительная оплата до момента передачи предмета расчета)"
                    // 2: "ПРЕДОПЛАТА (Частичная предварительная оплата до момента передачи предмета расчета)"
                    // 3: "АВАНС"
                    // 4: "ПОЛНЫЙ РАСЧЕТ (Полная оплата, в том числе с учетом аванса в момент передачи предмета расчета)"
                    // 5: "ЧАСТИЧНЫЙ РАСЧЕТ И КРЕДИТ (Частичная оплата предмета расчета в момент его передачи с последующей оплатой в кредит )"
                    // 6: "ПЕРЕДАЧА В КРЕДИТ (Передача предмета расчета без его оплаты в момент его передачи с последующей оплатой в кредит)"
                    // 7: "ОПЛАТА КРЕДИТА (Оплата предмета расчета после его передачи с оплатой в кредит )"
                    SignMethodCalculation: 1,
                    // Признак предмета расчета. тег ОФД 1212. Для ФФД.1.05 и выше обязательное поле
                    // 1: "ТОВАР (наименование и иные сведения, описывающие товар)"
                    // 2: "ПОДАКЦИЗНЫЙ ТОВАР (наименование и иные сведения, описывающие товар)"
                    // 3: "РАБОТА (наименование и иные сведения, описывающие работу)"
                    // 4: "УСЛУГА (наименование и иные сведения, описывающие услугу)"
                    // 5: "СТАВКА АЗАРТНОЙ ИГРЫ (при осуществлении деятельности по проведению азартных игр)"
                    // 6: "ВЫИГРЫШ АЗАРТНОЙ ИГРЫ (при осуществлении деятельности по проведению азартных игр)"
                    // 7: "ЛОТЕРЕЙНЫЙ БИЛЕТ (при осуществлении деятельности по проведению лотерей)"
                    // 8: "ВЫИГРЫШ ЛОТЕРЕИ (при осуществлении деятельности по проведению лотерей)"
                    // 9: "ПРЕДОСТАВЛЕНИЕ РИД (предоставлении прав на использование результатов интеллектуальной деятельности или средств индивидуализации)"
                    // 10: "ПЛАТЕЖ (аванс, задаток, предоплата, кредит, взнос в счет оплаты, пени, штраф, вознаграждение, бонус и иной аналогичный предмет расчета)"
                    // 11: "АГЕНТСКОЕ ВОЗНАГРАЖДЕНИЕ (вознаграждение (банковского)платежного агента/субагента, комиссионера, поверенного или иным агентом)"
                    // 12: "СОСТАВНОЙ ПРЕДМЕТ РАСЧЕТА (предмет расчета, состоящем из предметов, каждому из которых может быть присвоено вышестоящее значение"
                    // 13: "ИНОЙ ПРЕДМЕТ РАСЧЕТА (предмет расчета, не относящемуся к предметам расчета, которым может быть присвоено вышестоящее значение"
                    // 14: "ИМУЩЕСТВЕННОЕ ПРАВО" (передача имущественных прав)
                    // 15: "ВНЕРЕАЛИЗАЦИОННЫЙ ДОХОД"
                    // 16: "СТРАХОВЫЕ ВЗНОСЫ" (суммы расходов, уменьшающих сумму налога (авансовых платежей) в соответствии с пунктом 3.1 статьи 346.21 Налогового кодекса Российской Федерации)
                    // 17: "ТОРГОВЫЙ СБОР" (суммы уплаченного торгового сбора)
                    // 18: "КУРОРТНЫЙ СБОР"
                    // 19: "ЗАЛОГ"
                    SignCalculationObject: 1,
                    // Единица измерения предмета расчета. Можно не указывать
                    MeasurementUnit: "шт"

                }
            }

            Data.CheckStrings.push(fiscalString)

        }



        let IsBarCode = false
        //Если чек без ШК то удаляем строку с ШК
        if (IsBarCode == false) {
            //Data.Cash = 100;
            for (var i = 0; i < Data.CheckStrings.length; i++) {
                if (Data.CheckStrings[i] != undefined && Data.CheckStrings[i].BarCode != undefined) {
                    Data.CheckStrings[i].BarCode = null;
                };
                if (Data.CheckStrings[i] != undefined && Data.CheckStrings[i].PrintImage != undefined) {
                    Data.CheckStrings[i].PrintImage = null;
                };
            };
        };

        //Скидываем данные об агенте - т.к.у Вас невярнека ККТ не зарегистрирована как Агент.
        Data.AgentSign = null;
        Data.AgentData = null;
        Data.PurveyorData = null;
        for (var i = 0; i < Data.CheckStrings.length; i++) {
            if (Data.CheckStrings[i] != undefined && Data.CheckStrings[i].Register != undefined) {
                Data.CheckStrings[i].Register.AgentSign = null;
                Data.CheckStrings[i].Register.AgentData = null;
                Data.CheckStrings[i].Register.PurveyorData = null;
            };
        };

        // Вызов команды
        return await this.ExecuteCommand(Data);


    }

    async returnArrayLetters(my_string){
        let letterS = [
            '  $$$$ ',
            ' $$    ',
            '  $$$  ',
            '    $$ ',
            ' $$$$  ',
        ];
        let letterF = [
            ' $$$$$ ',
            ' $$    ',
            ' $$$$  ',
            ' $$    ',
            ' $$    ',
        ];
        let letterT = [
            ' $$$$$$',
            '   $$  ',
            '   $$  ',
            '   $$  ',
            '   $$  ',
        ];
        let letterK = [
            ' $$  $$',
            ' $$ $$ ',
            ' $$$   ',
            ' $$ $$ ',
            ' $$  $$',
        ];
        let letterG = [
            '  $$$$ ',
            ' $$    ',
            ' $$ $$$',
            ' $$  $$',
            '  $$$$ ',
        ];
        let letterD = [
            ' $$$$$ ',
            ' $$  $$',
            ' $$  $$',
            ' $$  $$',
            ' $$$$$ ',
        ];
        let letter1 = [
            '    $$',
            '  $$$$',
            '    $$',
            '    $$',
            '    $$',
        ];

        let letter2 = [
            '  $$$$ ',
            ' $$  $$',
            '    $$ ',
            '  $$   ',
            ' $$$$$$',
        ];
        let letter3 = [
            '  $$$$ ',
            ' $   $$',
            '   $$$ ',
            ' $   $$',
            '  $$$$ ',
        ];
        let letter4 = [
            ' $$    ',
            ' $$  $$',
            ' $$$$$$',
            '     $$',
            '     $$',
        ];
        let letter5 = [
            ' $$$$$ ',
            ' $$    ',
            ' $$$$$ ',
            '     $$',
            ' $$$$$ ',
        ];
        let letter6 = [
            '  $$$$ ',
            ' $$    ',
            ' $$$$$ ',
            ' $$  $$',
            '  $$$$ ',
        ];
        let letter7 = [
            ' $$$$$$',
            ' $$  $$',
            '    $$ ',
            '   $$  ',
            '  $$   ',
        ];
        let letter8 = [
            '  $$$$ ',
            ' $$  $$',
            '  $$$$ ',
            ' $$  $$',
            '  $$$$ ',
        ];
        let letter9 = [
            '  $$$$ ',
            ' $$  $$',
            '  $$$$$',
            '     $$',
            '  $$$$ ',
        ];
        let letter0 = [
            '  $$$$ ',
            ' $$  $$',
            ' $$  $$',
            ' $$  $$',
            '  $$$$ ',
        ];
        let letterTire = [
            '       ',
            '       ',
            '  $$$  ',
            '       ',
            '       ',
        ];


        my_string = my_string.toLowerCase();
        let my_aray_letters = [
            '      ',
            '      ',
            '      ',
            '      ',
            '      ',
        ];
        for (let index = 0; index < my_string.length; index++)
        {
            let this_array = ['', '', '', '', '',];
            let char = my_string[index];
            if (char == 'k') { this_array = letterK; }
            if (char == 'f') { this_array = letterF; }
            if (char == 'g') { this_array = letterG; }
            if (char == 's') { this_array = letterS; }
            if (char == 'd') { this_array = letterD; }
            if (char == 't') { this_array = letterT; }
            if (char == '1') { this_array = letter1; }
            if (char == '2') { this_array = letter2; }
            if (char == '3') { this_array = letter3; }
            if (char == '4') { this_array = letter4; }
            if (char == '5') { this_array = letter5; }
            if (char == '6') { this_array = letter6; }
            if (char == '7') { this_array = letter7; }
            if (char == '8') { this_array = letter8; }
            if (char == '9') { this_array = letter9; }
            if (char == '0') { this_array = letter0; }
            if (char == '-') { this_array = letterTire; }
            my_aray_letters[0] = my_aray_letters[0] +' '+this_array[0];
            my_aray_letters[1] = my_aray_letters[1] +' '+this_array[1];
            my_aray_letters[2] = my_aray_letters[2] +' '+this_array[2];
            my_aray_letters[3] = my_aray_letters[3] +' '+this_array[3];
            my_aray_letters[4] = my_aray_letters[4] +' '+this_array[4];

        }
        return my_aray_letters;
    }

// Печать закрытия смены
    async zReport(data) {
        let NumDevice = data.printer || 0
        let kkmServer = data.kkmServer

        // Подготовка данных команды
        var Data = {
            // Команда серверу
            Command: "CloseShift",
            // Номер устройства. Если 0 то первое не блокированное на сервере
            NumDevice: NumDevice,
            // Продавец, тег ОФД 1021
            CashierName: "Иванов И.И.",
            // ИНН продавца тег ОФД 1203
            CashierVATIN: "430601071197",
            // Не печатать чек на бумагу
            NotPrint: false,
            // Id устройства. Строка. Если = "" то первое не блокированное на сервере
            IdDevice: "",
            // Уникальный идентификатор команды. Любая строока из 40 символов - должна быть уникальна для каждой подаваемой команды
            // По этому идентификатору можно запросить результат выполнения команды
            IdCommand: this.guid(),
        };

        // Вызов команды
        return await this.ExecuteCommand(Data, kkmServer);

        // Возвращается JSON:
        //{
        //    "CheckNumber": 1,    // Номер документа
        //    "SessionNumber": 23, // Номер смены
        //    "QRCode": "t=20170904T141100&fn=9999078900002287&i=108&fp=605445600",
        //    "Command": "CloseShift",
        //    "Error": "",  // Текст ошибки если была - обязательно показать пользователю - по содержанию ошибки можно в 90% случаях понять как ее устранять
        //    "Status": 0   // Ok = 0, Run(Запущено на выполнение) = 1, Error = 2, NotFound(устройство не найдено) = 3, NotRun = 4
        //}

    }

// Печать X отчета
    async xReport(data) {


        let NumDevice = data.printer || 0
        let kkmServer = data.kkmServer
        // Подготовка данных команды
        var Data = {
            // Команда серверу
            Command: "XReport",
            // Номер устройства. Если 0 то первое не блокированное на сервере
            NumDevice: NumDevice,
            // Id устройства. Строка. Если = "" то первое не блокированное на сервере
            IdDevice: "",
            // Уникальный идентификатор команды. Любая строока из 40 символов - должна быть уникальна для каждой подаваемой команды
            // По этому идентификатору можно запросить результат выполнения команды
            IdCommand: this.guid(),
        };

        // Вызов команды
        return await this.ExecuteCommand(Data, kkmServer);
    }


// Оплата безналом
    async payTerminal(data) {
        let kkmServer = data.kkmServer
        let NumDevice = 0
        let sum = data.items.reduce((sum, current) => {
                return sum + current.count * current.price
            }, 0);

        // Подготовка данных команды
        var Data = {
            Command: "PayByPaymentCard",
            NumDevice: NumDevice,
            CardNumber: "",
            Amount: sum,
            ReceiptNumber: data.id,
            IdCommand: this.guid(),
        }

        // Вызов команды
        return await this.ExecuteCommand(Data, kkmServer);
    }

    async returnChekPayment(data) {
        let kkmServer = data.kkmServer

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


        return await this.ExecuteCommand(Data, kkmServer);

    }

    async Settlement(data) {

        let NumDevice = 0
        let kkmServer = data.kkmServer

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
        return await this.ExecuteCommand(Data, kkmServer);
    }

}
module.exports = Order