const { errorMonitor } = require("nodemailer/lib/mailer");


module.exports = {   
    
    makeDateObj: function(str, decrement){
        if(str != ""){
            let newDateObj = new Date(str.substring(0,4), str.substring(5,7) -1, str.substring(8,10));

            if (decrement == undefined){
                return newDateObj;
            }else{
                let dt = new Date();
                return dt.setDate( newDateObj - decrement);
            }
            
        }
        return null;
    },

    validateDate: function(dateStr1, dateStr2){
        let d1 = this.makeDateObj(dateStr1);
        let d2 = this.makeDateObj(dateStr2);
        console.log("d1 " + d1 + "d2" + d2); 
        if(d1 != null && d2 != null){
            return d1 >= d2 || d1 < Date.now();
        }
        return false;
    },

    validateHomeSearchUserInput: function(inputObj){

        let error = { location:[], checkIn:[], checkOut:[], guest:[] };

        if(typeof inputObj.location == "undefined" ) { error.location.push("Please select a location"); }
        if(inputObj.checkIn == '' || typeof inputObj.checkIn == "undefined" ) {error.checkIn.push("Please select check in date");}
        if(inputObj.checkOut == '' || typeof inputObj.checkOut == "undefined" ){error.checkOut.push("Please select check out date");}
        if(typeof inputObj.guest == "undefined"){error.guest.push("Please select the number of guest");}
    
        if(error.checkIn.length == 0  || error.checkOut.length == 0 ){
            if (this.validateDate(inputObj.checkIn, inputObj.checkOut)){error.checkIn.push("Check in date must be earlier than check out date");}
        }
    
        if(typeof inputObj.location == "undefined"){ inputObj.location = "Location"}
        if(typeof inputObj.guest == "undefined"){ inputObj.guest = "Guests"}
    
        if (error.location.length == 0 && error.checkIn.length == 0  && error.checkOut.length == 0  && error.guest.length == 0  ){

           return null;
        }
        console.log("print before returning error " + error);
        return error;
    }
    
}