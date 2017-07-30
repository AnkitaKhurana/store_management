
const route = require('express').Router();
const authUtils = require('../../auth/utils');
const Footwear = require('../../db/models').Footwear;
const User = require('../../db/models').User;

route.get('/', (req, res) => {
    console.log(req.user);
    Footwear.findAll({
        attributes: ['f_id', 'article_no' ],
    })
        .then((c) => {
            res.status(200).send(c)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send("Error retrieving footwear")
        })
});

route.get('/:id', (req, res) => {
    Footwear.findOne({
        where: {
            f_id: req.params.id
        },
        include: [{
            model: Footwear,
            attributes: ['username', 'email']
        }]
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


route.post('/new', (req, res) => {
    //Add server-side validations if required here
    if (!req.body.article_name) {
        return res.status(403).send('Event cannot created without article name')
    }

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

    }).then((event) => {
        //res.status(200).send(event)

        if (req.body.invitees) {
            let invitees = req.body.invitees.split(';');
            invitees = invitees.map((i) => {
                return {email: i.trim()}
            });
            Invitee.bulkCreate(invitees, {
                ignoreDuplicates: true
            })
                .then((invitees) => {
                    let eventInvitee = invitees.map((i) => {
                        return {
                            eventId: event.id,
                            inviteeId: i.id
                        }
                    });

                    EventInvitee.bulkCreate(eventInvitee, {
                        ignoreDuplicates: true
                    })
                        .then((eiArr) => {
                            res.status(200).send(event)
                            let emailArr = invitees.map((i) => i.email);
                            im.sendInvite(emailArr, function () {
                                console.log('Invites are sent');
                            });

                        })
                })
        } else {
            res.status(200).send(event)
        }
    }).catch((err) => {
        res.status(500).send(err.message)

    })
});



module.exports = route;