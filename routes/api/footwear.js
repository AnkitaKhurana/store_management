const sequelize = require('sequelize');
const route = require('express').Router();
const authUtils = require('../../auth/utils');
const Footwear = require('../../db/models').Footwear;
const User = require('../../db/models').User;
const moment = require('moment');



route.get('/', authUtils.eli(), (req, res) => {
    console.log(req.user);
    Footwear.findAll({
        attributes: ['f_id', 'article_no' ],
    })
        .then((c) => {
            res.render('main', { title: 'Elista',footwear : c});
           // res.status(200).send(c)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send("Error retrieving footwear")
        })


});

route.get('/new_footwear', authUtils.eli(), (req, res) => {

    res.render('new_footwear', { title: 'Elista'});


});

route.get('/edit_footwear/:id', authUtils.eli(), (req, res) => {





    Footwear.findOne({
        where: {
            f_id: req.params.id
        }

    })
        .then((event) => {
            if (!event) {

                return res.status(500).send("No such footwear found")
            }
           res.render('edit_footwear', {data : event,title: 'Elista',moment: moment});
           //res.status(200).send(JSON.stringify(event));
        })
        .catch((err) => {
            res.status(500).send('Error finding Footwear')
        })
});

route.get('/:id', authUtils.eli(), (req, res) => {
    Footwear.findOne({
        where: {
            f_id: req.params.id
        },
        // include: [{
        //     model: User,
        //     attributes: ['username', 'email']
        // }]
    })
        .then((event) => {
            if (!event) {
                return res.status(500).send("No such footwear found")
            }
            res.status(200).send(event);
        })
        .catch((err) => {
            res.status(500).send('Error finding Footwear')
        })
});


route.post('/new', authUtils.eli(), (req, res) => {
    //Add server-side validations if required here
    if (!req.body.article_no) {
        return res.status(403).send('Event cannot created without article name')
    }
    console.log(req.body);
    // YYYY-MM-DD'T'HH:MM
    Footwear.create({
        article_no : req.body.article_no,
        category : req.body.category,
        size : req.body.size,
        colour : req.body.colour,
        brand : req.body.brand,
        imgurl: req.body.imgurl,
        type : req.body.type,
        material : req.body.material,
        date_brought: req.body.date_brought,
        date_sold : req.body.date_sold,
        quantity:req.body.quantity,
        createdAt: new Date(req.body.createdAt),
        updatedAt: new Date(req.body.updatedAt )

    }).then((shoe) => {

       res.redirect('http://localhost:3456/api/footwear/');
        //  res.status(200).send(shoe)

    }).catch((err) => {
        res.status(500).send(err.message)

    })
});


route.post('/edit/:id', authUtils.eli(), (req, res) => {
    Footwear.update({
            article_no : req.body.article_no,
            category : req.body.category,
            size : req.body.size,
            colour : req.body.colour,
            brand : req.body.brand,
            imgurl: req.body.imgurl,
            type : req.body.type,
            material : req.body.material,
            date_brought: req.body.date_brought,
            date_sold : req.body.date_sold,
            quantity:req.body.quantity,

            updatedAt: new Date(req.body.updatedAt ),

            startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
            endTime: req.body.endTime ? new Date(req.body.endTime) : undefined

        },
        {
            where: {
                f_id: req.params.id

            }
        }).then((updatedShoe) => {
        if (updatedShoe[0] == 0) {
            return res.status(403).send('Footwear does not exist, or you cannot edit it')
        } else {
            res.redirect('http://localhost:3456/api/footwear/');
           // res.status(200).send('Footwear successfully edited')
        }

    })
});



route.get('/delete_footwear/:id', authUtils.eli(), (req, res) => {
   Footwear.destroy(
        {
            where: {
                f_id: req.params.id,

            }
        }).then((destroyedRows) => {
        if (destroyedRows == 0) {
            return res.status(403).send('Footwear does not exist, or you cannot edit it')
        } else {
            res.redirect('http://localhost:3456/api/footwear/');
           // res.status(200).send('Footwear successfully deleted')
        }

    })
});


route.get('/add/:id', authUtils.eli(), (req, res) => {

    Footwear.update({

           quantity:sequelize.literal('quantity +1'),

            updatedAt: new Date(req.body.updatedAt ),


        },
        {
            where: {
                f_id: req.params.id

            }
        }).then((updatedShoe) => {
        if (updatedShoe[0] == 0) {
            return res.status(403).send('Footwear does not exist, or you cannot edit it')
        } else {
            res.redirect('http://localhost:3456/api/footwear/');
            //res.status(200).send('Footwear successfully edited')
        }

    })
});

route.get('/del/:id', authUtils.eli(), (req, res) => {


     let qt;
    Footwear.findOne({
        where: {
            f_id: req.params.id
        },

    }).then((ans) => {
        console.log('Ans.Quantity');
        console.log(ans.quantity);
       qt = ans.quantity;
        qt-- ;
        if(qt<0)
            qt =0 ;
        console.log(qt);
        Footwear.update({
                quantity:qt,
                updatedAt: new Date(req.body.updatedAt ),
            },
            {
                where: {
                    f_id: req.params.id
                }
            }).then((updatedShoe) => {
                if (updatedShoe[0] == 0) {
                    return res.status(403).send('Footwear does not exist, or you cannot edit it')
                } else {
                    res.redirect('http://localhost:3456/api/footwear/');
                    //res.status(200).send('Footwear successfully edited')
                }

            });
    }).catch((err) => {
        console.log(err)
        res.status(500).send("Error retrieving footwear")
    });

});

module.exports = route;