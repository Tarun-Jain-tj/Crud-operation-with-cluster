var constants = {

  statusCodes: {
    SUCCESS: 200,
    SERVERERROR: 500,
    MULTI_STATUS: 207,
    FORBIDDEN_ERROR: 407
  },
  messages: {
    SUCCESS: "Success",
    SUCCESSREGESTRATION: "User registered successfully.",
    ALREADYEXIST: "Email already exists.",
    EMAILFAIL: "User register successfully unable to send Email.",
    EMAILNOTFOUND: "Email not found.",
    EMAILMSG:"If the username entered is correct, you will receive further instructions via email.",
    EMAILNOTEXIST:"The username or password is incorrect.",
    PASSWORDNOTFOUND: "Password not found.",
    NOTVERIFIED: "User is not active kindly contact administrator.",
    LOGINSUCCESS: "Login successfully.",
    LOGINFAILED: "Username and password are not correct.",
    LOGOUT: "User logout successfully.",
    EMAILSENT: "Email sent successfully.",
    USERIDNOTFOUND: "Unable to find User.",
    RECORDNOTFOUD: "Record not found.",
    MANAGERNOTFOUND: "No such manager exists.",
    DELETED: "Record deleted successfully.",
    UPDATE: "Record updated successfully.",
    USERDELETED: "User does not exists.",
    CLIENTNOTFOUND: "Client not found.",
    CHANGEDSTATUS: "Status changed successfully.",
    NOTHINGTOUPLOAD: "Filename is incorrect.",
    CATEGORYNOTFOUND: "Cannot find category.",
    UPLOADED: "Image uploaded.",
    REQUESTSENT: "Request sent successfully.",
    NOTAVAILABLE: "No update available.",
    AVAILABLE: "Update available.",
    OLDPASSWORD: "Old password not correct.",
    URLMISSING: "Calendar url not found.",
    NOAPPOINTMENT: "No appointment found.",
    LINKEXPIRE:"Link expired."
  },
  emailData: {

    REGISTRATION_SUBJECT: "Account Registration Successful.",
    FORGOTPASSWORD: "Forgot Password!!",
    RESETPASSWORD: "New Password.",
    PASSWORDEXPIRYNOTICE:"Password Expiration Notice: -days- Day(s) to Password Expiration"

  },

  AccountFields:{
            "Name": "name",
            "Id": "sfId",
            "CreatedDate": "createdDate",
            "CurrencyIsoCode": "currencyIsoCode",
            "LastModifiedDate": "lastModifiedDate",
            "Account_SF_ID__c": "accountSfId",
            "Account_Status__c": "accountStatus",
            "Annual_Load_Limit__c": "annualLoadLimit",
            "GBP_Equiv_Card_Bal__c": "gbpEquivCardBal",
            "Payments_only_no_FX__c": "paymentsOnlyNoFx",
            "Type": "type",
            "Load_Fee__c": "loadFee",
            "Number_of_Deals__c": "numberOfDeals",
            "Turnover__c": "turnover",
            "Initial_Contract_Start_Date__c":"initialContractStartDate",
            "Salesman_1__c":"salesman1Id",
            "Salesman_2__c":"Salesman2Id"
            
  },
  DealFields:{
            "Account__c": "accountSfId",
            "Id": "sfId",
            "CreatedDate": "createdDate",
            "CurrencyIsoCode": "currencyIsoCode",
            "LastModifiedDate": "lastModifiedDate",
            "Actioned_From__c": "actionedFrom",
            "Buy_Currency_Rate_to_GBP__c": "buyCurrencyRateToGbp",
            "Buy_Currency__c": "buyCurrency",
            "Deal_Scenario__c": "dealScenario",
            "Deal_Status__c": "dealStatus",
            "Exclude_value_from_Reporting__c": "excludeValueFromReporting",
            "Forward_Deal__c": "forwardDeal",
            "GBP_EQUIV_TOTAL_P_L__c": "gbpEquivTotalPl",
            "PFS_Ref__c": "pfsRef"
  },
  CashMovementFields:{
            "Account__c": "accountSfId",
            "Id": "sfId",
            "CreatedDate": "createdDate",
            "CurrencyIsoCode": "currencyIsoCode",
            "LastModifiedDate": "lastModifiedDate",
            "Account_CHID__c": "accountChild",
            "Bank_Account_Name__c": "bankAccountName",
            "Amount__c": "amount",
            "Cash_Load_Fee__c": "cashLoadFee",
            "Load_Fee__c": "loadFee",
            "Payment_Type__c": "paymentType"
  },
  SalesmanFields:{
            "sfId":" Id",
            "createdDate": "CreatedDate",
            "currencyIsoCode": "CurrencyIsoCode",
            "lastModifiedDate": "LastModifiedDate",
            "name": "Name",
            "Sales_Team__c": "Sales_Team__c",
            "Salesman_Email__c": "Salesman_Email__c"
  }
}
module.exports = constants;