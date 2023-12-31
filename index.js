'use strict';
var i2c = require('i2c');

/**
 * DAC6573
 */
 
const REG_CONFIG_OP_NORMAL=0x00;

var REF_VOLTAGE = 3.30;                        //reference voltage
var RES = 8;                                   //resolution
var RES_STEPS = Math.pow(2,RES);               //
var DACVALUE_FACT = (RES_STEPS-1)/REF_VOLTAGE;

class dac5771{
    /**
    * Constructor
    *
    * @param  {string} device
    * @param  {number} address
    */

    constructor(device, address) 
    {
        this.device = device;
        this.address = address;
        this.wire = new i2c(this.address,{device: this.device});
    }

    /**
    * Shift data to the right byte-format and send it to the dac5771
    *
    * @param  {number} value
    */

    setDACRaw(value, callback)
    {
        var self = this;
        var byte0 = (value << 4) & 0xF0;                           //Most
        var byte1 = ((value & 0xF0)>>4) | REG_CONFIG_OP_NORMAL;    //Least
        //self.wire.writeBytes(this.address, [byte1, byte0], function(err)
        self.wire.writeByte(byte1, function(err)
        {
            if(err)
            {
                callback(err);
            }
        });
        self.wire.writeByte(byte0, function(err)
        {
            if(err)
            {
                callback(err);
            }
        });
    }

    /**
    * Calculate the right dac-value in relation of the passed voltage 
    *
    * @param  {number} value
    */
    setDACVoltage (voltage, callback)
    {
        var self = this;
        var dacValue = DACVALUE_FACT * voltage;
        self.setDACRaw(this.address, dacValue, function(err)
        {
            if(err)
            {
                callback(err);
            }
        });
    }
}

module.exports = dac5771;
