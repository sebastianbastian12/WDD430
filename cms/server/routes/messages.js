const express = require('express');
const router = express.Router();
const sequenceGenerator = require('../models/sequenceGenerator');
const Message = require('../models/message');

//GET method

router.get('/', (req, res, next) => {
  Message.find()
    .then((messages) => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error ocurred',
        error: error,
      });
    });
});

//POST method

router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId('messages');

  const message = new message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender,
  });

  message
    .save()
    .then((createdMessage) => {
      res.status(201).json({
        message: 'Message added successfully',
        newMessage: createdMessage,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error ocurred',
        error: error,
      });
    });
});

//PUT method

router.put('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      Message.updateOne({ id: req.params.id }, message)
        .then((result) => {
          res.status(204).json({
            message: 'Message updated successfully!',
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: 'An error ocurred',
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Message not found',
        error: { message: 'Message not found' },
      });
    });
});

//DELETE method

router.delete('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      Message.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(204).json({
            message: 'Message deleted successfully',
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: 'An error ocurred',
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Message not found',
        error: { message: 'Message not found' },
      });
    });
});

module.exports = router;
