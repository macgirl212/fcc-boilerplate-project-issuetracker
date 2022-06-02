'use strict';
const mongoose = require('mongoose');

let issueSchema = new mongoose.Schema({
	issue_title: { type: String, required: true },
	issue_text: { type: String, required: true },
	created_by: { type: String, required: true },
	assigned_to: String,
	status_text: String,
	open: { type: Boolean, required: true },
	created_on: { type: Date, required: true },
	updated_on: { type: Date, required: true },
	project: String,
});

let Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {
	app
		.route('/api/issues/:project')

		.get(function (req, res) {
			let project = req.params.project;
		})

		.post(function (req, res) {
			let project = req.params.project;
			if (
				!req.body.issue_title ||
				!req.body.issue_text ||
				!req.body.created_by
			) {
				return res.json({ error: 'required field(s) missing' });
			}
			let newIssue = new Issue({
				issue_title: req.body.issue_title,
				issue_text: req.body.issue_text,
				created_by: req.body.created_by,
				assigned_to: req.body.assigned_to || '',
				status_text: req.body.status_text || '',
				open: true,
				created_on: new Date().toUTCString(),
				updated_on: new Date().toUTCString(),
				project: project,
			});
			newIssue.save((error, savedIssue) => {
				if (!error && savedIssue) {
					res.status(201).json(savedIssue);
				}
			});
		})

		.put(function (req, res) {
			let project = req.params.project;
		})

		.delete(function (req, res) {
			let project = req.params.project;
		});
};
