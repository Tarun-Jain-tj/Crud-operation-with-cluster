const SendOtp = require('sendotp');
const sendOtp = new SendOtp('', 'Otp for your order is {{otp}}, please do not share it with anybody');

var otpServices = {};

otpServices.SendOtp = function () {
    sendOtp.setOtpExpiry('90');
    sendOtp.send("9910576335", "PRIIND", "4635", function (error, data, response) {
        console.log(data);
    });
}


otpServices.verifyOtp = function () {
    sendOtp.verify("9910576335", "4630", function (error, data, response) {
        console.log(data); // data object with keys 'message' and 'type'
        if (data.type == 'success') {
            console.log('OTP verified successfully')
        }
        if (data.type == 'error') {
            console.log('OTP verification failed')
        }
    });
}
module.exports = otpServices;