function newPair(seed, accountIndex) {
  var index = hex_uint8(dec2hex(accountIndex, 4));

  var context = blake2bInit(32);
  blake2bUpdate(context, seed);
  blake2bUpdate(context, index);

  var newKey = blake2bFinal(context);

  return {
    secret: uint8_hex(newKey),
    address: accountFromHexKey(uint8_hex(nacl.sign.keyPair.fromSecretKey(newKey).publicKey))
  };
}

var pairList = document.getElementById('pairs');
var seedInput = document.getElementById('seed');
var accountIndexInput = document.getElementById('walletpath');

document.getElementById('randomSeed').addEventListener('click', function() {
  seedInput.value = uint8_hex(nacl.randomBytes(32));
}, false);

document.getElementById('generatePair').addEventListener('click', function() {
  if(!/[0-9A-F]{64}/i.test(seedInput.value)) {
    alert('Seed must be 64 character hexadecimal string!');
    return;
  }

  var accountIndex = parseInt(accountIndexInput.value, 10);
  if(accountIndex < 0 || accountIndex >= Math.pow(2,32)) {
    alert('Account index must be 32 bit unsigned integer!');
    return;
  }

  var pair = newPair(hex_uint8(seedInput.value), accountIndex);

  
  pairList.innerHTML += '<tr><td style="width:33%;">' + seedInput.value + '</td><td style="width:33%;">' +  pair.secret +'</td><td style="width:33%;">' + pair.address + '</td></tr>';
  
  
}, false);