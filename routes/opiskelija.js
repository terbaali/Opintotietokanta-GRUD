var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display opiskelija page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelija ORDER BY idopiskelija',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opiskelija/index.ejs
            res.render('opiskelija',{data:''});   
        } else {
            // render to views/opiskelija/index.ejs
            res.render('opiskelija',{data:rows});
        }
    });
});

// display add student page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opiskelija/add', {
        etu_nimi: '',
        suku_nimi: '',
        luokka_tunnus: '',
        osoite: ''        
    })
})

// add a new student
router.post('/add', function(req, res, next) {    
    let etu_nimi = req.body.etu_nimi;
    let suku_nimi = req.body.suku_nimi;
    let luokka_tunnus = req.body.luokka_tunnus;
    let osoite = req.body.osoite;
    let errors = false;

    if(etu_nimi.length === 0 || suku_nimi.length === 0 || luokka_tunnus.length === 0 || osoite.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Täytä kaikki tiedot");
        // render to add.ejs with flash message
        res.render('opiskelija/add', {
            etu_nimi: etu_nimi,
            suku_nimi: suku_nimi,
            luokka_tunnus: luokka_tunnus,
            osoite: osoite
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            etu_nimi: etu_nimi,
            suku_nimi: suku_nimi,
            luokka_tunnus: luokka_tunnus,
            osoite: osoite
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelija/add', {
                    etu_nimi: form_data.etu_nimi,
                    suku_nimi: form_data.suku_nimi,
                    luokka_tunnus: form_data.luokka_tunnus,
                    osoite: form_data.osoite                    
                })
            } else {                
                req.flash('success', 'Opiskelija lisätty');
                res.redirect('/opiskelija');
            }
        })
    }
})

// display edit student page
router.get('/edit/(:idopiskelija)', function(req, res, next) {

    let idopiskelija = req.params.idopiskelija;
   
    dbConn.query('SELECT * FROM opiskelija WHERE idopiskelija = ' + idopiskelija, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Opiskkeijaa ei löydy idopiskelija = ' + idopiskelija)
            res.redirect('/opiskelija')
        }
        // if student found
        else {
            // render to edit.ejs
            res.render('opiskelija/edit', {
                title: 'Edit Student', 
                idopiskelija: rows[0].idopiskelija,
                etu_nimi: rows[0].etu_nimi,
                suku_nimi: rows[0].suku_nimi,
                luokka_tunnus: rows[0].luokka_tunnus,
                osoite: rows[0].osoite
            })
        }
    })
})

// update student data
router.post('/update/:idopiskelija', function(req, res, next) {

    let idopiskelija = req.params.idopiskelija;
    let etu_nimi = req.body.etu_nimi;
    let suku_nimi = req.body.suku_nimi;
    let luokka_tunnus = req.body.luokka_tunnus;
    let osoite = req.body.osoite;
    let errors = false;

    if(etu_nimi.length === 0 || suku_nimi.length === 0 || luokka_tunnus.length === 0 || osoite.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Täytä kaikki tiedot");
        // render to add.ejs with flash message
        res.render('opiskelija/edit', {
            idopiskelija: req.params.idopiskelija,
            etu_nimi: etu_nimi,
            suku_nimi: suku_nimi,
            luokka_tunnus: luokka_tunnus,
            osoite: osoite
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            etu_nimi: etu_nimi,
            suku_nimi: suku_nimi,
            luokka_tunnus: luokka_tunnus,
            osoite: osoite
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE idopiskelija = ' + idopiskelija, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opiskelija/edit', {
                    idopiskelija: req.params.idopiskelija,
                    etu_nimi: form_data.etu_nimi,
                    suku_nimi: form_data.suku_nimi,
                    luokka_tunnus: form_data.luokka_tunnus,
                    osoite: form_data.osoite
                })
            } else {
                req.flash('success', 'Opiskelijan tiedot päivitetty');
                res.redirect('/opiskelija');
            }
        })
    }
})
   
// delete student
router.get('/delete/(:idopiskelija)', function(req, res, next) {

    let idopiskelija = req.params.idopiskelija;
     
    dbConn.query('DELETE FROM opiskelija WHERE idopiskelija = ' + idopiskelija, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to opiskelija page
            res.redirect('/opiskelija')
        } else {
            // set flash message
            req.flash('success', 'Opiskelijan tiedot poistettu! idopiskelija = ' + idopiskelija)
            // redirect to opiskelija page
            res.redirect('/opiskelija')
        }
    })
})

module.exports = router;