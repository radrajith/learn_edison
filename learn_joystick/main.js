//Type Node.js Here :)
//https://github.com/intel-iot-devkit/upm/blob/master/examples/javascript/joystick12.js
//google script api - https://docs.google.com/document/d/1fUzgm-Llf7RZCG-rZVk1qYzWFHID1cex8EMltkZ1TqA/edit
var upm = require('jsupm_joystick12');
var myJoystick = new  upm.Joystick12(0,1);
//google script rest api code ---
// Configure the request
var request  = require('request');
var headers = {
    'User-Agent' : 'Intel Edison',
    'Content-Type' : 'application/x-www-form-urlencoded'
};

var options = {
    url: 'https://script.google.com/macros/s/AKfycbw0D1_CnPBnQ4NeXQtHH4u6-jFbpbUfGkoE87HnwFvO8ATHg2o/exec',
    method: 'POST',
    headers: headers,
    form: {'m': 'xxx', 'n': 'xxx'}
};
//------------    


//declaring constant to contain the center point values of the joystick
var XConst = 73;
var YConst = 68;		//these values were different in arduino(weird!!!)
console.log("If you want to caliberate these are the Values of X and Y:"+conv_WholeNum(myJoystick.getXInput())+"  "+conv_WholeNum(myJoystick.getYInput()));


setInterval(function()
{
	//var XString = "Driving X:" + roundNum(myJoystick.getXInput(), 6);
	//var YString = ": and Y:" + roundNum(myJoystick.getYInput(), 6);
    //console.log(myJoystick.getXInput());
    //console.log(myJoystick.getYInput());
    var X = conv_WholeNum(myJoystick.getXInput());
    var Y = conv_WholeNum(myJoystick.getYInput());//(1023-YString)*10/YString;
    X = X - XConst;
    Y = Y -YConst;						//making the point relative to origin (0,0) instead of (73,73)
    var length = distance(X,Y);
    var angle = angles(X, Y);
	console.log(length +" "+ angle+ " Deg");
    //rest api code------
	options.form.m = Math.round(length * 100) / 100;
	options.form.n = Math.round(angle * 100) / 100;
	
    // POST request
    request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //
    } else {
        console.log("some error");		 
    }
    });
    //---------------
}, 1000);




function distance(X,Y){
	return Math.sqrt(Math.pow(X,2)  +  Math.pow(Y,2));		//basic distance formula
}
function angles(X,Y){
	var angle = Y>0?90:-90; //ternary operator to avoid divide by 0 error
	if(X!==0){				//to avoid divide by 0 error
		angle = Math.atan((Y/X)) *(180/Math.PI);
	}
   // console.log(angle);
	switch(true){
		case (X>=0 && Y>=0):
            if(X===0&&Y===0){
                angle =0;
            }
            else {
                angle = angle + 0;		//the point lies in first quadrant
            }
            break;   
		case (X<0  &&  Y>=0):   //the point lies in second quadrant
            angle = angle + 180;
            break;
		case(X<0  &&  Y<0):       //third quadrant
            angle = angle +180;
            break;
		case(X>=0  &&  Y<0):      //fourth quadrant
            angle = angle + 360;
            break;
		default:                  //spurious data, defaults t0 0
            angle = 0;
            break;
	}
  return angle;
}


function conv_WholeNum(num){
	return parseInt(num*100*-1);        //converting the negative float value to readable positive decimal.
}


