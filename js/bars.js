class Bars {
    /**
     * Creates a Table Object
     */
    constructor(data) {
 
        this.data = data;
        this.originalData = data;
        this.height = 400;
        this.width = 400;

        this.hourFilteredArray = [];
        for (let i = 0; i <= 23; i++) {
            this.hourFilteredArray.push(i);
        }

        this.weekFilteredArray = [];
        for (let i = 0; i <= 6; i++) {
            this.weekFilteredArray.push(i);
        }


    }

    createBars() {
        // set the ranges
        let div = d3.select("#bars");
        this.container = div;

        let svg_DOW_bars = div.append('svg').attr('width',400).attr('height',400).attr("id","svg1");
        let svg_Pickup_byHours = div.append('svg').attr('width',400).attr('height',400).attr("id","svg2");;
        let svg_Dow_Hours = div.append('svg').attr('width',400).attr('height',400).attr("id","svg3");;

        let width = parseInt(svg_DOW_bars.style("width"));
        let height = parseInt(svg_DOW_bars.style("height"));

   

        d3.selectAll("#hour-id").remove();

        let hourID = div.select('#svg1').append('g').attr("id","hour-id");
         hourID.append("text")
        .attr("x", 100)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Hours: " + "00:00" +  " to " + "24:00");

 
        //d3.selectAll("#dow-id").remove();
        d3.select("#svg2").html("");

        let dowID = div.select('#svg2').append('g').attr("id","dow-id");
         dowID.append("text")
        .attr("x", 100)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Days: " + "Monday" +  " to " + "Sunday");
       
        //let color =["green","red","brown","orange","black","blue","pink"];
        let dow =["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

        d3.selectAll("#dow").remove();

        let dowLegend = div.select('#svg3').append('g').attr("id","dow");
        dowLegend.selectAll("rect").data(dow).append("rect")
        .attr("x", (d,i)=> 50 + i * 10)
        .attr("y", 10)
        .attr("width", 10)
        .attr("height", 10)

        dowLegend.selectAll("text").data(dow)

        .append("text")
        .attr("x", (d,i)=> 60 + i * 10)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text((d,i)=> dow[i]);

        d3.selectAll("#dow-hour-id").remove();
            
        

        let color =["#7bc0e4","#c96367","#cb85ab","#5d5d5d","#c0b987","#f5c987","#d94b4d"];
         let dow_hour_ID = d3.selectAll('body').select('#svg3').append('g').attr("id","dow-hour-id").selectAll("rect");
   /*      dow_hour_ID.data(dow).enter().append("rect")
        .attr("x", (d,i) => 60 + i*45)
        .attr("y", 10)
        .attr("width", "10")
        .attr("height", "10")
        .attr("fill", (d,i)=>color[i]);*/

        dow_hour_ID = d3.selectAll('body').select('#svg3').select("#dow-hour-id").selectAll("text");

        dow_hour_ID.data(dow).enter().append("text")

         .attr("x", (d,i)=> 70 + i * 45)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text((d,i)=> dow[i])
        .style('fill', (d,i)=>color[i]);



        AppManager.getInstance().getMap().onSelection((data)=>{
            if(data == null || data.length == 0)
            {
                this.data = this.originalData;
            }
            else    
            {
                this.data= data;
            }


        this.updateBars();

         });
        
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
        let svg_DOW_bars = this.container.select('#svg1');

        let svg_1 = this.container.select('#svg1');





         //X-SCALE -SVG1 - DOW
       var dow = [{day:"Monday"},
       {day:"Tuesday"},
       {day:"Wednesday"},
       {day:"Thursday"},
       {day:"Friday"},
       {day:"Saturday"},
       {day:"Sunday"}
        ];

        //console.log(this.data);
        
      

        // check total pickups per day of week - returns 7 days with total pickups per each day
            var nested_data = d3.nest()
            .key(function(d) { return d.Dow; })
            .rollup(function(ids) {
                return ids.length; 
            })
            .entries(this.data);
    
            var dow_data= nested_data;
           // console.log(dow_data);
            dow_data.sort(function(x, y){
                return d3.ascending(x.key, y.key);
             })
            
            // console.log(dow_data);
                //get max of all pickup count values per dow_hourly
            let max = d3.max(dow_data, function(d,i) 
            {
                
                    {return d.value}
            });

                    //get max of all pickup count values per dow_hourly
            let min = d3.min(dow_data, function(d,i) 
            {
                        {return d.value}
            });

        //    console.log(min);
         //   console.log(max);

             // remove old axis
         d3.select("#xAxis1").remove();

         d3.select("#yAxis1").remove();


         // Create scale
        var xScale = d3.scaleBand()
        .domain(dow.map(function(d){ return d.day}))
        .range([0, this.width*0.875])
        // Add scales to axis
        var x_axis = d3.axisBottom()
        .scale(xScale).ticks(7);
        //Append group and insert axis
        svg_1.append("g").attr("id","xAxis1")
        .attr("transform", "translate(50," + 300 + ")")
        .call(x_axis);

    //Y-SCALE-SVG1 - DOW
        var yScale = d3.scaleLinear()
        .domain([0, max])
        .range([this.height-100,50]);
        // Add scales to axis
        var y_axis = d3.axisLeft()
        .scale(yScale);
        //Append group and insert axis
        svg_1.append("g").attr("id","yAxis1")
        .attr("transform", "translate(50," + 0 + ")")
        .call(y_axis);

        svg_1.selectAll(".xaxis text")  // select all the text elements for the xaxis
        .attr("transform", function(d) {
           return "translate(" + this.getBBox().this.height*-2 + "," + this.getBBox().height + ")rotate(-45)";
       });
  
       d3.selectAll("#text1").remove();

      // now add titles to the axes
      svg_1.append("text").attr("id","text1")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ (50/4) +","+(this.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
          .text("Pickups");

      svg_1.append("text").attr("id","text1")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ (this.width/2) +","+(this.height-(60))+")")  // centre below axis
          .text("Days of Week");

         
          //labels for svg -3
          

            //clear bars
           
            var clear =[];
            svg_DOW_bars.selectAll("rect").data(clear).exit().remove();
     
            
            //add bars
            
            var pickUpScale = d3.scaleLinear()
            .domain([0, max])
            .range([0, 250]);
    
      //      console.log(dow_data);

             // remove old data
         d3.select("#grect1").remove();


            let g = this.container.select('#svg1').append('g').attr("id","grect1");

            let gBars = this.container.select('#svg1').select('#grect1');

         //   svg_DOW_bars.selectAll("rect").data(dow_data).enter().append("rect")
         let rect =  gBars.selectAll("rect").data(dow_data).enter().append("rect")

          
             .attr('x', function(d,i) {
          //      console.log("in x");
                let position = 7;
                if(d.key==1)
                    {position = 7;}
                    else
                   { position = d.key - 1;}
           //        console.log(position);
                return position*50 + 5;
                }
            
            ).attr('y', function(d){return 300})
             .attr('height',function(d){return 0}).attr("fill","#00b894")
             .attr('width',40)
            
           .transition()
              .duration(2000)
              .attr('x', function(d,i) {

                //      console.log("in x");
                      let position = 7;
                      if(d.key==1)
                          {position = 7;}
                          else
                         { position = d.key - 1;}
                 //        console.log(position);
                      return position*50 + 5;
                      }
                  
                  ).attr('y', function(d){return 300-pickUpScale(d.value)})
                   .attr('height',function(d){return pickUpScale(d.value)}).attr("fill","#00b894");
          

                   const gBase = 75;
                   const gtOffset = 50;
            let gTexts =this.container.select('#svg1').select('#grect1').selectAll('text');

         //   console.log(dow_data);
            gTexts.data(dow_data).enter().append("text")
            .attr("text-anchor", "middle")
            .attr('x', function(d,i) {
                let position = 7;
                if(d.key==1)
                    {position = 7;}
                    else
                   { position = d.key - 1;}
            //       console.log(position);
                 return gBase + (position - 1)*gtOffset;
               }
            
            ).attr('y', function(d){return  300-pickUpScale(d.value) - 30 })
            .attr("dy", ".120em")
            .style("opacity", 0)
            .transition().delay(1000).duration(1500)
            .style("opacity", 1.0)
            .attr('x', function(d,i) {
                let position = 7;
                if(d.key==1)
                    {position = 7;}
                    else
                   { position = d.key - 1;}
            //       console.log(position);
                 return gBase + (position - 1)*gtOffset;
               }
            
            ).attr('y', function(d){return  300-pickUpScale(d.value) -5})
            .attr("dy", ".120em")
            .text(function(d) { return d.value; })
          //  .style("text-anchor", "middle");   	  

    }

    bars_hourly()
    {
        let svg_Pickup_byHours = this.container.select('#svg2').selectAll('rect');
        let svg_2 = this.container.select('#svg2');

      //  console.log("in bar hourly");
      //  console.log(this.data);

    

 
        // check total pickups per day of week - returns 7 days with total pickups per each day
            var nested_data = d3.nest()
            .key(function(d) { return d.Hour_of_Day; })
            .rollup(function(ids) {
                return ids.length; 
            })
            .entries(this.data);
    
        //    console.log(nested_data[1]);
            var dow_data= nested_data;
 
            dow_data.sort(function(x, y){
                return d3.ascending(parseInt(x.key), parseInt(y.key));
             })
            
        


             //get max of all pickup count values per dow_hourly
       let max = d3.max(dow_data, function(d,i) 
       {
          
               {return d.value}
       });

               //get max of all pickup count values per dow_hourly
       let min = d3.min(dow_data, function(d,i) 
       {
                {return d.value}
       });

    
//console.log(min);
//console.log(max);


            //clear bars
           
            var clear =[];
            svg_Pickup_byHours.data(clear).exit().remove();
     
            //X-SCALE -SVG2 - HOURLY
        
        
         // remove old axis
         d3.select("#xAxis2").remove();

         d3.select("#yAxis2").remove();

          // Create scale

          var hours = [{hour:"0"},{hour:"1"},{hour:"2"},{hour:"3"},{hour:"4"},{hour:"5"},
          {hour:"6"},{hour:"7"},{hour:"8"},{hour:"9"},{hour:"10"},{hour:"11"},{hour:"12"},
          {hour:"13"},{hour:"14"},{hour:"15"},{hour:"16"},{hour:"17"},{hour:"18"},{hour:"19"},
          {hour:"20"},{hour:"21"},{hour:"22"},{hour:"23"} 


           ];

        //  var xScale = d3.scaleLinear()
         // .domain([0,23])
         // .range([0, this.width*0.90])
         var xScale = d3.scaleBand()
         .domain(hours.map(function(d){ return d.hour}))
         .range([0, this.width*0.85])

         var fakeXScale = d3.scaleLinear()
         .domain([0, 23])
         .range([6, this.width*0.8225]);

          // Add scales to axis
          var x_axis = d3.axisBottom()
          .scale(fakeXScale).ticks(24);
          //Append group and insert axis
          svg_2.append("g").attr("id","xAxis2")
          .attr("transform", "translate(50," + 300 + ")")
          .call(x_axis);
  
         //Y-SCALE-SVG2 - HOURLY
          var yScale = d3.scaleLinear()
          .domain([0, max])
          .range([this.height-100,50]);
          // Add scales to axis
          var y_axis = d3.axisLeft()
          .scale(yScale);
          //Append group and insert axis
          svg_2.append("g").attr("id","yAxis2")
          .attr("transform", "translate(50," + 0 + ")")
          .call(y_axis);

 // lables for svg-2

 svg_2.selectAll(".xaxis text")  // select all the text elements for the xaxis
 .attr("transform", function(d) {
    return "translate(" + this.getBBox().this.height*-2 + "," + this.getBBox().height + ")rotate(-45)";
});

d3.selectAll("#text2").remove();
// now add titles to the axes
svg_2.append("text").attr("id","text2")
   .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
   .attr("transform", "translate("+ (50/4) +","+(this.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
   .text("Pickups");

svg_2.append("text").attr("id","text2")
   .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
   .attr("transform", "translate("+ (this.width/2) +","+(this.height-(60))+")")  // centre below axis
   .text("Hours of Day");
            
            //add bars
             var pickUpScale = d3.scaleLinear()
            .domain([0, max])
            .range([0, 250]);
    
             // remove old data
         d3.selectAll("#grect2").remove();

            let g =this.container.select('#svg2').append('g').attr("transform","translate(42,0)").attr("id","grect2");

            let gBars =this.container.select('#svg2').select('#grect2').selectAll('rect');

           // console.log(dow_data[0]);
           // console.log(dow_data[1]);
            
            gBars.data(dow_data).enter().append("rect")
            .attr('x', function(d,i) {
             //   console.log(d.key)
                 return d.key*14 + 11;
               }
            
            ).attr('y', function(d){return  300})
            .attr('width',200/24).attr('height', 0).attr("fill","#00b894")
            .transition()
            .duration(2000)
            .attr('y', function(d){return  300-pickUpScale(d.value)})
            .attr('width',200/24).attr('height',function(d){return pickUpScale(d.value)}).attr("fill","#00b894")


            let gTexts =this.container.select('#svg2').select('#grect2').selectAll('text');

          //  console.log(dow_data);

            let highIndex =  d3.maxIndex(dow_data, function(d,i) 
            {
                     {return d.value}
            });

            let highPoint=dow_data.splice(highIndex,1);
           //  console.log(highPoint);
 
           let hgBase = 10;
           let hgOffset = 14.375; 

            gTexts.data(highPoint).enter().append("text")
            .attr("text-anchor", "middle")
            .attr('x', function(d,i) {
                  return d.key*hgOffset + hgBase;
               }
            
            ).attr('y', function(d){return  300-pickUpScale(d.value) -40})
            .attr("dy", ".75em")
            .style("opacity", 0.0)
            .transition().delay(1000).duration(1500)
            .style("opacity", 1.0)
            .attr('x', function(d,i) {
                return d.key*hgOffset + hgBase;
             }
          
          ).attr('y', function(d){return  300-pickUpScale(d.value) -15})
          .attr("dy", ".75em")
             .text(function(d) { return d.value; });   	  

     
    }

//Dow and Hours - SVG3
dow_hourly()
{
    let svg_Dow_Hours = d3.selectAll('body').select('#svg3').select("#gline3").selectAll('path');
 
    let svg_3 = d3.selectAll('body').select('#svg3');

    
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
                            return (d3.max(d.values,d=>d.value));

                        });

                         //get max of all pickup count values per dow_hourly
         let min = d3.min(dow_data, function(d,i) 
         {
             return (d3.min(d.values,d=>d.value));
 
         });
                    
        //clear bars
       
        var clear =[];
        svg_Dow_Hours.data(clear).exit().remove();
 
        let width = 400;
        let height = 400;
        
        //add bars
         
         // remove old axis
         d3.selectAll("#xAxis3").remove();

         d3.selectAll("#yAxis3").remove();

           // Create scale
           var xScale = d3.scaleLinear()
           .domain([0,23])
           .range([0, width*0.8225])
           // Add scales to axis
           var x_axis = d3.axisBottom()
           .scale(xScale).ticks(23);
           //Append group and insert axis
           svg_3.append("g").attr("id","xAxis3")
           .attr("transform", "translate(50," + 300 + ")")
           .call(x_axis);
   
          //Y-SCALE-SVG3 - DOW-HOURLY
           var yScale = d3.scaleLinear()
           .domain([0, max])
           .range([height-100,50]);
           // Add scales to axis
           var y_axis = d3.axisLeft()
           .scale(yScale);
           //Append group and insert axis
           svg_3.append("g").attr("id","yAxis3")
           .attr("transform", "translate(50," + 0 + ")")
           .call(y_axis);


            // lables for svg-3

          svg_3.selectAll(".xaxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().this.height*-2 + "," + this.getBBox().height + ")rotate(-45)";
         });
    
         d3.selectAll("#text3").remove();


        // now add titles to the axes
        svg_3.append("text").attr("id","text3")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (50/4) +","+(this.height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Pickups");
  
        svg_3.append("text").attr("id","text3")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (this.width/2) +","+(this.height-(60))+")")  // centre below axis
            .text("Hours of Day");


           //console.log(min + " " + max)
        var pickUpScale = d3.scaleLinear()
        .domain([min, max])
        .range([0,250]);

        //.range([min, max]);

        
        let g = this.container.select('#svg3').append('g').attr("transform","translate(0,0)").attr("id","gline3");

        let gBars =this.container.select('#svg3').selectAll("g").select('#gline3');

        let lineGenerator = d3
        .line()
        .x((d, i) =>  d.key*14 + 50)
        .y(function(d) { return 300-pickUpScale(d.value)});

        let color =["#7bc0e4","#c96367","#cb85ab","#5d5d5d","#c0b987","#f5c987","#d94b4d"];

    for(var i=0;i<dow_data.length;i++)
        {
            var data = dow_data[i].values;
             data.sort(function(x, y){
                return d3.ascending(parseInt(x.key), parseInt(y.key));
             })

//console.log(data)

let Xpath= d3.selectAll("#svg3").select("#gline3").append('path').attr("opacity",1)
.attr("transform","translate(0,0)")
//.attr("stroke", "#086fad")
.attr("stroke-width", "1.5")
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

filtByHourTimeArr(filteredArray) {
    this.data = [];
//console.log("in hourtime")
    this.hourFilteredArray = filteredArray;

    for (let item of this.originalData) {
        let day = item.date.getDay();
        if (day == 0) {
            day = 6;
        }
        else {
            day -= 1;
        }
        let hour = item.date.getHours();
 
        if (this.weekFilteredArray.indexOf(day) != -1) {
            if (this.hourFilteredArray.indexOf(hour) != -1) {
                this.data.push(item);
            }
        }
    }

    //console.log(this.hourFilteredArray);
    let data =[1];

    let fromHour = this.hourFilteredArray[0];

    let toHour = this.hourFilteredArray[this.hourFilteredArray.length-1];

    //if hours are between two days - eg:11pm to 6 am
    for(var i=0; i<this.hourFilteredArray.length-1;i++)

        {
            // difference between hours is not 1..
            if(Math.floor(this.hourFilteredArray[i+1]) - Math.floor(this.hourFilteredArray[i])!= 1)
                {
                    fromHour = this.hourFilteredArray[i+1];
                    toHour = this.hourFilteredArray[i];
 
                     break;
                }
         }

    

    

    d3.selectAll("#hour-id").remove();

    let svg_1 = d3.selectAll('body').select('#svg1').append('g').attr("id","hour-id");
    //console.log(svg_1);
    svg_1.append("text")
    .attr("x", 100)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("Hours: " + fromHour + ":00" +  " to " + toHour + ":00");
    
    

    this.bars_dow();
    this.bars_hourly();

    this.dow_hourly();
}

filtByWeekDayArr(filteredArray) {
    this.data = [];
    //console.log("in weekday")

    this.weekFilteredArray = filteredArray;

    for (let item of this.originalData) {
        let day = item.date.getDay();
        if (day == 0) {
            day = 6;
        }
        else {
            day -= 1;
        }
        let hour = item.date.getHours();

        if (this.weekFilteredArray.indexOf(day) != -1) {
            if (this.hourFilteredArray.indexOf(hour) != -1) {
                this.data.push(item);
            }
        }
    }

    var dow = [{day:"Monday"},
        {day:"Tuesday"},
        {day:"Wednesday"},
        {day:"Thursday"},
        {day:"Friday"},
        {day:"Saturday"},
        {day:"Sunday"}
         ];

        // console.log(this.weekFilteredArray);
        // d3.selectAll("#dow-id").remove();
        // while(d3.selectAll("#dow-id") != null)
        {
            d3.selectAll("#svg2").html("");
        }

        let fromDay = 0;
        let toDay = 6;

        if(this.weekFilteredArray.length == 0)
         {
            // console.log("zero");
              fromDay = 0;
               toDay = 6;
         }
        else
        { 
             fromDay = this.weekFilteredArray[0];
             toDay = this.weekFilteredArray[this.weekFilteredArray.length-1];
        }
//if hours are between two days - eg:11pm to 6 am
    for(var i=0; i<this.weekFilteredArray.length-1;i++)

        {
            // difference between hours is not 1..
            if(Math.floor(this.weekFilteredArray[i+1]) - Math.floor(this.weekFilteredArray[i])!= 1)
                {
                    fromDay = this.weekFilteredArray[i+1];
                    toDay = this.weekFilteredArray[i];
 
                     break;
                }
         }

       
         d3.selectAll("#dow-id").remove();
         d3.select("#svg2").html("");   

        let hourID = d3.selectAll('body').select('#svg2').append('g').attr("id","dow-id");
         hourID.append("text")
        .attr("x", 100)
        .attr("y", 10)
        .attr("dy", ".45em")
        .text(function(){
            if(fromDay!=toDay)
            return "Days: " + dow[fromDay].day +  " to " + dow[toDay].day;
            else
            return "Days: " + dow[fromDay].day +  " Only"; 
            });
       
   /*         d3.selectAll("#dow-hour-id").remove();
            
            var dow = [{day:"Mon"},
            {day:"Tue"},
            {day:"Wed"},
            {day:"Thu"},
            {day:"Fri"},
            {day:"Sat"},
            {day:"Sun"}
             ];

            let color =["green","red","brown","orange","black","blue","pink"];
             let dow_hour_ID = d3.selectAll('body').selectAll('div').select('#svg3').append('g').attr("id","dow-hour-id").selectAll("rect");
            dow_hour_ID.data(dow).enter().append("rect")
            .attr("x", (d,i) => 60 + i*45)
            .attr("y", 10)
            .attr("width", "10")
            .attr("height", "10")
            .attr("fill", (d,i)=>color[i]);
            

            dow_hour_ID = d3.selectAll('body').selectAll('div').select('#svg3').select("#dow-hour-id").selectAll("text");

            dow_hour_ID.data(dow).enter().append("text")
    
             .attr("x", (d,i)=> 70 + i * 45)
            .attr("y", 10)
            .attr("dy", ".35em")
            .text((d,i)=> dow[i])
            .style('fill', (d,i)=>color[i])*/


             
       
                
            this.bars_dow();

       this.bars_hourly();
       this.dow_hourly();

}

/*
    filtByHourTime(from, to) {
        this.data = [];
        console.log("in line slider hour")

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

        let data =[1];
        let fromHour = Math.floor(from);
 
        let toHour = Math.floor(to);
        d3.select("#hour-id").remove();

        let svg_1 = this.container.select('#svg1').append('g').attr("id","hour-id");
        console.log(svg_1);
        svg_1.append("text")
        .attr("x", 100)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Hours1: " + fromHour + ":00" +  " to " + toHour + ":00");

        this.bars_dow();
     //   this.bars_hourly();
    } */

  /*  filtByWeekDay(from, to) {
        this.data = [];
        console.log("in line slider week")
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


        var dow = [{day:"Monday"},
        {day:"Tuesday"},
        {day:"Wednesday"},
        {day:"Thursday"},
        {day:"Friday"},
        {day:"Saturday"},
        {day:"Sunday"}
         ];

         console.log(dow[0].day);
        d3.select("#dow-id").remove();

        let fromDay = Math.floor(from);
        let toDay = Math.floor(to);

        let hourID = this.container.select('#svg2').append('g').attr("id","dow-id");
         hourID.append("text")
        .attr("x", 100)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(function(){
            if(fromDay!=toDay)
            return "Days: " + dow[fromDay].day +  " to " + dow[toDay].day;
            else
            return "Days: " + dow[fromDay].day +  " Only"; 
            });
       

       this.bars_hourly();
    }*/

}


