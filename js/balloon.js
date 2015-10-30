/**
 * Объект Воздушный Шар.
 * 
 * По условиям задачи, объект автономен и имеет только кнопку включени горелки.
 * Передаваемая функция onUpdate - вызывается через заданный на старте промежуток
 * времени. В функцию передаются текущие значения, работает ли горелка, давление,
 * а так же данные для отладки (которые не используются во второй части проекта)
 * 
 * @param {integer} radius                  Радиус воздушного шара
 * @param {integer} weight                  Вес воздушного шара
 * @param {integer} tempC                   Температура воздуха на уровне моря
 * @param {function} onUpdate               Вызываемая функция при каждом обновлении данных
 *  
 * @returns {Aerostat}
 */
var Balloon = function (radius, weight, tempC, tempMaxC, onUpdate) {
    
    var atm = new Atmosphere(tempC);                                            // Наш шар летает в атмосфере при заданной температуре

    // Телеметрические локальные переменные
    var temp = tempC + atm.T;                                                   // Температура воздуха внутри шара
    var tempMax = tempMaxC + atm.T;                                             // Максимальная температура воздуха в оболочке
    var speed = 0;                                                              // Текущая вертикальная скорость
    var accel = 0;                                                              // Текущее вертикальное ускорение
    var height = 0;                                                             // Текущая высота от уровня моря
    var fire = false;                                                           // Нажата ли клавиша горелки
    var press = atm.pressure(0);                                                // Текущее нормальное давление атмосферы
    var lastUpdate = Date.now();                                                // Время последнего пересчета параметров в миллисекундах
    
    // Статические (не изменяемые в полете) локальные переменные
    var square = Math.PI * Math.pow(radius, 2);                                 // Площадь поперечного сечения для расчета сопротивления
    var volume = 4 * Math.PI * Math.pow(radius, 3) / 3;                         // Объем воздушного шара
    var weight = weight;                                                        // Масса воздушного шара в килограммах, без учета массы воздуха

    /**
     * Управление горелкой и получение текущего ее состояния
     * 
     * @param {boolean} pressed             Если параметр передан, то осуществляется управление (нажата или нет)
     * 
     * @returns {boolean}                   Текущее состояние горелки
     */
    this.fire = function (pressed) {
        // Если параметр передан - управляем горелкой
        if (pressed !== undefined) {
            if (pressed) {
                fire = true;
            } else {
                fire = false;
            }
        }
    };

    /**
     * Метод обноляет данные о состоянии шара в воздухе
     * с учетом прилагаемых к нему сил и с учетом измененных данных
     * 
     * @param {integer} deltaT          Временной интервал
     * @returns {object}                Объект с данными для отладки
     */
    var calcParams = function (deltaT) {
        // Обновим данные о температуре воздуха в шаре
        if (fire) {
            temp = temp + Balloon.prototype.heatingStep * deltaT / 1000;
            if (temp > tempMax) {
                temp = tempMax;
            }
        } else {
            temp = temp - Balloon.prototype.coolingStep * deltaT / 1000;
            if (temp < atm.temp) {
                temp = atm.temp;
            }
        }

        // Масса воздуха в шаре с учетом высоты и его температуры
        var totalweight = volume * atm.density(height, temp) + weight;

        // Подъемная сила на высоте
        var fUp = volume * Balloon.prototype.G * atm.density(height);

        // Сила притяжения
        var fDn = totalweight * Balloon.prototype.G;
        
        // Сила сопротивления
        var fCx = Balloon.prototype.Cx * atm.density(height) * Math.pow(speed, 2) * square / 2;

        var fSumm = fUp - fDn;
        
        if (speed > 0) {
            // Если происходит набор высоты, то тормозим
            fSumm -= fCx;
        } else {
            // Если идет снижение, то замедляем
            fSumm += fCx;
        }
        
        accel = fSumm / totalweight;
        if (accel<0 && height === 0) {
            accel = 0;
        }
        
        var oldSpeed = speed;
        speed = oldSpeed + deltaT / 1000 * accel;
                
        height = height + (speed+oldSpeed) / 2 * deltaT / 1000;
        
        if (height<0) {
            height = 0;
            speed = 0;
            accel = 0;
        }
        
        // Обновим данные о давлении
        press = atm.pressure(height);

        var debug = {
            weight: weight,
            radius: radius,
            square: square,
            volume: volume,
            totalweight: totalweight,
            press: press,
            height: height,
            speed: speed,
            accel: accel,
            temp: temp,
            fUp: fUp,
            fDn: fDn,
            fCx: fCx,
            fSumm: fSumm
        };
        
        return debug;
    };

    /**
     * Метод запускает цикл перерасчета параметров шара с учетом интервала
     * 
     * @param {integer} delay           Задержка обновления параметров в мс
     * @returns {undefined}
     */
    this.start = function (delay) {
        setInterval(function () {
            // Определим прошедший интервал и обновим временную метку
            var update = Date.now();
            var deltaT = update - lastUpdate;
            lastUpdate = update;

            // Пересчитаем параметры
            var debug = calcParams(deltaT);

            // Вызовем замыкание на обновление параметров
            onUpdate(fire, press, debug);
        }, delay);
    };
};

Balloon.prototype = {
    maxSpeed: 10,                                                               // Модуль максимально допустимой скорости взлета и снижения
    heatingStep: 5,                                                             // Скорость нагрева воздуха при включеной горелке
    coolingStep: 5,                                                             // Скорость остывания при выключеной горелке
    Cx: 0.48,                                                                   // Коэфициент лобового сопротивления воздушного шара (считаем одинаковым во всех направлениях)
    G: 9.81                                                                     // Ускорение свободного падения
};
