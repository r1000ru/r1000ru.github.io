(function(){
    'use strict';
    var Point = function(templates, point) {
        
        this.templates = templates;
        this.data = point;
        this.data.timestart = new Date(this.data.timestart);
        this.html = this.templates.get('bodyExpeditionPoint');
        

        this.html.models.icon.textContent = this.data.icon;
        this.html.models.title.textContent = this.data.title;

        this.html.models.timestart.textContent = this.getShortTime();
        this.html.models.distance.textContent = this.data.distance ? this.data.distance : '';
        this.html.models.timelong.textContent = this.data.timelong ? this.getTimeLong() : '';
        this.html.models.price.textContent = this.data.price ? this.getPrice() : '';
        
        console.log(this.data);
    };

    Point.prototype.getISODate = function() {
        return this.data.timestart.toISOString().substr(0, 10);
    }

    Point.prototype.getTimeLong = function() {
        return this.data.timelong;
    }

    Point.prototype.getShortTime = function() {
        return this.data.timestart.toISOString().substr(11, 5);
    }

    Point.prototype.getLocaleDate = function() {
        return this.data.timestart.toLocaleDateString();
    }

    Point.prototype.getPrice = function() {
        return this.data.price + ' ' + this.data.currency;
    }

    window.r1000ru = window.r1000ru || {};
    window.r1000ru.expedition = window.r1000ru.expedition || {};
    window.r1000ru.expedition.Point = Point;
})();