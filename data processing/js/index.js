var csv = require('csv');
var fs = require('fs');
var request = require('sync-request');

let content = fs.readFileSync("data1574229931503.csv", 'utf8');
let appid = 'JtaRaYIlQK2aIpuRaTh1';
let appcode = 'VdP0GN_XqYQRlTNpULbdhQ';

// csv.parse(content, function(err, data)
// {
//     data[0].push('District');
//     for(let i = 1; i < data.length; i++)
//     {
//         let item = data[i];
//         let lat = item[1];
//         let lon = item[2];
        
//         var res = request('GET', 
//         `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${lat}%2C${lon}&mode=retrieveAreas&maxresults=1&gen=9&app_id=${appid}&app_code=${appcode}`);
//         var geoInfo = JSON.parse(res.getBody().toString('utf8'));
//         var district = geoInfo.Response.View[0].Result[0].Location.Address.District;
//         console.log("Current is " + i + " " + district);
//         item.push(district);
//     }

//     csv.stringify(data, function(err, newContent){
        
//         fs.writeFile("data"+Date.now().toString()+".csv", newContent, 'utf8', ()=>{

//         });    
//     });
// });

csv.parse(content, function(err, data)
{
    for(let i = 1; i < data.length; i++)
    {
        let item = data[i];
        let lat = item[1];
        let lon = item[2];
        
        let dis = item[9];

        console.log(dis);
    }
});