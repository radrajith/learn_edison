/* this code was partly taken from https://github.com/intel-iot-devkit/upm/blob/master/examples/javascript/mma7660.js
and modified.
sensorUsed: 3 axis 1.5g digital accelerometer, and RGB lcd display
myAddition: added a lcd screen to display the accelertometer values
*/

var digitalAccelerometer = require('jsupm_mma7660');        //including the upm mma7660 library; required for accelerometer
var lcd = require('jsupm_i2clcd');                          //inclduing the upm i2clcd libarary; required for rgb lcd screen


// Instantiate an MMA7660 on I2C bus 0
var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
					1, 
					digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);      //ceating a object i think. saying the i2c is connected to port 1, and used                                                                           //the default adress

var myLcd = new lcd.Jhd1313m1(0, 0x3E,0x62);                            //setting up the lcd screen, connect to i2c 0.

// place device in standby mode so we can write registers
myDigitalAccelerometer.setModeStandby();

// enable 64 samples per second
myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);

// place device into active mode
myDigitalAccelerometer.setModeActive();

var x, y, z;
x = digitalAccelerometer.new_intp();
y = digitalAccelerometer.new_intp();
z = digitalAccelerometer.new_intp();

var ax, ay, az;
ax = digitalAccelerometer.new_floatp();
ay = digitalAccelerometer.new_floatp();
az = digitalAccelerometer.new_floatp();

var outputStr;

var myInterval = setInterval(function()
{
	myDigitalAccelerometer.getRawValues(x, y, z);
	outputStr = "Raw values: x = " + digitalAccelerometer.intp_value(x) +
	" y = " + digitalAccelerometer.intp_value(y) +
	" z = " + digitalAccelerometer.intp_value(z);
	console.log(outputStr);

	myDigitalAccelerometer.getAcceleration(ax, ay, az);
	outputStr = "Acceleration: x = " + roundNum(digitalAccelerometer.floatp_value(ax), 6) + "g y = " + roundNum(digitalAccelerometer.floatp_value(ay), 6) + "g z = " + roundNum(digitalAccelerometer.floatp_value(az), 6) + "g";
	console.log(outputStr);
    myLcd.setCursor(0,0);                                                                   //set starting point 
    myLcd.write("Acceleration: ");
    myLcd.setCursor(1,0);
    myLcd.write("x = " + roundNum(digitalAccelerometer.floatp_value(ax), 6)+ "g");          //sendig data to screen
}, 500);                                                                                    //will obtain and print data every .5 s

// round off output to match C example, which has 6 decimal places
function roundNum(num, decimalPlaces)
{
	var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));
	return (Math.round((num + extraNum) * (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));
}

// When exiting: clear interval and print message
process.on('SIGINT', function()
{
	clearInterval(myInterval);

	// clean up memory
	digitalAccelerometer.delete_intp(x);
	digitalAccelerometer.delete_intp(y);
	digitalAccelerometer.delete_intp(z);

	digitalAccelerometer.delete_floatp(ax);
	digitalAccelerometer.delete_floatp(ay);
	digitalAccelerometer.delete_floatp(az);

	myDigitalAccelerometer.setModeStandby();

	console.log("Exiting...");
	process.exit(0);
});
