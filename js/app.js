var App = function (radius, weight, temp) {

    
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
    var lastpressure    = 0;

    var autopilot = function(pressure) {
        var result = false;
        if (pressure > autopressure) {
            result = true;
            var dif = lastpressure-pressure;
            // Не даем разогнаться очень быстро
            if (dif>3) {
                result = false;
            }
            if (pressure - autopressure<2000 && dif>2) {
                result = false;
            }
            if (pressure - autopressure<1000 && dif>1) {
                result = false;
            }
            if (pressure - autopressure<500 && dif>0.05) {
                result = false;
            }
        }
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
            balloonDiv.style.borderBottomColor = 'red';
        } else {
            balloonDiv.style.borderBottomColor = 'black';
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
        balloon = new Balloon(radius, weight, temp,  function (fire, pressure, debug) {
            if (autocontrol) {
                balloon.fire(autopilot(pressure));
            }
            drawParams(fire, pressure);
            drawBalloon(fire, debug.height, debug.temp);                        // Визуализировать шарик мы будем по параметрам атмосферы
            drawDebug(debug);
        });
        
        // Запустим обсчет параметров шара с интервалом 0.1 секунда
        balloon.start(100);
    };
};
