(function(){
    'use strict';
    var Expedition = function(templates, expedition) {
        this.templates = templates;
        this.expedition = expedition;
        this.html = this.templates.get('bodyExpedition');
        this.html.models.title.textContent = this.expedition.title;
        var currentdate;
        for (var i in this.expedition.points) {
            var point = new r1000ru.expedition.Point(this.templates, this.expedition.points[i]);
            var date = point.getISODate();
            if (date !== currentdate) {
                var dateHTML = this.templates.get('bodyExpeditionDay');
                dateHTML.models.date.textContent = point.getLocaleDate();
                this.html.models.points.appendChild(dateHTML);
                currentdate = date;
            }
            this.html.models.points.appendChild(point.html);
        }
    };

    window.r1000ru = window.r1000ru || {};
    window.r1000ru.expedition = window.r1000ru.expedition || {};
    window.r1000ru.expedition.Expedition = Expedition;
})();