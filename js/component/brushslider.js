//Config Args : width height
class BrushConfig{
    constructor(width = 400, height = 50, borderLeft = 10, borderRight = 10){
        this.width = width;
        this.height = height;
        this.borderLeft = borderLeft;
        this.borderRight = borderRight;
    }
}
class BrushSlider{
    constructor(domContainer, config){
        this.container = domContainer;
        this.config = config;

        this.init();
    }

    // callback
    onChange = null;

    init(){
        // append svg 
        this.svg = this.container
        .append('svg');

        this.svg.attr('width', this.config.width)
        .attr('height', this.config.height);

        // time from 0 to 24, map it to boder left to width - border right
        this.setValueScale(0, 24, 24);
        
        let axisGroup = this.svg
        .append('g');
        
        axisGroup.style("transform", "translateY(" + (this.config.height - 1).toString() + "px)");
        axisGroup.call(this.valueAxis);
    }

    setValueScale(from, to, segment)
    {
        this.valueScale = d3
            .scaleLinear()
            .domain([from, to])
            .range([0 + this.config.borderLeft, this.config.width - this.config.borderRight])
            .nice();
        this.valueAxis = d3.
            axisTop();

        this.valueAxis.scale(this.valueScale);
        this.valueAxis.ticks(segment);
    }
}