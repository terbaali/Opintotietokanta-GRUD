var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display arvionti page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM arviointi ORDER BY idArviointi',function(err,rows)     {
 
        if(err) {
            req.flash('arviointi', err);
            // render to views/opiskelija/index.ejs
            res.render('aviointi',{data:''});   
        } else {
            // render to views/opiskelija/index.ejs
            res.render('arviointi',{data:rows});
        }
    });
});

// display add page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('arviointi/add', {
        opiskelija_idopiskelija: '',
        opintojakso_idOpintojakso: '',
        Arvosana: ''

    })
})

// add a new arviointi
router.post('/add', function(req, res, next) {    

    let opiskelija_idopiskelija = req.body.opiskelija_idopiskelija;
    let opintojakso_idOpintojakso = req.body.opintojakso_idOpintojakso;
    let Arvosana = req.body.Arvosana;
    let errors = false;

    if(opiskelija_idopiskelija.length === 0 || opintojakso_idOpintojakso.length === 0 || Arvosana.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Täytä kaikki tiedot");
        // render to add.ejs with flash message
        res.render('arviointi/add', {
            opiskelija_idopiskelija: opiskelija_idopiskelija,
            opintojakso_idOpintojakso: opintojakso_idOpintojakso,
            Arvosana: Arvosana
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            opiskelija_idopiskelija: opiskelija_idopiskelija,
            opintojakso_idOpintojakso: opintojakso_idOpintojakso,
            Arvosana: Arvosana
        }
        
        // insert query
        dbConn.query('INSERT INTO arviointi SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('arviointi/add', {
                    opiskelija_idopiskelija: opiskelija_idopiskelija,
                    opintojakso_idOpintojakso: opintojakso_idOpintojakso,
                    Arvosana: Arvosana                    
                })
            } else {                
                req.flash('success', 'Arviointi lisätty');
                res.redirect('/arviointi');
            }
        })
    }
})

// display edit page
router.get('/edit/(:idArviointi)', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
   
    dbConn.query('SELECT * FROM arviointi WHERE idArviointi = ' + idArviointi, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Arviointia ei löydy kun id = ' + idArviointi)
            res.redirect('/arviointi')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('arviointi/edit', {
                title: 'Edit arviointi', 
                idArviointi: rows[0].idArviointi,
                opiskelija_idopiskelija: rows[0].opiskelija_idopiskelija,
                opintojakso_idOpintojakso: rows[0].opintojakso_idOpintojakso,
                Arvosana: rows[0].Arvosana
            })
        }
    })
})

// update book data
router.post('/update/:idArviointi', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
    let opiskelija_idopiskelija = req.body.opiskelija_idopiskelija;
    let opintojakso_idOpintojakso = req.body.opintojakso_idOpintojakso;
    let Arvosana = req.body.Arvosana;
    let errors = false;

    if(opiskelija_idopiskelija.length === 0 || opintojakso_idOpintojakso.length === 0 || Arvosana.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Täytä kaikki tiedot");
        // render to add.ejs with flash message
        res.render('arviointi/edit', {
            idArviointi: rows[0].idArviointi,
            opiskelija_idopiskelija: rows[0].opiskelija_idopiskelija,
            opintojakso_idOpintojakso: rows[0].opintojakso_idOpintojakso,
            Arvosana: rows[0].Arvosana
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            idArviointi: rows[0].idArviointi,
            opiskelija_idopiskelija: rows[0].opiskelija_idopiskelija,
            opintojakso_idOpintojakso: rows[0].opintojakso_idOpintojakso,
            Arvosana: rows[0].Arvosana
        }
        // update query
        dbConn.query('UPDATE arviointi SET ? WHERE idArviointi = ' + idArviointi, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('arviointi/edit', {
                    idArviointi: req.params.idArviointi,
                    opiskelija_idopiskelija: req.params.opiskelija_idopiskelija,
                    opintojakso_idOpintojakso: form_data.opintojakso_idOpintojakso,
                    Arvosana: form_data.Arvosana
                })
            } else {
                req.flash('success', 'Arviointi päivitetty');
                res.redirect('/arviointi');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:idArviointi)', function(req, res, next) {

    let idArviointi = req.params.idArviointi;
     
    dbConn.query('DELETE FROM arviointi WHERE idArviointi = ' + idArviointi, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/arviointi')
        } else {
            // set flash message
            req.flash('success', 'Omnistuneesti poistettu aarvointi ID = ' + idArviointi)
            // redirect to books page
            res.redirect('/arviointi')
        }
    })
})

module.exports = router;