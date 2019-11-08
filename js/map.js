class GeoMap {
    constructor() {
        this.init();
    }

    init() {
        this.data = [];

        const MAP_CONTAINER = "map-container";
        d3.select("body").append("div")
            .attr("id", MAP_CONTAINER)
            .style("width", "800px")
            .style("height", "600px");

        //40.769,
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
        d3.select(".maptalks-attribution").style("opacity", 0);

        var extent = map.getExtent();
        map.setMaxExtent(extent);

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

        // map.getLayer('v')
        //     .addGeometry(
        //         new maptalks.Polygon(extent.toArray(), {
        //             symbol: { 'polygonOpacity': 0, 'lineWidth': 5 }
        //         })
        //     );

        this.d3Layer = new maptalks.D3Layer('d3', { 'renderer': 'dom', 'hideWhenZooming': false });

        this.d3Layer.prepareToDraw = function (ctx, projection) {
            //preparation
        };

        this.d3Layer.draw = (ctx, projection) => {
            //drawing the layer
            console.log("drawing");
            console.log(projection([-73, 40.769])[0]);

            let svg = d3.select(ctx);
            var boxInfo = svg.attr("viewBox").split(" ");
            var scale = +boxInfo[2] / 800;

            this.circles = svg.selectAll("circle").data(this.data);

            let opacity = this.heatLayerToggle?0:0.8;

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
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('zooming zoomend', (e) => {
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('pitch', (e) => {
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('rotate', (e) => {
            this.d3Layer.redraw();
            console.log("redraw");
        });

        // try heat map
        // var data = [[-73.9549, 40.769, 0.3], [-73.9549, 40.769, 0.4], [-63.9549, 30.769, 0.4], [-86.9549, 40.769, 1.2], [-72.9549, 41.769, 0.8], [-71.9549, 40.769, 0.1]];
        this.heatLayer = new maptalks.HeatLayer('heat', []).addTo(map);
        this.heatLayer.config({
            'radius' : 15,
            'blur' : 4,
            'gradient' : {0.4: 'blue', 0.65: 'lime', 1: 'red'}
        });
        // toolbar for debugging
        // vertical one on top right
        new maptalks.control.Toolbar({
            'vertical': true,
            'position': 'top-right',
            'items': [{
                item: 'Heat Map Mode',
                click: () => {
                    this.toggleHeatLayer();
                }
            },]
        })
            .addTo(map);
    }

    heatLayerToggle = false;

    toggleHeatLayer(){
        this.heatLayerToggle = !this.heatLayerToggle;
        if(this.heatLayerToggle)
        {
            this.renderHeatMap(this.data);
            this.hideCircles();
        }
        else
        {
            this.heatLayer.clear();
            this.showCircles();
        }
    }

    hideCircles()
    {
        this.circles.style("opacity", 0);
    }

    showCircles()
    {
        this.circles.style("opacity", 0.8);
    }

    renderHeatMap(data){
        let heatMapData = data.map(item => {
            return [item.Lon, item.Lat, 0.05];
        });
        this.heatLayer.setData(heatMapData);
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
                ) 
            {
                this.data.push(item);
            }
        }

        this.d3Layer.redraw();
        
        if(this.heatLayerToggle)
        {
            this.renderHeatMap(this.data);
        }
    }

    // only can be called by other class
    update(data) {
        this.originalData = data;
        this.data = data;
        this.d3Layer.redraw();
    }
}