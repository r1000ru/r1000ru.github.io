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
    var lastspeed = 0;
    var maxspeed = 30;                                                          // Максимальная скорость по модулю на расстоянии 3000 Па
    var maxaccel = 2;                                                           // Максимальное ускорение торможения по модулю
    var maxdistance = 3000;                                                     // Максимальное расстояние в Па по модулю. ниже которого будут работать ограничения
    
    var autopilot = function(pressure) {
        var result = false;
        var time = Date.now();
       
        // Разница в давления между автовысотой и текущим давлением
        var diffpressure = autopressure - pressure;
        
        // Текущая скорость в Па/c
        var speed = (pressure - lastpressure) * 1000 / (time - lasttime);
        // Текущее ускорение
        var accel = speed - lastspeed;
        // Текущая допустимая максимальная скорость по модулю
        var curMaxSpeed =  Math.abs(diffpressure * maxspeed / maxdistance);
        if (curMaxSpeed > maxspeed) {
            curMaxSpeed = maxspeed;
        }
        // Текущая допустимая максимальная скорость снижения/нарастания скорости по модулю
        var curMaxAccel = Math.abs(diffpressure * maxaccel / maxdistance);
        if (curMaxAccel > maxaccel) {
            curMaxAccel = maxaccel;
        }
        if (pressure > autopressure) {
            // Включаем горелку, если нам надо стремиться вверх
            result = true;
            
            if(speed<0) {
                if(-1*speed>curMaxSpeed) {
                    result = false;
                }
                
                if (accel > curMaxAccel) {
                    result = true;
                }
            }
        } else {
            result = false;
            if(speed>0) {
                if(speed > curMaxSpeed) {
                    result = true;
                }

                if (-1*accel > curMaxAccel) {
                    result = false;
                }
            }
        }
        
        lastspeed = speed;
        lasttime = time;
        lastpressure = pressure;
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
