class GeoMap {
    constructor() {
        this.init();
    }

    init() {
        const MAP_CONTAINER = "map-container";
        d3.select("body").append("div")
            .attr("id", MAP_CONTAINER)
            .style("width", "800px")
            .style("height", "600px");

        //40.769,
        var map = new maptalks.Map(MAP_CONTAINER, {
            center: [-73.9549, 40.769],
            zoom: 12,
            baseLayer: new maptalks.TileLayer('base', {
                urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                subdomains: ['a', 'b', 'c', 'd'],
                attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            })
        });
        d3.select(".maptalks-attribution").style("opacity", 0);

        var d3Layer = new maptalks.D3Layer('d3', { 'renderer': 'dom', 'hideWhenZooming': false });

        d3Layer.prepareToDraw = function (ctx, projection) {
            //preparation
        };

        d3Layer.draw = function (ctx, projection) {
            //drawing the layer
            console.log("drawing");
            console.log(projection([-73.9549, 40.769])[0]);

            var svg = d3.select(ctx);
            var boxInfo = svg.attr("viewBox").split(" ");
            var scale = +boxInfo[2] / 800;

            var trans = projection([-73.9549, 40.769]);
            svg.html("");
            svg.append("circle")
                .attr("cx", projection([-73.9549, 40.769])[0]
                )
                .attr("cy", projection([-73.9549, 40.769])[1]
                )
                .attr("r", 25.0 * scale)
                .style("fill", "steelblue")
                .style("opacity", 0.8);
        };

        map.addLayer(d3Layer);

        map.on('moving moveend', function (e) {
            d3Layer.redraw();
            console.log("redraw");
        });

        map.on('zooming zoomend', function (e) {
            d3Layer.redraw();
            console.log("redraw");
        });

        map.on('pitch', function (e) {
            d3Layer.redraw();
            console.log("redraw");
        });

        map.on('rotate', function (e) {
            d3Layer.redraw();
            console.log("redraw");
        });

        // try heat map
        var data = [[-73.9549, 40.769, 0.3], [-73.9549, 40.769, 0.4], [-63.9549, 30.769, 0.4], [-86.9549, 40.769, 1.2], [-72.9549, 41.769, 0.8], [-71.9549, 40.769, 0.1]];
        var heatLayer = new maptalks.HeatLayer('heat', data).addTo(map);
    }
}