
/**
 * Method for generating responses.
 * @return {winston.Logger}
 */
module.exports = function (data, message, status) {
	return {
		Data : data,
		Message : message,
		Status : status
	};
};