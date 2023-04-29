'use strict';

const { ObjectId } = require("mongodb");

// module.exports = function (app) {
module.exports = function (app, myDataBase) {
  // console.log('api myDataBase:', myDataBase);
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project_name = req.params.project;
      const filter = req.query;
      console.log('get req.params:', req.params);
      console.log('get req.query:', req.query);
      console.log('get project:', project_name);
      console.log('get {project_name, ...filter}', {project_name, ...filter});

      Object.keys(filter).forEach(
        (key,_) => {
          if(key === 'open') filter[key] = eval(filter[key])
          if(key === '_id') filter[key] = new ObjectId(filter[key]);
        });
      console.log('get filter:', filter);
      

      myDataBase.find(
        {project_name, ...filter}, 
        { projection: { project_name: 0}}
      ).toArray().then(docs => {
        console.log('docs:', docs)
        res.json(docs)
      });
    })
    
    .post(function (req, res){
      const project_name = req.params.project;
      console.log('POST project:', project_name);
      // console.log('post body', req.body);

      const { 
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if(!issue_title || !issue_text || !created_by)
        res.json({error: 'required field(s) missing'});
      else 
        myDataBase.insertOne({
          project_name,
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to ?? '',
          status_text: status_text ?? '',
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        }).then( result => 
          myDataBase.findOne({ _id: result.insertedId })
        ).then( doc => {
          // console.log('doc:', doc);
          const {project_name, ...docRest} = doc;
          let docResult = {
            ...docRest,
            _id: docRest._id.toString(),
          }
          console.log('docResult:', docResult);
          res.json(docResult);
        });

    })
    
    .put(function (req, res){
      console.log('put params', req.params);
      const { _id, ...update } = req.body;
      console.log(`put body _id: ${_id}, update:`, update);
      
      let hasFilter = false;
      Object.keys(update).forEach( (key,_) =>{
        if(update[key] !== '') hasFilter = true;
      });

      if(update.open) 
        update.open = eval(update.open);
      
      if(!_id)
        res.json({ error: 'missing _id' })
      else if (!hasFilter){
        console.log('put could not update');
        res.json({ error: 'no update field(s) sent', '_id': _id });
      }
      else
        myDataBase.updateOne(
          {_id: new ObjectId(_id)}, 
          { $set: { ...update, updated_on: new Date() } },
          // { upsert: true }
        ).then( result => {
          if(result.acknowledged && result.matchedCount == 1)
            res.json({  result: 'successfully updated', '_id': _id });
          else
            res.json({ error: 'could not update', '_id': _id });
        });
        
    })
    
    .delete(function (req, res){
      const _id = req.body._id;
      console.log('delete _id', _id);

      if(!_id) {
        res.json({ error: 'missing _id' });
      } else {
        myDataBase.deleteOne({ _id: new ObjectId(_id) })
        .then(result => {
          if(result.acknowledged && result.deletedCount == 1)
            res.json({ result: 'successfully deleted', '_id': _id });
          else
            res.json({ error: 'could not delete', '_id': _id });
        });
      }

    });
    
};
