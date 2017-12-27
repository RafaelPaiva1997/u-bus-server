var MongoClient = require('mongodb').MongoClient;
var linhas;
var paragens;

var executer = function(lib, e, callback, execute) {
  if (lib === 'linhas') {
    execute(linhas, e, callback);
  }
  else if (lib === 'paragens') {
    execute(paragens, e, callback);
  }
  else {
    return false;
  }
  return true;
}

exports.connect = function() {
  MongoClient.connect("mongodb://localhost:27017/db", function(err, db) {
    if(err) { return console.log(err); }

    linhas = db.collection('linhas');
    paragens = db.collection('paragens');

    return "ok";
  });
}

exports.insert = function(lib, e, callback) {
  if (!executer(lib, e, callback, function(lib, e, callback) {
    lib.insert(e.e, {w:1}, function(err){
      if(err) { callback(err); }
      else { callback(null); }
    });
  }
  )) {
    console.log("invalid insert\n");
  }
}

exports.update = function(lib, e, callback) {
  if (!executer(lib, e, callback, function(lib, e, callback) {
    lib.update(e.key, {$set: e.values}, {w:1}, function(err, result) {
      if (err) { callback(err); }
      else { callback(null); }
    });
  }
  )) {
    console.log("invalid update\n");
  }
}

exports.unset = function(lib, e, callback) {
    if (!executer(lib, e, callback, function(lib, e, callback) {
      lib.update(e.key, {$unset: e.values}, {w:1}, function(err, result) {
        if (err) { callback(err); }
        else { callback(null); }
      });
    }
    )) {
      console.log("invalid unset\n");
    }
  }

exports.find = function(lib, e, callback) {
  if (!executer(lib, e, callback, function(lib, e, callback) {
    lib.find(e.key).toArray( function(err, result) {
      if (err) { callback(err); }
      else if (result === null) { callback('404'); }
      else { callback(null, result); }
    });
  }
  )) {
    console.log("invalid find\n");
  }
}

exports.findSort = function(lib, e, callback) {
  if (!executer(lib, e, callback, function(lib, e, callback) {
    lib.find(e.key).sort(e.sort).toArray( function(err, result) {
      if (err) { callback(err); }
      else if (result === null) { callback('404'); }
      else { callback(null, result); }
    });
  }
  )) {
    console.log("invalid findSort\n");
  }
}

exports.findOne = function(lib, e, callback) {
  if (!executer(lib, e, callback, function(lib, e, callback) {
    lib.findOne(e.key, function(err, result) {
      if (err) { callback(err); }
      else if (result === null) { callback('404'); }
      else { callback(null, result) }
    });
  }
  )) {
    console.log("invalid findOne\n");
  }
}

exports.deleteOne = function(lib, e, callback) {
  if (!executer(lib, e, callback, function(lib, e, callback) {
    lib.deleteOne(e.key, function(err, result){
        if(err) { callback(err); }
        else if (result === null) { callback('404'); }
        else { callback(null, result); }
    });
  }
  )) {
    console.log("invalid deleteOne\n");
  }
}
