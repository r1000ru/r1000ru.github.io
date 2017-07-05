(function() {
    var MicroTemplate = function() {
        this.templates = {}
    }

    MicroTemplate.prototype.fromHTML = function(template, html) {
        this.templates[template] = this.toDOM(html);
    }

    MicroTemplate.prototype.fromFiles = function(templates, callback) {
        var count = Object.keys(templates).length;
        var self = this;
        for (template in templates) {
            var xhrs = {};
            xhrs[template] = new XMLHttpRequest();
            xhrs[template].open('GET', templates[template], true);
            xhrs[template].templateName = template;
            xhrs[template].onload = function() {
                count--;
                self.templates[this.templateName] = self.toDOM(this.responseText);
                if (!count) {
                    callback(true);
                }
            };
            xhrs[template].onerror = function(e) {
                count--;
                console.error('Template URL ' + this.templateName + ' is not correct', e);
                if (!count) {
                    callback();
                }
            };
            xhrs[template].send();
        }
    }

    MicroTemplate.prototype.toDOM = function(html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        return element;
    }

    MicroTemplate.prototype.get = function(template) {
        var element = this.templates[template].cloneNode(true);
        var models = element.querySelectorAll('[data-model]');
        var result = element.firstChild;
        result.models = {};
        for (var m = 0; m < models.length; m++) {
            var model = models[m];
            var modelName = model.getAttribute('data-model');
            var modelType = model.getAttribute('data-type');
            if (modelType === 'text') {
                var textChild;
                var childs = model.childNodes;
                if (childs.length === 0) {
                    textChild = document.createTextNode('');
                    model.appendChild(textChild);
                } else if (childs[0].nodeType !== 3) {
                    textChild = document.createTextNode('');
                    model.insertBefore(textChild, childs[0]);
                } else {
                    textChild = childs[0];
                }
                result.models[modelName] = textChild;
            } else {
                result.models[modelName] = models[m];
            }

        }
        return result;
    }

    window.r1000ru = window.r1000ru || {};
    window.r1000ru.MicroTemplate = MicroTemplate;
})()