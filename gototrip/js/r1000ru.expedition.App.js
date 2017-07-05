(function(){
    'use strict';
    var App = function(templates) {
        this.templates = templates;
        this.html = this.templates.get('body');
        document.body.appendChild(this.html);
        this.map = new r1000ru.expedition.Map(this.html.models.map);
        this.operation = new r1000ru.expedition.Expedition(this.templates, currenttrip);
        this.html.models.operations.appendChild(this.operation.html);
    };

    window.r1000ru = window.r1000ru || {};
    window.r1000ru.expedition = window.r1000ru.expedition || {};
    window.r1000ru.expedition.App = App;
})();