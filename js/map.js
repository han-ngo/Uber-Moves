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

        this.d3Layer.draw = (ctx, projection)=>{
            //drawing the layer
            console.log("drawing");
            console.log(projection([-73, 40.769])[0]);

            var svg = d3.select(ctx);
            var boxInfo = svg.attr("viewBox").split(" ");
            var scale = +boxInfo[2] / 800;

            let circles = svg.selectAll("circle").data(this.data);

            // svg.html("");
            circles
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
                .style("opacity", 0.8);
        };

        map.addLayer(this.d3Layer);

        map.on('moving moveend', (e)=>{
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('zooming zoomend', (e)=>{
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('pitch', (e)=>{
            this.d3Layer.redraw();
            console.log("redraw");
        });

        map.on('rotate', (e)=>{
            this.d3Layer.redraw();
            console.log("redraw");
        });

        // try heat map
        // var data = [[-73.9549, 40.769, 0.3], [-73.9549, 40.769, 0.4], [-63.9549, 30.769, 0.4], [-86.9549, 40.769, 1.2], [-72.9549, 41.769, 0.8], [-71.9549, 40.769, 0.1]];
        // var heatLayer = new maptalks.HeatLayer('heat', data).addTo(map);
    }

    update(data) {
        this.data = data;
        this.d3Layer.redraw();
    }
}