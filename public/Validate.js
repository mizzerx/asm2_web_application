function validate() {
  if (document.login.usr.value == "") {
    alert("Please fill the account");
    document.login.usr.focus();
    return false;
  }

  if (document.login.pwd.value == "") {
    alert("Please fill the password");
    document.login.pwd.focus();
    return false;
  }

  return (true);
}

function addValidate() {
  if (document.add.name.value == "") {
    alert("Must fill the name");
    document.add.name.focus();
    return false;
  }

  if (document.add.price.value != "") {
    if (isNaN(document.add.price.value)) {
      alert("Must be input number only");
      document.add.price.focus();
      return false;
    }
  } else {
    alert("Must fill the price");
    document.add.price.focus();
    return false;
  }

  if (document.add.img.value != "") {
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (!regexp.test(document.add.img.value)) {
      alert("Must be input http type address");
      document.add.img.focus();
      return false;
    }
  } else {
    alert("Must fill the url");
    document.add.name.focus();
    return false;
  }

  return(true);
}