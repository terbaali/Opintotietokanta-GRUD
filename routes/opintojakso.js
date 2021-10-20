var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opintojakso ORDER BY idOpintojakso',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opintojakso/index.ejs
            res.render('opintojakso',{data1:''});   
        } else {
            // render to views/opintojakso/index.ejs
            res.render('opintojakso',{data1:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opintojakso/add', {
        nimi: '',
        laajuus: '',
        Koodi: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let nimi = req.body.nimi;
    let laajuus = req.body.laajuus;
    let Koodi = req.body.Koodi;
    let errors = false;

    if(nimi.length === 0 || laajuus.length === 0 || Koodi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Täytäkaikki tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            nimi: nimi,
            laajuus: laajuus,
            Koodi: Koodi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nimi: nimi,
            laajuus: laajuus,
            Koodi: Koodi
        }
        
        // insert query
        dbConn.query('INSERT INTO opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opintojakso/add', {
                    nimi: form_data.nimi,
                    laajuus: form_data.laajuus,
                    Koodi: form_data.Koodi                    
                })
            } else {                
                req.flash('success', 'Opintojakso lisätty');
                res.redirect('/opintojakso');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
   
    dbConn.query('SELECT * FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Opintojaksoa ei löydy id = ' + idOpintojakso)
            res.redirect('/opintojakso')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opintojakso/edit', {
                title: 'Edit opintojakso', 
                idOpintojakso: rows[0].idOpintojakso,
                nimi: rows[0].nimi,
                laajuus: rows[0].laajuus,
                Koodi: rows[0].Koodi
            })
        }
    })
})

// update book data
router.post('/update/:idOpintojakso', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
    let nimi = req.body.nimi;
    let laajuus = req.body.laajuus;
    let Koodi = req.body.Koodi;
    let errors = false;

    if(nimi.length === 0 || laajuus.length === 0 || Koodi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Täytä kaikki tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/edit', {
            idOpintojakso: req.params.idOpintojakso,
            nimi: nimi,
            laajuus: laajuus,
            Koodi: Koodi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            nimi: nimi,
            laajuus: laajuus,
            Koodi: Koodi
        }
        // update query
        dbConn.query('UPDATE books SET ? WHERE idOpintojakso = ' + idOpintojakso, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opintojakso/edit', {
                    idOpintojakso: req.params.idOpintojakso,
                    nimi: form_data.nimi,
                    laajuus: form_data.laajuus,
                    Koodi: form_data.Koodi
                })
            } else {
                req.flash('success', 'Opintojakso päivitetty');
                res.redirect('/opintojakso');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
     
    dbConn.query('DELETE FROM books WHERE id = ' + idOpintojakso, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/opintojakso')
        } else {
            // set flash message
            req.flash('success', 'Onnistuneesti poistettu opintojakso ID = ' + idOpintojakso)
            // redirect to books page
            res.redirect('/opintojakso')
        }
    })
})

module.exports = router;