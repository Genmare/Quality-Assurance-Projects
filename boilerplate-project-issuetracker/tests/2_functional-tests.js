const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server').app;
let myDataBase = require('../server').myDataBase;
const myDataBaseModule = require('../server').myDataBaseModule;

chai.use(chaiHttp);


const getMyDataBase = () => {
  myDataBase = myDataBaseModule.db;
}

suite('Functional Tests', function() {

  getMyDataBase();

  suite('Create an issue with', () => {
    const project_name = "post_project";
    const issue_title = "issue_title";
    const issue_text = "issue_text";
    const created_by = "user";
    const assigned_to = "assignedName";
    const status_text = "status";
    const created_on = new Date('2023-04-24');
    const created_on_str = created_on.toISOString();
    const updated_on = new Date('2023-04-25');
    const updated_on_str = updated_on.toISOString();
    // #1
    test('every field: POST request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .post(`/api/issues/${project_name}`)
        .send({
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          created_on,
          updated_on,
          open: true
        })
        .end( (err, res) => {
          // console.log('test res', res)
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'issue_title');
          assert.equal(res.body.issue_text, 'issue_text');
          assert.equal(res.body.created_by, 'user');
          assert.equal(res.body.assigned_to, 'assignedName');
          assert.equal(res.body.status_text, 'status');
          assert.equal(res.body.open, true);
          // assert.equal(res.body.created_on, created_on_str, 'created_on');
          // assert.equal(res.body.updated_on, updated_on_str, 'updated_on'); 
          done();
        });
      });
    // #2
    test('only required field: POST request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .post(`/api/issues/${project_name}`)
        .send({
          issue_title,
          issue_text,
          created_by,
          open: true
        })
        .end( (err, res) => {
          // console.log('test res', res)
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, 'issue_title');
          assert.equal(res.body.issue_text, 'issue_text');
          assert.equal(res.body.open, true);
          done();
        });
    });
    // #3
    test('missing required field: POST request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .post(`/api/issues/${project_name}`)
        .send({
          issue_text,
          created_by,
          open: true
        })
        .end( (err, res) => {
          // console.log('test res', res)
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });

    after((done) =>{
      myDataBase.deleteMany({ project_name }).then(() => done());
    }); 
  });
  suite('View issues on a project', () => {
    let id1 = null;
    let id2 = null;
    let id3 = null;
    const project_name = "get_test";
    // first issue config
    const issue_title_1 = "issue_title_1";
    const issue_text_1 = "issue 1";
    const created_by_1 = "user1";
    const assigned_to_1 = "user2";
    const status_text_1 = "status n°1";
    // second issue config
    const issue_title_2 = "issue_title_2";
    const issue_text_2 = "issue 2";
    const created_by_2 = "user2";
    // third issue confid
    const issue_title_3 = "issue_title_3";
    const issue_text_3 = "issue 3";
    const status_text_3 = " status pending"

    const issue1 = {
      issue_title: issue_title_1,
      issue_text: issue_text_1,
      created_by: created_by_1,
      assigned_to: assigned_to_1,
      status_text: status_text_1,
      open: true 
    };

    const issue2 = {
      issue_title: issue_title_2,
      issue_text: issue_text_2,
      created_by: created_by_2,
      open: true
    }

    const issue3 = {
      issue_title: issue_title_3,
      issue_text: issue_text_3,
      created_by: created_by_1,
      assigned_to: assigned_to_1,
      status_text: status_text_3,
      open: false
    }

    before( (done) => {
      myDataBase.insertMany([
        { project_name, ...issue1 },
        { project_name, ...issue2},
        { project_name, ...issue3},
      ]).then( result => {
        console.log('result:', result);
        id1 = result.insertedIds[0].toString();
        id2 = result.insertedIds[1].toString();
        id3 = result.insertedIds[2].toString();
        done();
      });
    });

    // #4 
    test('GET request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .get('/api/issues/get_test')
        .end( (_, res) => {
          // expect(res.body).to.deep.include.members([{
          //     _id: id1, ...issue1
          //   },
          //   {
          //     _id: id2, ...issue2
          //   }]);
          assert.deepEqual(res.body, [{
            _id: id1, ...issue1
          },
          {
            _id: id2, ...issue2
          },
          {
            _id: id3, ...issue3
          }])
          // assert.equal(res.body.issue_title, 'issue_title');
          done();
        }); 
    });
    // #5
    test('with one filter: GET request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .get(`/api/issues/get_test?assigned_to=${assigned_to_1}`)
        .end( (_, res) => {
          assert.deepEqual(res.body, [
            { _id: id1, ...issue1 },
            { _id: id3, ...issue3 }]);
          // expect(res.body).to.deep.include({ _id: id1, ...issue1 });
          done();
        });
    });
    // #6
    test('with multiple filters: GET request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .get(`/api/issues/get_test?assigned_to=${assigned_to_1}&created_by=${created_by_1}`)
        .end( (_, res) => {
          assert.deepEqual(res.body, [
            { _id: id1, ...issue1 },
            { _id: id3, ...issue3 }]);
          expect(res.body).to.deep.include.members([{
            _id: id1, ...issue1
          },
          {
            _id: id3, ...issue3
          }]);
          done();
        });
    }); 
    after((done) =>{
      myDataBase.deleteMany({ project_name: "get_test" }).then(() => done());
    }); 
  });

  suite('Update', () => {
    let id1 = null;
    const project_name = "put_test";
    // first issue config
    const issue_title_1 = "issue_title_1";
    const issue_text_1 = "issue 1";
    const created_by_1 = "user1";
    const assigned_to_1 = "user2";
    const status_text_1 = "status n°1";

    const issue1 = {
      issue_title: issue_title_1,
      issue_text: issue_text_1,
      created_by: created_by_1,
      assigned_to: assigned_to_1,
      status_text: status_text_1,
      open: true 
    };

    before( (done) => {
      myDataBase.insertMany([
        { project_name, ...issue1 }
      ]).then( result => {
        id1 = result.insertedIds[0].toString();
        done();
      });
    });
    // #7
    test('one field on an issue: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .put('/api/issues/put_tests')
        .send({ _id: id1, issue_title: 'put title'})
        .end( (_, res) => {
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': id1 });
          expect(res.body).to.deep.include(
          { result: 'successfully updated', '_id': id1 });
          done();
        });
      });
    // #8
    test('multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .put('/api/issues/put_tests')
        .send({ 
          _id: id1, 
          issue_title: 'put title',
          issue_text: 'put issue'
        })
        .end( (_, res) => {
          assert.deepEqual(res.body, { result: 'successfully updated', '_id': id1 });
          expect(res.body).to.deep.include(
          { result: 'successfully updated', '_id': id1 });
          done();
        });
      });
    // #9
    test('an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .put('/api/issues/put_tests')
        .send({ issue_title: 'put title' })
        .end( (_, res) => {
          assert.deepEqual(res.body, { error: 'missing _id' });
          expect(res.body).to.deep.include(
          { error: 'missing _id' });
          done();
        });
      });
    // #10
    test('an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .put('/api/issues/put_tests')
        .send({ _id: id1 })
        .end( (_, res) => {
          assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': id1 });
          expect(res.body).to.deep.include(
          { error: 'no update field(s) sent', '_id': id1 });
          done();
        });
      });
    // #11
    const badId = "5871dda29faedc3491ff93bb"
    test('an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .put('/api/issues/put_tests')
        .send({ _id: badId, issue_text: 'bad id' })
        .end( (_, res) => {
          assert.deepEqual(res.body, { error: 'could not update', '_id': badId });
          expect(res.body).to.deep.include(
          { error: 'could not update', '_id': badId });
          done();
        });
      });

    after((done) =>{
      myDataBase.deleteMany({ project_name}).then(() => done());
    });
  });

  suite('Delete', () => {
    let id1 = null;
    const project_name = "delete_tests";
    // first issue config
    const issue_title_1 = "issue_title_1";
    const issue_text_1 = "issue 1";
    const created_by_1 = "user1";
    const assigned_to_1 = "user2";
    const status_text_1 = "to delete";

    const issue1 = {
      issue_title: issue_title_1,
      issue_text: issue_text_1,
      created_by: created_by_1,
      assigned_to: assigned_to_1,
      status_text: status_text_1,
      open: true 
    };

    before( (done) => {
      myDataBase.insertOne(
        { project_name, ...issue1 }
      ).then( result => {
        id1 = result.insertedId.toString();
        done();
      });
    });
    // #12
    test(' an issue: DELETE request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .delete('/api/issues/delete_tests')
        .send({ _id: id1 })
        .end( (_, res) => {
          // console.log('delete res.body:', res.body);
          assert.deepEqual(res.body, { result: 'successfully deleted', '_id': id1 });
          expect(res.body).to.deep.include({ result: 'successfully deleted', '_id': id1 });
          done();
        });
    });
    // #13
    const badId = "5871dda29faedc3491ff93bb"
    test('an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .delete('/api/issues/delete_tests')
        .send({ _id: badId })
        .end( (_, res) => {
          // console.log('delete res.body:', res.body);
          assert.deepEqual(res.body, { error: 'could not delete', '_id': badId });
          expect(res.body).to.deep.include({ error: 'could not delete', '_id': badId });
          done();
        });
    });
    // #14
    test('an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
      chai
        .request(server)
        .delete('/api/issues/delete_tests')
        .send({})
        .end( (_, res) => {
          // console.log('delete res.body:', res.body);
          assert.deepEqual(res.body, { error: 'missing _id' });
          expect(res.body).to.deep.include({ error: 'missing _id' });
          done();
        });
    });
  });
});
