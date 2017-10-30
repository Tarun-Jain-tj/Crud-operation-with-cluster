/**
 * API errors definition
 * @type {Object}
 */
module.exports = {

  api_key_required:{
    error_code:"API_KEY_REQUIRED",
    description:"Api key is required."
  },

  invalid_api_key:{
    error_code:"INVALID_API_KEY",
    description:"Api key is invalid."
  },

   token_expired:{
    error_code:"TOKEN_EXPIRED",
    description:"Token Expired."
  },


  auth_token_required:{
    error_code:"AUTH_TOKEN_REQUIRED",
    description:"Auth token is required."
  },

  invalid_auth_token:{
    error_code:"INVALID_AUTH_TOKEN",
    description:"Auth token is invalid."
  },

  invalid_auth_credentials:{
    error_code:"INVALID_AUTH_CRED",
    description:"Authorization credentials are invalid. Cannot authorize."
  },

  already_registered:{
    error_code:"ALREADY_REGISTERED",
    description:"User is already registered. Cannot register again"
  },

  invalid_operation:{
    error_code:"INVALID_OPERATION",
    description:"The requested operation is not allowed due to logical or business rules. Cannot proceed."
    // example: user cannot send a connect request to himself.
  },

  no_resource_access:{
    error_code:"NO_RESOURCE_ACCESS",
    description:"User does not have required level of access to the requested resource."
    // example: user is not the author of the post he wants to edit.
    // example: User is not connected to user whose email he wants to view.
    // example: free user cannot access a paid resource.
  },

  email_already_registered:{
    error_code:"EMAIL_ALREADY_REGISTERED",
    description:"The email has already been registered."
  },

  phone_already_registered:{
    error_code:"PHONE_ALREADY_REGISTERED",
    description:"The phone has already been registered."
  },

  email_not_verified:{
    error_code:"EMAIL_NOT_VERIFIED",
    description:"The email has not been verified."
  },

  phone_not_verified:{
    error_code:"PHONE_NOT_VERIFIED",
    description:"The phone has not been verified."
  },

  email_and_phone_not_verified:{
    error_code:"EMAIL_AND_PHONE_NOT_VERIFIED",
    description:"Neither email nor phone has been verified."
  }

};
