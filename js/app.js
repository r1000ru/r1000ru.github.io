var App = function (radius, weight, tempMaxC, tempC) {
    var delay = 100;
    
    // Получим объекты DOM для быстрого обращения к ним
    var fireButton      = document.getElementById('fireButton');
    var heightSlider    = document.getElementById('heightSlider');
    var controlValue    = document.getElementById('controlValue');
    var debugValues     = document.getElementById('debugValues');
    var currPressValue  = document.getElementById('currPressValue');
    var balloonDiv      = document.getElementById('balloonDiv');

    var balloon         = null;
    var autocontrol     = false;
    var autopressure    = 0;
    var lasttime = Date.now();
    var lastpressure = 0;
    var counter = 0;
    var preheat = false;
    var autopilot = function(pressure) {
        var result = false;
        var time = Date.now();
       
        // Разница в давления между автовысотой и текущим давлением
        var diffpressure = pressure - autopressure;
        
        // Следует учесть что это скорость изменения давления и она на 
        // взлете отрицательна, в Па в сек
        var speed = (pressure - lastpressure) * 1000 / (time - lasttime);
        
        
        if (pressure > autopressure) {
            // Включаем горелку, если нам надо стремиться вверх
            result = true;
            // Если скорость набора слишком высока - не будем поднимать температуру
            if(speed < -50) {
                result = false;
            }
            // Если разница давлений меньше 3000 Па и скорость меньше -30Па/с - тоже не будем прибавлять
            if(diffpressure<3000 && speed < -30) {
                result = false;
                console.log()
            }
            // Если разница давлений меньше 1000 Па и скорость меньше -10Па/с - тоже не будем прибавлять
            if(diffpressure<1000 && speed < -8) {
                result = false;
            }
        } else {
            // Выключаем горелку, если нам надо стремиться вниз
            result = false;
            // Если скорость снижения слишком высока - притормозим спуск
            if(speed > 30) {
                result = true;
            }
            // Если разница давлений больше -3000 Па и скорость свыше 20Па/с - притормозим спуск
            if(diffpressure > -4000 && speed > 40) {
                result = true;
            }
            // Если разница давлений больше -3000 Па и скорость свыше 20Па/с - притормозим спуск
            if(diffpressure > -2000 && speed > 20) {
                result = true;
            }
            // Если разница давлений больше -1000 Па и скорость свыше 10Па/с - тоже не будем прибавлять
            if(diffpressure > -1000 && speed > 2) {
                result = true;
            }
        }
        console.log(autopressure, pressure, diffpressure, speed);
        lasttime = time;
        lastpressure = pressure;
        lastspeed = speed;
        return result;
    };
    
    /**
     * Функция отображает отладочную информацию
     * 
     * @param {object} debug            Объект с параметрами
     * 
     * @returns {undefined}
     */
    var drawDebug = function (debug) {
        html = '';
        for (var prop in debug) {
            html += prop + ': ' + debug[prop].toFixed(2) + '<br/>';
        }
        debugValues.innerHTML = html;
    };
    
    /**
     * Функция отображает данные бародатчика и подсвечивает кнопку
     * 
     * @param {boolean} fire            Включена ли горелка
     * @param {float} pressure          Давление
     * 
     * @returns {undefined}
     */
    var drawParams = function (fire, pressure) {
        currPressValue.innerHTML = 'Показание бародатчика: ' + pressure.toFixed(2) + ' паскалей';

        if (fire) {
            if (autocontrol) {
                fireButton.style.backgroundColor = '#ff9999';
            } else {
                fireButton.style.backgroundColor = '#ff0033';
            }
        } else {
            fireButton.style.backgroundColor = '#fff';
        }
    };
    
    
    /**
     * Функция рисует воздушный шар, подсвечивает горелку и меняет его яркость
     * 
     * @param {boolean} fire            Включена ли горелка
     * @param {float} height            Высота с телеметрии
     * @param {float} tBal              Температура воздуха в шаре
     * 
     * @returns {undefined}
     */
    var drawBalloon = function (fire, height, tBal) {
        var margin = 748 - parseInt(height) + 'px';
        balloonDiv.style.marginTop = margin;

        if (fire) {
            balloonDiv.style.background = "url('/img/balloonfire.png')";
        } else {
            balloonDiv.style.background = "url('/img/balloon.png')";
        }

        var tDif = balloon.coolingMax - 255;
        var color = 'rgb(255,' + (255 - parseInt(tBal) + tDif) + ',' + (255 - parseInt(tBal) + tDif) + ')';
        balloonDiv.style.backgroundColor = color;
    };
    
    /**
     * Метод навешивает обработчики событий (кликов и слайда), создает воздушный
     * ша и запускает пересчет его параметров
     * 
     * @returns {undefined}
     */
    this.init = function () {
        // Нажимаем кнопку горелки
        fireButton.onmousedown = function () {
            autocontrol = false;
            balloon.fire(true);
            controlValue.innerHTML = 'Ручное управление. Горелка включена.';
        };

        // Отпускаем кнопку горелки
        fireButton.onclick = function () {
            autocontrol = false;
            balloon.fire(false);
            controlValue.innerHTML = 'Ручное управление. Горелка выключена.';
        };

        // На сдвиг слайдера включаем автоконтроль
        heightSlider.onchange = function () {
            var height  = parseInt(heightSlider.value);
            autopressure = Atmosphere.prototype.airPressure(height);
            autocontrol = true;
            controlValue.innerHTML = 'Автовысота: ' + height + ' метров ('+ autopressure.toFixed(2)+' Па)';
        };
        
        // Создаем новый воздушный шар
        balloon = new Balloon(radius, weight, tempC, tempMaxC, function (fire, pressure, debug) {
            if (autocontrol) {
                balloon.fire(autopilot(pressure));
            }
            drawParams(fire, pressure);
            drawBalloon(fire, debug.height, debug.temp);                        // Визуализировать шарик мы будем по параметрам атмосферы
            drawDebug(debug);
        });
        
        // Запустим обсчет параметров шара
        balloon.start(delay);
    };
};
