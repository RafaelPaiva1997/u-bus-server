var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./database');

const port = 8090;
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post('/render/horarios', function(req, res) {
    database.findOne('linhas', req.body, function(err, result) {
        if (err) { res.send(err).status(400); }
        else {
            var out = {};
            var temp1;
            var temp2;
            out["nome"] = result.linha;
            out["paragens"] = [];
            result.horarios[req.body.n_horario].paragens.forEach(paragem => {
                temp1 = {};
                temp2 = {};
                paragem.dias.forEach(dia => {
                    temp1[dia.tipo.toUpperCase()] = dia.horas;
                });
                temp2["nome"] = paragem.paragem
                temp2["dias"] = temp1;
                out["paragens"].push(temp2);
            });
            res.send(out).status(200);
        }
    });
});

app.post('/render/linha', function(req, res) {
    database.findOne('linhas', req.body, function(err, result) {
        if (err) { res.send(err).status(400); }
        else { 
            var linha = result;
            var query = [];
            linha.paragens[req.body.line_type].paragens[req.body.line_number].forEach(element => { query.push(element); });
            database.find('paragens', { "key": { "nome": { "$in": query } } },function(err, result){
                if (err) { res.send(err).status(400); }
                else {
                    var paragens = result;
                    var out = [];
                    linha.paragens[req.body.line_type].paragens[req.body.line_number].forEach(element1 => { 
                        paragens.forEach(element2 => {
                            if (element1 === element2.nome) {
                                out.push(element2);
                            }
                        });
                    });
                    res.send(out).status(200);
                }
            });
        }
    });
});

app.post('/:lib/insert', function(req, res) {
  database.insert(req.params.lib, req.body, function(err) {
    if (err) { res.send(err).status(400); }
    else { res.sendStatus(200); }
  });
});

app.post('/:lib/update', function(req, res) {
  database.update(req.params.lib, req.body, function(err) {
    if (err) { res.send(err).status(400); }
    else { res.sendStatus(200); }
  });
});

app.post('/:lib/unset', function(req, res) {
    database.unset(req.params.lib, req.body, function(err) {
      if (err) { res.send(err).status(400); }
      else { res.sendStatus(200); }
    });
  });

app.post('/:lib/find', function(req, res) {
  database.find(req.params.lib, req.body, function(err, result) {
    if (err) { res.send(err).status(400); }
    else { res.send(result).status(200); }
  });
});

app.post('/:lib/findSort', function(req, res) {
  database.findSort(req.params.lib, req.body, function(err, result) {
    if (err) { res.send(err).status(400); }
    else { res.send(result).status(200); }
  });
});

app.post('/:lib/findOne', function(req, res) {
  database.findOne(req.params.lib, req.body, function(err, result) {
    if (err) { res.send(err).status(400); }
    else { res.send(result).status(200); }
  });
});

app.post('/:lib/deleteOne', function(req, res) {
  database.deleteOne(req.params.lib, req.body, function(err, result) {
    if (err) { res.send(err).status(400); }
    else { res.send(result).status(200); }
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('A base dados não conseguiu inicializar.\n', err);
  }

  database.connect();

  console.log(`A base dados está pronta. port: ${port}\n`);
});
