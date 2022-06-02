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
			// get all possible queries
			let {
				issue_title,
				issue_text,
				created_by,
				assigned_to,
				status_text,
				open,
				created_on,
				updated_on,
			} = req.query;

			const queryObject = {};

			// add all available queries to the query object
			queryObject.project = project;
			if (issue_title) {
				queryObject.issue_title = issue_title;
			}
			if (issue_text) {
				queryObject.issue_text = issue_text;
			}
			if (created_by) {
				queryObject.created_by = created_by;
			}
			if (assigned_to) {
				queryObject.assigned_to = assigned_to;
			}
			if (status_text) {
				queryObject.status_text = status_text;
			}
			if (open) {
				queryObject.open = open;
			}
			if (created_on) {
				queryObject.created_on = created_on;
			}
			if (updated_on) {
				queryObject.updated_on = updated_on;
			}

			Issue.find(queryObject, (err, issues) => {
				if (!err && issues) {
					res.json(issues);
				}
			});
		})

		.post(function (req, res) {
			let project = req.params.project;
			// if any of the required fields are missing, return an error
			if (
				!req.body.issue_title ||
				!req.body.issue_text ||
				!req.body.created_by
			) {
				return res.json({ error: 'required field(s) missing' });
			}

			Issue.create(
				{
					issue_title: req.body.issue_title,
					issue_text: req.body.issue_text,
					created_by: req.body.created_by,
					assigned_to: req.body.assigned_to || '',
					status_text: req.body.status_text || '',
					open: true,
					created_on: new Date().toUTCString(),
					updated_on: new Date().toUTCString(),
					project: project,
				},
				(err, issue) => {
					if (!err && issue) {
						res.status(201).json(issue);
					}
				}
			);
		})

		.put(function (req, res) {
			let project = req.params.project;
		})

		.delete(function (req, res) {
			let project = req.params.project;
		});
};
