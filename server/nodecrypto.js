var crypto = require('crypto');

module.exports = {

  secretkey: "Mr.É1981",

  encrypt: function(password) {
    var cipher = crypto.createCipher('aes-256-ecb', password);
    return cipher.update(this.secretkey, 'utf8', 'hex') + cipher.final('hex');
  },
  
  decrypt: function(password,buffer) {
    var decipher = crypto.createDecipher('aes-256-ecb', password);
    return decipher.update(buffer, 'hex', 'utf8') + decipher.final('utf8');
  }
  
};
