//Config Args : width height
class BrushConfig {
    constructor(width = 400, height = 50, borderLeft = 10, borderRight = 10, valueMin = 0, valueMax = 24, segment = 24) {
        this.width = width;
        this.height = height;
        this.borderLeft = borderLeft;
        this.borderRight = borderRight;
        this.valueMin = valueMin;
        this.valueMax = valueMax;
        this.segment = segment;
    }
}
class BrushSlider {
    constructor(domContainer, config) {
        this.onChange = null;
        this.onClear = null;

        this.container = domContainer;
        this.config = config;

        this.init();
    }

    init() {
        // append svg 
        this.svg = this.container
            .append('svg');

        this.svg.attr('width', this.config.width)
            .attr('height', this.config.height);

        // time from 0 to 24, map it to boder left to width - border right
        this.setValueScale(this.config.valueMin, this.config.valueMax, this.config.segment);

        let axisGroup = this.svg
            .append('g');

        axisGroup.style("transform", "translateY(" + (this.config.height - 1).toString() + "px)");
        axisGroup.call(this.valueAxis);

        this.initBrushes();
    }

    setValueScale(from, to, segment) {
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

    initBrushes() {
        let brushGroup = this.svg.append('g');

        this.activeBrush = null;

        let thresholdTest = (extent) => {
            if ((extent[1] - extent[0]) >= 1) {
                return true;
            }
            else {
                return false;
            }
        };

        let brushExtent = [[this.config.borderLeft, 0], [this.config.width - this.config.borderRight, this.config.height]];
        let that = this;

        const brush = d3
            .brushX()
            .extent(brushExtent)
            .on('start', function () {
                if (that.activeBrush) {
                    brushGroup.call(that.activeBrush.move, null);
                }
                that.activeBrush = brush;

                console.log("Brush Start");
            })
            .on("end", function () {
                const brushSelection = d3.brushSelection(this);
                if (brushSelection == null || !thresholdTest(brushSelection)) {
                    // recover
                    that.callOnClear();
                }
                console.log("Brush End");
            })
            .on("brush", function () {
                console.log("Brushing");
                const brushSelection = d3.brushSelection(this);
                if (brushSelection == null || !thresholdTest(brushSelection)) {
                    // recover
                    that.callOnClear();
                }
                else {
                    that.callOnChange(that.valueScale.invert(brushSelection[0]), that.valueScale.invert(brushSelection[1]));
                }
            });

        brushGroup.call(brush)
    }

    callOnChange(from, to) {
        if (this.onChange != null) {
            this.onChange(from, to);
        }
    }

    callOnClear() {
        if (this.onClear != null) {
            this.onClear();
        }
    }
}