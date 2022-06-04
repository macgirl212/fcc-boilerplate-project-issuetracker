const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
	let updateId;
	test('Create issue with every field filled', (done) => {
		chai
			.request(server)
			.post('/api/issues/test')
			.send({
				issue_title: 'Broken link',
				issue_text: 'Link for wikipedia is broken',
				created_by: 'Link',
				assigned_to: 'QA',
				status_text: 'In progress',
			})
			.end((err, res) => {
				assert.equal(res.status, 201);
				assert.equal(res.body.issue_title, 'Broken link');
				assert.equal(res.body.issue_text, 'Link for wikipedia is broken');
				assert.equal(res.body.created_by, 'Link');
				assert.equal(res.body.assigned_to, 'QA');
				assert.equal(res.body.status_text, 'In progress');
				assert.equal(res.body.project, 'test');
				done();
			});
	});
	test('Create issue with only required fields', (done) => {
		chai
			.request(server)
			.post('/api/issues/test')
			.send({
				issue_title: 'Page crashed',
				issue_text: 'Page crashed when I try to login',
				created_by: 'Crash',
				assigned_to: '',
				status_text: '',
			})
			.end((err, res) => {
				updateId = res.body._id;
				assert.equal(res.status, 201);
				assert.equal(res.body.issue_title, 'Page crashed');
				assert.equal(res.body.issue_text, 'Page crashed when I try to login');
				assert.equal(res.body.created_by, 'Crash');
				assert.equal(res.body.assigned_to, '');
				assert.equal(res.body.status_text, '');
				assert.equal(res.body.project, 'test');
				done();
				return updateId;
			});
	});
	test('Create issue with missing required fields', (done) => {
		chai
			.request(server)
			.post('/api/issues/test')
			.send({
				issue_title: 'Eve',
				issue_text: '',
				created_by: 'Wall-E',
				assigned_to: '',
				status_text: '',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'required field(s) missing');
				done();
			});
	});
	test('View all issues on a project', (done) => {
		chai
			.request(server)
			.get('/api/issues/test')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'project');
				assert.property(res.body[0], '_id');
				done();
			});
	});
	test('View all issues on a project with one filter', (done) => {
		chai
			.request(server)
			.get('/api/issues/test')
			.query({ created_by: 'Link' })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'project');
				assert.property(res.body[0], '_id');
				done();
			});
	});
	test('View all issues on a project with multiple filters', (done) => {
		chai
			.request(server)
			.get('/api/issues/test')
			.query({
				issue_title: 'Broken link',
				issue_text: 'Link for wikipedia is broken',
				created_by: 'Link',
				assigned_to: 'QA',
				status_text: 'In progress',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'project');
				assert.property(res.body[0], '_id');
				done();
			});
	});
	test('Update one field on an issue', (done) => {
		chai
			.request(server)
			.put('/api/issues/test')
			.send({
				_id: updateId,
				issue_text: 'Page crashed when I try to logout',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.result, 'successfully updated');
				assert.equal(res.body._id, updateId);
				done();
			});
	});
	test('Update multiple fields on an issue', (done) => {
		chai
			.request(server)
			.put('/api/issues/test')
			.send({
				_id: updateId,
				issue_text: 'Everything crashes',
				issue_text: 'Page crashed when I clicked',
				created_by: 'Coco',
				assigned_to: 'Front-end development department',
				status_text: 'Not yet in progress',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.result, 'successfully updated');
				assert.equal(res.body._id, updateId);
				done();
			});
	});
});
