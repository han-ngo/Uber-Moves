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
    }
}