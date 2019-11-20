class GeoMap {
    constructor() {
        this.init();
    }

    // 0 d3 layer, 1 heat layer, 2 cluster
    mode = 0;

    init() {
        this.data = [];

        const MAP_CONTAINER = "map-container";
        d3.select("body").append("div")
            .attr("id", MAP_CONTAINER)
            .style("width", "800px")
            .style("height", "600px");

        var map = new maptalks.Map(MAP_CONTAINER, {
            center: [-73.3, 40.769],
            zoom: 8,
            minZoom: 8, // set map's min zoom to 14
            maxZoom: 18,
            centerCross: false,
            baseLayer: new maptalks.TileLayer('base', {
                urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                subdomains: ['a', 'b', 'c', 'd'],
                attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            }),
            layers: [
                new maptalks.VectorLayer('v')
            ]
        });

        this.map = map;

        d3.select(".maptalks-attribution").style("opacity", 0);

        var extent = map.getExtent();
        map.setMaxExtent(extent);

        this.InitGeoJsonPolygon();

        this.InitD3Layer();

        this.InitHeatLayer();

        this.InitMarkerClusterLayer();

        // toolbar for debugging
        // vertical one on top right
        new maptalks.control.Toolbar({
            'vertical': true,
            'position': 'top-right',
            'items': [{
                item: 'Map Mode',
                click: function () {  
                },
                children: [{
                    item: 'Cluster',
                    click: ()=> 
                    { 
                        this.mode = 2;
                        this.updateMapMode();
                    }
                },{
                    item: 'Circle',
                    click: ()=> 
                    { 
                        this.mode = 0;
                        this.updateMapMode();
                    }
                }, {
                    item: 'HeatMap',
                    click: ()=> 
                    { 
                        this.mode = 1; 
                        this.updateMapMode();
                    }
                }]
            },]
        })
            .addTo(map);

        this.mode = 2;
        this.updateMapMode();
    }

    InitMarkerClusterLayer() {
        var map = this.map;

        this.clusterMarkers = [];

        for (var i = 0; i < this.data.length; i++) {
            var a = this.data[i];
            this.clusterMarkers.push(new maptalks.Marker([a.Lon, a.Lat]).on('mousedown', OnClick));
        }

        this.clusterLayer = new maptalks.ClusterLayer('cluster', this.clusterMarkers, {
            'noClusterWithOneMarker': false,
            'maxClusterZoom': 18,
            //"count" is an internal variable: marker count in the cluster.
            'symbol': {
                'markerType': 'ellipse',
                'markerFill': { property: 'count', type: 'interval', stops: [[0, 'rgb(135, 196, 240)'], [9, '#1bbc9b'], [99, 'rgb(216, 115, 149)']] },
                'markerFillOpacity': 0.7,
                'markerLineOpacity': 1,
                'markerLineWidth': 3,
                'markerLineColor': '#fff',
                'markerWidth': { property: 'count', type: 'interval', stops: [[0, 40], [9, 60], [99, 80]] },
                'markerHeight': { property: 'count', type: 'interval', stops: [[0, 40], [9, 60], [99, 80]] }
            },
            'drawClusterText': true,
            'geometryEvents': true,
            'single': true
        });

        map.addLayer(this.clusterLayer);
        
        map.on('click', (e)=>{
            let target = this.clusterLayer.identify(e.coordinate);
            let callbackResults = [];
            for(let child of target.children)
            {
                callbackResults.push(this.data[child.data_index]);
            }

            for(let callback of this.selectionCallbacks)
            {
                callback(callbackResults);
            }
        });

        function OnClick(e){
            console.log(e.target);
        };
    }

    InitGeoJsonPolygon() {
        var map = this.map;

        var nyBoundry = maptalks.GeoJSON.toGeometry(AppManager.getInstance().NewYorkGeoJson.features);
        nyBoundry.forEach(element => {
            element.setSymbol(
                {
                    'polygonFill': 'rgb(135,196,240)',
                    'polygonOpacity': 0.3,
                    'lineColor': '#1bbc9b',
                    'lineWidth': 2,
                    'lineJoin': 'round', //miter, round, bevel
                    'lineCap': 'round', //butt, round, square
                    'lineDasharray': null,//dasharray, e.g. [10, 5, 5]
                    'lineOpacity ': 0.7
                }
            );
        });
        map.getLayer('v')
            .addGeometry(nyBoundry);
    }

    InitD3Layer() {
        var map = this.map;

        this.d3Layer = new maptalks.D3Layer('d3', { 'renderer': 'dom', 'hideWhenZooming': false });

        this.d3Layer.prepareToDraw = function (ctx, projection) {
            //preparation
        };

        this.d3Layer.draw = (ctx, projection) => {
            //drawing the layer
            console.log("drawing");

            let svg = d3.select(ctx);
            var boxInfo = svg.attr("viewBox").split(" ");
            var scale = +boxInfo[2] / 800;

            this.circles = svg.selectAll("circle").data(this.data);

            let opacity = this.mode == 0 ? 0.8 : 0;

            // svg.html("");
            this.circles = this.circles
                .join("circle")
                .attr("cx", d => {
                    return projection([d.Lon, d.Lat])[0];
                })
                .attr("cy", d => {
                    return projection([d.Lon, d.Lat])[1];
                }
                )
                .attr("r", 5.0 * scale)
                .style("fill", "steelblue")
                .style("opacity", opacity);
        };

        map.addLayer(this.d3Layer);

        map.on('moving moveend', (e) => {
            if(this.mode != 0)
            {
                return;
            }
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('zooming zoomend', (e) => {
            if(this.mode != 0)
            {
                return;
            }
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('pitch', (e) => {
            if(this.mode != 0)
            {
                return;
            }
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('rotate', (e) => {
            if(this.mode != 0)
            {
                return;
            }
            this.d3Layer.redraw();
            console.log("redraw");
        });
    }

    InitHeatLayer() {
        this.heatLayer = new maptalks.HeatLayer('heat', []).addTo(this.map);
        this.heatLayer.config({
            'radius': 15,
            'blur': 4,
            'gradient': { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        });
    }

    updateMapMode() {
        if (this.mode == 1) {
            this.renderHeatMap(this.data);
            this.hideCircles();
            this.clusterLayer.hide();
        }
        else if(this.mode == 0) {
            this.heatLayer.clear();
            // this.showCircles();
            this.d3Layer.redraw();
            this.clusterLayer.hide();
        }
        // cluster
        else{
            this.hideCircles();
            this.heatLayer.clear();
            this.clusterLayer.show();
        }
    }

    hideCircles() {
        this.circles.style("opacity", 0);
    }

    showCircles() {
        this.circles.style("opacity", 0.8);
    }

    renderHeatMap(data) {
        let heatMapData = data.map(item => {
            return [item.Lon, item.Lat, 0.05];
        });
        this.heatLayer.setData(heatMapData);
    }

    renderClusterLayer(data) {
        // getGeometries
        // removeGeometry

        let marks = this.clusterLayer.getGeometries();
        this.clusterLayer.removeGeometry(marks);

        let newMarks = [];

        for (var i = 0; i < data.length; i++) {
            var a = data[i];
            let marker = new maptalks.Marker([a.Lon, a.Lat]).on('mousedown', null);
            marker.data_index = i;
            newMarks.push(marker);
        }

        this.clusterLayer.addGeometry(newMarks);
    }

    filtByHourTime(from, to) {
        this.data = [];

        for (let item of this.originalData) {
            let hour = item.date.getHours();
            let minute = item.date.getMinutes();

            let fromHour = Math.floor(from);
            let fromMin = (from - fromHour) * 60;

            let toHour = Math.floor(to);
            let toMin = (to - toHour) * 60;

            if (
                (
                    (hour == fromHour && minute >= fromMin)
                    ||
                    hour > fromHour
                )
                &&
                (
                    (hour == toHour && minute <= toMin)
                    ||
                    hour < toHour
                )
            ) {
                this.data.push(item);
            }
        }

        if(this.mode == 0)
        {
            this.d3Layer.redraw();
        }
        if (this.mode == 1) 
        {
            this.renderHeatMap(this.data);
        }
        if(this.mode == 2)
        {
            this.renderClusterLayer(this.data);
        }
    }

    filtByWeekDay(from, to) {
        this.data = [];
        
        for (let item of this.originalData) {
            let day = item.date.getDay();
            
            let fromDay = Math.floor(from);

            let toDay = Math.floor(to);

            if (
                (
                    (day == fromDay)
                    ||
                    day > fromDay
                )
                &&
                (
                    (day == toDay)
                    ||
                    day < toDay
                )
            ) {
                this.data.push(item);
            }
        }

        if (this.mode == 0) {
            this.d3Layer.redraw();
        }
        if (this.mode == 1) {
            this.renderHeatMap(this.data);
        }
        if (this.mode == 2) {
            this.renderClusterLayer(this.data);
        }
    }

    // only can be called by other class
    update(data) {
        this.originalData = data;
        this.data = data;
        this.d3Layer.redraw();

        this.renderClusterLayer(data);
    }

    onSelection(callback)
    {
        this.selectionCallbacks.push(callback);
    }

    removeAllSelectionCallback()
    {
        this.selectionCallbacks.clear();
    }

    selectionCallbacks = [];
}