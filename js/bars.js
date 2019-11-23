class Bars {
    /**
     * Creates a Table Object
     */
    constructor(data) {
 
        this.data = data;
        this.originalData = data;
        this.height = 400;
        this.width = 400;

    }

    createBars() {
        // set the ranges
         let div = d3.select("body").append('div').attr("id","bars");

        let svg_DOW_bars = div.append('svg').attr('width',400).attr('height',400).attr("id","svg1");
        let svg_Pickup_byHours = div.append('svg').attr('width',400).attr('height',400).attr("id","svg2");;
        let svg_Dow_Hours = div.append('svg').attr('width',400).attr('height',400).attr("id","svg3");;

        let width = parseInt(svg_DOW_bars.style("width"));
        let height = parseInt(svg_DOW_bars.style("height"));

   

       


       
 



        this.updateBars();
    }

    updateBars()
    {
        this.bars_dow();
        
        this.bars_hourly();

        this.dow_hourly();

    }

    bars_dow()
    {
        let svg_DOW_bars = d3.selectAll('body').selectAll('div').select('#svg1').selectAll('rect');

        let svg_1 = d3.selectAll('body').selectAll('div').select('#svg1');

         //X-SCALE -SVG1 - DOW
       var dow = [{day:"Monday"},
       {day:"Tuesday"},
       {day:"Wednesday"},
       {day:"Thursday"},
       {day:"Friday"},
       {day:"Saturday"},
       {day:"Sunday"}
        ];

         // Create scale
        var xScale = d3.scaleBand()
        .domain(dow.map(function(d){ return d.day}))
        .range([0, this.width*0.85])
        // Add scales to axis
        var x_axis = d3.axisBottom()
        .scale(xScale).ticks(7);
        //Append group and insert axis
        svg_1.append("g")
        .attr("transform", "translate(50," + 300 + ")")
        .call(x_axis);

    //Y-SCALE-SVG1 - DOW
        var yScale = d3.scaleLinear()
        .domain([0, this.data.length])
        .range([this.height-100,50]);
        // Add scales to axis
        var y_axis = d3.axisLeft()
        .scale(yScale);
        //Append group and insert axis
        svg_1.append("g")
        .attr("transform", "translate(50," + 0 + ")")
        .call(y_axis);

        // check total pickups per day of week - returns 7 days with total pickups per each day
            var nested_data = d3.nest()
            .key(function(d) { return d.Dow; })
            .rollup(function(ids) {
                return ids.length; 
            })
            .entries(this.data);
    
            var dow_data= nested_data;
            dow_data.sort(function(x, y){
                return d3.ascending(x.key, y.key);
             })
            
            //clear bars
           
            var clear =[];
            svg_DOW_bars.data(clear).exit().remove();
     
            
            //add bars
            
            var pickUpScale = d3.scaleLinear()
            .domain([0, this.originalData.length])
            .range([50, 400]);
    
            
            svg_DOW_bars.data(dow_data).enter().append("rect")
            .attr('x', function(d,i) {
                return d.key*50;
                //return i*50 + 50;
               }
            
            ).attr('y', function(d){return 300-pickUpScale(d.value)}).attr('width',40).attr('height',function(d){return pickUpScale(d.value)}).attr("fill","green")
           
    }

    bars_hourly()
    {
        let svg_Pickup_byHours = d3.selectAll('body').selectAll('div').select('#svg2').selectAll('rect');
        let svg_2 = d3.selectAll('body').selectAll('div').select('#svg2');

        console.log("in bar hourly");
        console.log(this.data);

    
 //X-SCALE -SVG2 - HOURLY
       
 
          // Create scale
          var xScale = d3.scaleLinear()
          .domain([0,23])
          .range([0, this.width*0.85])
          // Add scales to axis
          var x_axis = d3.axisBottom()
          .scale(xScale).ticks(23);
          //Append group and insert axis
          svg_2.append("g")
          .attr("transform", "translate(55," + 300 + ")")
          .call(x_axis);
  
         //Y-SCALE-SVG2 - HOURLY
          var yScale = d3.scaleLinear()
          .domain([0, this.data.length])
          .range([this.height-100,50]);
          // Add scales to axis
          var y_axis = d3.axisLeft()
          .scale(yScale);
          //Append group and insert axis
          svg_2.append("g")
          .attr("transform", "translate(50," + 0 + ")")
          .call(y_axis);

        // check total pickups per day of week - returns 7 days with total pickups per each day
            var nested_data = d3.nest()
            .key(function(d) { return d.Hour_of_Day; })
            .rollup(function(ids) {
                return ids.length; 
            })
            .entries(this.data);
    
            var dow_data= nested_data;
            dow_data.sort(function(x, y){
                return d3.ascending(parseInt(x.key), parseInt(y.key));
             })
            
            //clear bars
           
            var clear =[];
            svg_Pickup_byHours.data(clear).exit().remove();
     
            
            //add bars
            
            var pickUpScale = d3.scaleLinear()
            .domain([0, this.originalData.length])
            .range([50, 400]);
    
            
            let g = d3.selectAll('body').selectAll('div').select('#svg2').append('g').attr("transform","translate(42,0)").attr("id","grect2");

            let gBars = d3.selectAll('body').selectAll('div').select('#svg2').select('#grect2').selectAll('rect');

            
            gBars.data(dow_data).enter().append("rect")
            .attr('x', function(d,i) {
                
                 return d.key*15 + 5;
               }
            
            ).attr('y', function(d){return 300-pickUpScale(d.value)}).attr('width',10).attr('height',function(d){return pickUpScale(d.value)}).attr("fill","green")
           
    }

//Dow and Hours - SVG3
dow_hourly()
{
    let svg_Dow_Hours = d3.selectAll('body').selectAll('div').select('#svg3').selectAll('line');
    let svg_3 = d3.selectAll('body').selectAll('div').select('#svg3');

    
    // check total pickups per day of week - returns 7 days with total pickups per each day
        var nested_data = d3.nest()
        .key(function(d) { return d.Dow; })
        .key(function(d) { return d.Hour_of_Day; })
        .rollup(function(ids) {
            return ids.length; 
        })
        .entries(this.data);

        var dow_data= nested_data;
        dow_data.sort(function(x, y){
            return d3.ascending(parseInt(x.key), parseInt(y.key));
         })
        
         //get max of all pickup count values per dow_hourly
         let max = d3.max(dow_data, function(d,i) 
                        {
                            //console.log(d3.max(d.values,d=>d.value));
                            for(var j=0;j<d.values.length;j++)
                                {return d3.max(d.values,d=>d.value)}
                        });

                         //get max of all pickup count values per dow_hourly
         let min = d3.min(dow_data, function(d,i) 
         {
             //console.log(d3.max(d.values,d=>d.value));
             for(var j=0;j<d.values.length;j++)
                 {return d3.min(d.values,d=>d.value)}
         });
                    
        //clear bars
       
        var clear =[];
        svg_Dow_Hours.data(clear).exit().remove();
 
        let width = 400;
        let height = 400;
        
        //add bars
        console.log(max);
        

           // Create scale
           var xScale = d3.scaleLinear()
           .domain([0,23])
           .range([0, width*0.85])
           // Add scales to axis
           var x_axis = d3.axisBottom()
           .scale(xScale).ticks(23);
           //Append group and insert axis
           svg_3.append("g")
           .attr("transform", "translate(55," + 300 + ")")
           .call(x_axis);
   
          //Y-SCALE-SVG3 - DOW-HOURLY
           var yScale = d3.scaleLinear()
           .domain([0, max])
           .range([height-100,50]);
           // Add scales to axis
           var y_axis = d3.axisLeft()
           .scale(yScale);
           //Append group and insert axis
           svg_3.append("g")
           .attr("transform", "translate(50," + 0 + ")")
           .call(y_axis);

        var pickUpScale = d3.scaleLinear()
        .domain([0, max])
        .range([min, max]);

        
        let g = d3.selectAll('body').selectAll('div').select('#svg3').append('g').attr("transform","translate(0,0)").attr("id","gline3");

        let gBars = d3.selectAll('body').selectAll('div').select('#svg3').selectAll("g").select('#gline3');

        let lineGenerator = d3
        .line()
        .x((d, i) =>  d.key*14 + 50)
        .y(d => 300-pickUpScale(d.value));

        let color =["green","red","brown","orange","black","blue","yellow"];

    for(var i=0;i<dow_data.length;i++)
        {
            var data = dow_data[i].values;
            console.log(data);
            data.sort(function(x, y){
                return d3.ascending(parseInt(x.key), parseInt(y.key));
             })

let Xpath= d3.selectAll("#svg3").select("#gline3").append('path').attr("opacity",1)
.attr("transform","translate(0,0)")
//.attr("stroke", "#086fad")
.attr("stroke-width", "0.5")
.attr("fill", "none")
.attr("stroke",color[i]);

let newYpath = Xpath.attr("d", lineGenerator(data));
        //      return d.key*15 + 5;
         //   }
            
           // )
      //      .attr('y', function(d){return 300-pickUpScale(d.value)})
        //    .attr('width',10)
          //  .attr('height',function(d){return pickUpScale(d.value)})
          //  .attr("fill","green")
        }
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


