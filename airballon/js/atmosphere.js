/* 
 * Объект Атмосфера
 * 
 * Описывает основные газовые константы и позволяет расчитывать
 * давление воздуха в зависимости от температуры и высоты,
 * а так же плотность воздуха
 * 
 */

var Atmosphere = function(tempC) {
    this.temp = tempC + Atmosphere.prototype.T;                                 // Температура атмосферы в градусах Кельвина
    
    /**
     * Расчет давления для нормальной атмосферы на высоте
     * 
     * @param {float} height            Высота над уровнем моря
     * 
     * @returns {float}
     */
    this.pressure = function(height) {
        var pressure = Atmosphere.prototype.airPressure(height);
        return pressure;
    };
    
    /**
     * Плотность воздуха на высоте при заданной температуре
     * 
     * @param {type} height             Высота над уровнем моря
     * @param {float} temp              Температура воздуха, для которой расчитываем давление
     *                                  Если параметр не передан - берем температуру атмосферы 
     *                                  с высотной коррекцией
     * 
     * @returns {float|Number}
     */
    this.density = function(height, temp) {
        if (temp === undefined) {
            // Если температура не передана, значит узнаем ее для окружающено воздуха на высоте
            temp =  Atmosphere.prototype.airTemperature(this.temp, height);
        }
        
        var pressure = this.pressure(height);
        var dencity = Atmosphere.prototype.airDencity(temp, pressure);
        return dencity;
    };
    
    /**
     * Текущая температура на высоте
     * 
     * @param {float} hight
     * 
     * @returns {float}
     */
    this.temperature = function(hight) {
        var temp = Atmosphere.prototype.airTemperature(this.temp, hight);
        return temp;
    };
};

Atmosphere.prototype = {
    T: 273.15,                                                                   // Разница между градусами Кельвина и Цельсия
    M: 0.0289644,                                                               // Молярная масса воздуха кг/моль
    R: 8.3144598,                                                               // Универсальная газовая постоянная
    G: 9.80665,                                                                 // Ускорение свободного падения
    L: -0.0065,                                                                 // Скорость падения температуры в тропосфере
    Tst: 288.15,                                                                // Стандартная температура на уровне моря
    Pst: 101325,                                                                // Стандартное давление воздуха на уровне моря
    
    
    /**
     * Метод расчитывает плотность воздуха от температуры и давления
     * 
     * @param {float} temp          Температура воздуха в Кельвинах
     * @param {float} pressure      Давление воздуха в Паскалях
     * 
     * @returns {float}             Плотность воздуха кг на метр кубический
     */
    airDencity: function(temp, pressure) {
        var density = pressure * this.M / (this.R * temp);
        return density;
    },
    
    /**
     * Расчет давления на высоте, для стандартной температуры атмосферы
     * 
     * @param {float} height
     * @returns {float}
     */
    airPressure: function(height) {
        var base = 1+ this.L * height / this.Tst;
        var exponent = -1 * this.G * this.M / (this.R * this.L);
        var pressure = this.Pst * Math.pow(base, exponent);
        return pressure;
    },
    
    
    /**
     * Расчет температуры воздуха на высоте. 
     * Расчет корректен только для тропосферы
     * 
     * @param {float} temp          Температура воздуха на уровне моря            
     * @param {float} height        Высота
     * 
     * @returns {float}             Температура на высоте
     */
    airTemperature: function(temp, height) {
        var tempOnHeight = temp + this.L * height;
        return tempOnHeight;
    },
    
    airWeight: function(temp, pressure, volume) {
        var weight = pressure * volume * this.M / (this.R * temp);
        return weight;
    }
};