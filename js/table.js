// var Tabulator = require('tabulator-tables');

class Table {
    /**
     * Creates a Table Object
     */
    constructor(data) {
        this.data = data;
        this.originalData = data;
        this.height = 400;
        this.width = 600;
    }

    createTable() {
        let div = d3.select("body").append('div').attr("id","table");
        let tableComponent = div.append('table').attr('width',this.width).attr('height',this.height);

        var table = new Tabulator("#table", {
          data: this.data, //load row data from array
          layout: "fitDataFill", //fit columns to width of table
          responsiveLayout: "hide", //hide columns that dont fit on the table
          tooltips: true, //show tool tips on cells
          addRowPos: "top", //when adding a new row, add it to the top of the table
          history: true, //allow undo and redo actions on the table
          pagination: "local", //paginate the data
          paginationSize: 7, //allow 7 rows per page of data
          movableColumns: true, //allow column order to be changed
          resizableRows: true, //allow row order to be changed
          initialSort: [
            //set the initial sort order of the data
            { column: "District", dir: "asc" }
          ],
          // Date/Time,Lat,Lon,Weight,Base,key,total_same_keys,Dow,Hour_of_Day,District
          columns: [
            //define the table columns
            { title: "Date/Time", field: "date", width:300 },
            { title: "Lat", field: "lat", visible: "false" },
            { title: "Lon", field: "lon", visible: "false" },
            { title: "Weight", field: "weight", visible: "false" },
            { title: "Base", field: "base", visible: "false" },
            { title: "key", field: "key", visible: "false" },
            { title: "Total Same Key", field: "totalSameKey", visible: "false" },
            { title: "Day Of Week", field: "Dow", sorter: "number", width:130 },
            { title: "Time", field: "Hour_of_Day", sorter: "number", width:130 },
            { title: "District", field: "District", sorter: "string", sorterParams:{alignEmptyValues:"bottom"}, width:130 }
          ]
        });

        // hide unnecessary columns
        table.hideColumn("lat");
        table.hideColumn("lon");
        table.hideColumn("weight");
        table.hideColumn("base");
        table.hideColumn("key");
        table.hideColumn("totalSameKey");

        this.updateTable();
    }


    // bars_dow() {
    //     let svg_DOW_bars = d3.selectAll('body').selectAll('div').select('#svg1').selectAll('rect');

    //     let svg_1 = d3.selectAll('body').selectAll('div').select('#svg1');

    //     //X-SCALE -SVG1 - DOW
    //     var dow = [{ day: "Monday" },
    //     { day: "Tuesday" },
    //     { day: "Wednesday" },
    //     { day: "Thursday" },
    //     { day: "Friday" },
    //     { day: "Saturday" },
    //     { day: "Sunday" }
    //     ];

    //     // Create scale
    //     var xScale = d3.scaleBand()
    //         .domain(dow.map(function (d) { return d.day }))
    //         .range([0, this.width * 0.85])
    //     // Add scales to axis
    //     var x_axis = d3.axisBottom()
    //         .scale(xScale).ticks(7);
    //     //Append group and insert axis
    //     svg_1.append("g")
    //         .attr("transform", "translate(50," + 300 + ")")
    //         .call(x_axis);

    //     //Y-SCALE-SVG1 - DOW
    //     var yScale = d3.scaleLinear()
    //         .domain([0, this.data.length])
    //         .range([this.height - 100, 50]);
    //     // Add scales to axis
    //     var y_axis = d3.axisLeft()
    //         .scale(yScale);
    //     //Append group and insert axis
    //     svg_1.append("g")
    //         .attr("transform", "translate(50," + 0 + ")")
    //         .call(y_axis);

    //     // check total pickups per day of week - returns 7 days with total pickups per each day
    //     var nested_data = d3.nest()
    //         .key(function (d) { return d.Dow; })
    //         .rollup(function (ids) {
    //             return ids.length;
    //         })
    //         .entries(this.data);

    //     var dow_data = nested_data;
    //     dow_data.sort(function (x, y) {
    //         return d3.ascending(x.key, y.key);
    //     })

    //     //clear bars

    //     var clear = [];
    //     svg_DOW_bars.data(clear).exit().remove();


    //     //add bars

    //     var pickUpScale = d3.scaleLinear()
    //         .domain([0, this.originalData.length])
    //         .range([50, 400]);


    //     svg_DOW_bars.data(dow_data).enter().append("rect")
    //         .attr('x', function (d, i) {
    //             return d.key * 50;
    //             //return i*50 + 50;
    //         }

    //         ).attr('y', function (d) { return 300 - pickUpScale(d.value) }).attr('width', 40).attr('height', function (d) { return pickUpScale(d.value) }).attr("fill", "green")

    // }




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
        this.bars_hourly();
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
        this.bars_dow();
    }
}