(function(){
    var SatelliteControl = function() {
        this._map;
        this._container;
    };

    SatelliteControl.prototype.onAdd = function(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.classList.add('mapboxgl-ctrl');
        this._container.classList.add('mapboxgl-ctrl-group');

        this._oButton = document.createElement('button');
        this._oButton.innerHTML = '<i class="icon-main_map"></i>';
        this._oButton.classList.add('mapbox-ctrl-icon');
        this._container.appendChild(this._oButton);

        this._sButton = document.createElement('button');
        this._sButton.innerHTML = '<i class="icon-main_sputnik"></i>';
        this._sButton.classList.add('mapbox-ctrl-icon');
        this._container.appendChild(this._sButton);
        
        var self = this;
        
        this._oButton.onclick = function() {
            self._map.setLayoutProperty('building-3d', 'visibility', 'visible');
            self._map.setLayoutProperty('buildnumber', 'visibility', 'visible');
            self._map.setLayoutProperty('satelliteLayer', 'visibility', 'none');
        }

        this._sButton.onclick = function() {
            self._map.setLayoutProperty('building-3d', 'visibility', 'visible');
            self._map.setLayoutProperty('buildnumber', 'visibility', 'visible');
            self._map.setLayoutProperty('satelliteLayer', 'visibility', 'visible');
        }

        return this._container;
    };

    SatelliteControl.prototype.onRemove = function() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    };

    var Map = function(element) {
        this.element = element;
        this.init = false;
        this.osmap = new mapboxgl.Map({
            container: this.element.id,
            center: [37.835, 55.80782],
            zoom: 3,
        });
        this.osmap.setStyle(r1000ru.expedition.mapStyle);
        this.osmap.addControl(new mapboxgl.NavigationControl());
        this.osmap.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
        this.osmap.addControl(new SatelliteControl());

        var self = this;
        
        this.osmap.on('load', function(){
            self.onLoad();
        });
    };

    Map.prototype.onLoad = function() {
        this.init = true;
        
        
        this.osmap.addLayer({
            'id': 'satelliteLayer',
            'type': 'raster',
            'source': {
                'type': 'raster',
                'tiles': [
                    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256
            },
            'paint': {}
        }, 'road_major_label');
        this.osmap.setLayoutProperty('satelliteLayer', 'visibility', 'none');
        
        this.osmap.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            },
            paint: {
                'line-width': 7,
                'line-color': {
                    'type': 'identity',
                    'property': 'color'
                }
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            transition: {
                duration: 0,
                delay: 0
            }
        }, 'building-3d');
    }

    window.r1000ru = window.r1000ru || {};
    window.r1000ru.expedition = window.r1000ru.expedition || {};
    window.r1000ru.expedition.Map = Map;
})();




