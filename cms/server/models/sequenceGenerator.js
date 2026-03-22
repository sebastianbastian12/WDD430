var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {

  Sequence.findOne()
    .exec()
    .then(sequence => {
      if (!sequence) {
        console.log('No sequence found in database.');
        return;
      }

      secuenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
      console.log('SequenceGenerator initialized successfully!');
    })
    .catch(err => {
      console.log('Error initializing SequenceGenerator: ' + err);
    });
}

SequenceGenerator.prototype.nextId = function(collectionType) {
  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;

    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;

    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId: maxContactId};
      nextId = maxContactId;
      break;
      default:
        return -1;
    }

  sequence.updateOne({_id: sequenceId}, { $set: updateObject})
    .catch(err => {
      console.log('nextId error = ' + err);
    });

    return nextId;
}

 module.export = new SequenceGenerator();