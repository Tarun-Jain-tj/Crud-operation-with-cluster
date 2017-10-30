var util = require('util');
var lodash = require('lodash');

/**
 * Utility to perform multiple chained checks on data.
 * Each chain can be evaluated, or asserted for checks passing and failure.
 * Multiple rules can be defined at once and corresponding error messages can be collected.
 * This implementation contains some basic checks. It can be extended to add more (@see Check.resolve()).
 *
 * Example:
 *
 * var Check = require('check');
 *
 * // single checks
 * Check.that('abc').isStringType().isLengthInRange(1,3).is.ok();
 * Check.that('abc').isStringType().isLengthInRange(1,3).assert.ok();
 *
 * // combined rules
 * var data = {name:123,email:"a@b.com"}; //some object
 * var rules = {
 *             {name:Check.that(data.name).isStringType().isNotEmptyOrBlank()},
 *             {email:Check.that(data.email).isOptional().isEmail()}
 *            }
 * var errorsMessages = Check.collectErrors(rules); // [ {field:'name',errors:['required','stringType']} ]
 *
 * @param val value to check.
 * @constructor
 */
function Check(val) {
    this.val = val;
    this.errors = [];
    this.recordErrors = true;
}

// inherits from object
util.inherits(Check,Object);

/**
 * Check class.
 * @type {Check}
 */
module.exports = Check;

//------------------------- static --------------------------------

/**
 * Creates a new Check instance for given value.
 * @param val value to check.
 * @returns {Check}
 */
Check.that = function (val) {
    return new Check(val);
};

/**
 * Collect all check error messages for the given rules object.
 * @param {Object} rules - rules object to validate.
 * @returns {Array} An Array orf error messages.
 */
Check.collectErrorMessages = function (rules) {

    if(!lodash.isPlainObject(rules)){
        throw new Error("rules must be a Plain Object");
    }

    var allErrors = [];

    // iterate rules object properties
    lodash.forOwn(rules,function (value, key, obj) {

    // collect errors from each check instance in rules
    if (value instanceof Check && value.errors.length > 0) {
        allErrors.push({field: key, errors: value.errors});
    }

    },this);

    return allErrors;
};

//------------------------- class ----------------------------------

/**
 * Every checker function should call this in the end and return the result.
 * @param {Boolean} valid true/false whether check is pass or failed.
 * @param {String} message - failure message.
 * @returns {Check}
 */
Check.prototype.resolve = function (valid, message) {
    
    if(!lodash.isBoolean(valid)){
        throw new Error("valid must be a Boolean.");
    }

    if(!lodash.isString(message)){
        throw new Error("message must be a String.");
    }

    if(!valid && this.recordErrors){
        this.errors.push(message);
    }
    return this;
};

//------------------------- utility ---------------------------------

/**
 * Function chain to quickly evaluate that a Check instance has not recorded errors.
 * @return {{ok: Function}}
 */
Check.prototype.is = function(){
      var self = this;
      return {
          ok: function () {
              return self.errors.length < 1;
          }
      }
    };

/**
 * Function chain to quickly assert that a Check instance has not recorded errors.
 * Assertion failure throws an Error with all recorded error messages.
 * @return {{ok: Function}}
 */
Check.prototype.assert = function(){
    var self = this;
    return {
        ok:function(){
            if(self.errors.length < 1){
                return true;
            }else{
                throw new Error(self.errors.join("; and "));
            }
        }
    };
};

//-------------------------- validations -----------------------------
/**
 * Marks the value being checked as optional. No Errors will collected for other checks on chain.
 * Hence, checks errors will not be acknowledged if the value is null or undefined.
 * @returns {Check}
 */
Check.prototype.isOptional = function () {
    if((this.val === null || this.val === undefined)){
        this.recordErrors = false;
        this.errors = [];
    }
    return this;
};

/**
 * Matches the value against provided regexp and adds message to errors if failed.
 * @param {RegExp} regex regexp to match against.
 * @param {String} message failure message.
 * @returns {Check}
 */
Check.prototype.isMatch = function (regex, message) {
    if(!lodash.isRegExp(regex)){
        throw new Error("regex must be a RegExp.");
    }

    if(!lodash.isString(message)){
        throw new Error("message must be a String.");
    }

    var valid = regex.test(this.val);
    return this.resolve(valid, message);
};

/**
 * Check if value is String ("abc") type.
 * @returns {Check}
 */
Check.prototype.isStringType = function () {
    var valid = lodash.isString(this.val);
    return this.resolve(valid, 'Should be of String type');
};

/**
 * Check if value is Number (123 or 123.45) type.
 * @returns {Check}
 */
Check.prototype.isNumberType = function () {
    var valid = lodash.isNumber(this.val);
    return this.resolve(valid, 'Should be of Number type');
};

/**
 * Check if value is Boolean (true or false) type.
 * @returns {Check}
 */
Check.prototype.isBooleanType = function () {
    var valid = lodash.isBoolean(this.val);
    return this.resolve(valid, 'Should be of Boolean type');
};

/**
 * Check if value is Integer (123 and not 123.45).
 * @returns {Check}
 */
Check.prototype.isInteger = function () {
    var valid = !isNaN(this.val) && this.val % 1 === 0;
    return this.resolve(valid, 'Should be an Integer');
};

/**
 * Check if value is present in the given Array of values.
 * @param {Array} values values to look for.
 * @returns {Check}
 */
Check.prototype.isEnum = function (values) {
    if(!lodash.isArray(values)){
        throw new Error("values must be an Array.");
    }

    var valid = lodash.contains(values,this.val);
    return this.resolve(valid, 'Should be one of [' + values.join(',') + ']');
};

/**
 * Check if value is something that can be parsed into a Date.
 * @returns {Check}
 */
Check.prototype.isDate = function () {
    var valid = lodash.isDate(new Date(this.val));
    return this.resolve(valid, 'Should be a valid date.');
};

/**
 * Check if value is a string and: it is not an empty string or a string with all space characters.
 * @returns {Check}
 */
Check.prototype.isNotEmptyOrBlank = function () {
    var valid = lodash.isString(this.val) && this.val.length > 0 && !/^\s+$/.test(this.val);
    return this.resolve(valid, 'Should not be empty or blank.');
};

/**
 * Check if value is something that can be parsed into a BSON ObjectId type.
 * @returns {Check}
 */
Check.prototype.isBsonObjectId = function () {
    var valid = lodash.isString(this.val) &&
        (this.val.length === 12 || this.val.length === 24) &&
        (/^[0-9a-fA-F]+$/).test(this.val);

    return this.resolve(valid, 'Should be a BSON ObjectId.');
};

/**
 * Check if value is an Array.
 * @returns {Check}
 */
Check.prototype.isArrayType = function () {
    var valid = lodash.isArray(this.val);
    return this.resolve(valid, 'Should be an Array type.');
};

/**
 * Check if string representation of value is within the given min max range (inclusive).
 * @param {Number} min minimum length.
 * @param {Number} [max] maximum length. This is optional.
 * @returns {Check}
 */
Check.prototype.isLengthInRange = function (min, max) {
    if(!lodash.isFinite(min)){
        throw new Error("min should be a finite Number.");
    }

    var noMax = false;

    if(lodash.isUndefined(max)){
        noMax = true;
    }else if(!lodash.isFinite(max)){
        throw new Error("max should be a finite Number.");
    }

    min = Math.max(0, min);
    max = Math.max(1, max);

    var valid = lodash.isString(this.val);

    if(noMax){
        valid = valid && (this.val.length >= min);
    }else{
        valid = valid && (this.val.length >= min && this.val.length <= max);
    }

    return this.resolve(valid, 'String Length should be in range [' + min + ',' + (noMax ? '\u221E' : max) + '].');
};

/**
 * Check if value is a number within the given min max range (inclusive).
 * @param {Number} min minimum length.
 * @param {Number} [max] maximum length. This is optional.
 * @returns {Check}
 */
Check.prototype.isNumberInRange = function(min, max){
    if(!lodash.isFinite(min)){
        throw new Error("min should be a finite Number.");
    }

    var noMax = false;

    if(lodash.isUndefined(max)){
        noMax = true;
    }else if(!lodash.isFinite(max)){
        throw new Error("max should be a finite Number.");
    }

    var valid = lodash.isNumber(this.val);

    if(noMax){
        valid = valid && (this.val >= min);
    }else{
        valid = valid && (this.val >= min && this.val <= max);
    }

    return this.resolve(valid, 'Number value should be a number in range [' + min + ',' + (noMax ? '\u221E' : max) + '].');
};

/**
 * Checks if value is a valid email address.
 * @returns {Check}
 */
Check.prototype.isEmail = function () {
    var emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var valid = lodash.isString(this.val) && emailRegexp.test(this.val);
    return this.resolve(valid, 'Should be a valid email address.');
};

/**
 * Checks if value is a valid mobile number: +<ISD><Number>
 * @return {Check}
 */
Check.prototype.isMobileNumber =function(){
    var mobileRegex = /^(\+?\d{1,3})?(\d){10}$/;
    var valid = lodash.isString(this.val) && mobileRegex.test(this.val);
    return this.resolve(valid, 'Should be a valid mobile number.');
};
