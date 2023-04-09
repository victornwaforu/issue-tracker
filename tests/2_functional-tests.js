const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite('Functional Tests', function() {
    suite("Routing Tests", function() {
        suite("3 Post request Tests", function() {
            test("Create an issue with every field: POST request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "fCC",
                    assigned_to: "Dom",
                    status_text: "Not Done"
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    deleteID = res.body._id;
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.assigned_to, "Dom");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.status_text, "Not Done");
                    assert.equal(res.body.issue_text, "Functional Test");
                });
                done();
            });
            test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "fCC",
                    assigned_to: "",
                    status_text: ""
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.issue_text, "Functional Test");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                });
                done();
            });
            test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "",
                    issue_text: "",
                    created_by: "fCC",
                    assigned_to: "",
                    status_text: ""
                })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                });
            });
        });


        suite("3 Get request Tests", function() {
            test("View issues on a project: GET request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .get("/api/issues/test-data-abc123")
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 4);
                    done();
                });
            });
            test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .get("/api/issues/test-data-abc123")
                .query({ _id: "6432e930304fb09397633a81" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        _id: "6432e930304fb09397633a81",
                        issue_title: "HI",
                        "issue_text": "dkjkjkj",
                        "created_on": "2023-04-09T16:34:56.975Z",
                        "updated_on": "2023-04-09T16:34:56.975Z",
                        "created_by": "victor",
                        "assigned_to": "",
                        "open": true,
                        "status_text": ""
                    });
                    done();
                });
            });
            test("View issues on a project with one multiple filters: GET request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .get("/api/issues/test-data-abc123")
                .query({ issue_title: "Some", issue_text: "testing" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        "_id": "6432e941304fb09397633a87",
                        "issue_title": "Some",
                        "issue_text": "testing",
                        "created_on": "2023-04-09T16:35:13.019Z",
                        "updated_on": "2023-04-09T16:35:13.019Z",
                        "created_by": "Ugochukwu",
                        "assigned_to": "",
                        "open": true,
                        "status_text": ""
                    });
                    done();
                });
            });
        });


        suite("5 Put request Tests", function() {
            test("Update one field on an issue: PUT request to /api/issues/test-data-put", function(done) {
                chai
                .request(server)
                .put("/api/issues/test-data-put")
                .send({ _id: "6432ef653a26ca8fdeb67c84", issue_title: "ice" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, "6432ef653a26ca8fdeb67c84");
                    done();
                });
            });
            test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .put("/api/issues/test-data-put")
                .send({ _id: "6432ef653a26ca8fdeb67c84", issue_title: "random", issue_text: "random" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, "6432ef653a26ca8fdeb67c84");
                    done();
                });
            });
            test("Update an issue with missing _id: PUT request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .put("/api/issues/test-data-put")
                .send({ issue_text: "update", issue_title: "update" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                });
            });
            test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .put("/api/issues/test-data-put")
                .send({ _id: "6432ef653a26ca8fdeb67c84" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "no update field(s) sent");
                    done();
                });
            });
            test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .put("/api/issues/test-data-put")
                .send({ _id: "9726ef653a26ca8badl67c84", issue_title: "update", issue_text: "update" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not update");
                    done();
                });
            });
        });


        suite("3 DELETE request Tests", function() {
            test("Delete an issue: DELETE request to /api/issues/projects", function(done) {
                chai
                .request(server)
                .delete("/api/issues/projects")
                .send({ _id: deleteID })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted");
                    done();
                });
            });
            test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .delete("/api/issues/projects")
                .send({ _id: "6432ef653a26ca8fdinvalid" })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not delete");
                    done();
                });
            });
            test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done) {
                chai
                .request(server)
                .delete("/api/issues/projects")
                .send({})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                });
            });
        });
    });
});
