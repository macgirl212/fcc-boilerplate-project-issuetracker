'use strict';
const mongoose = require('mongoose');

let issueSchema = new mongoose.Schema({
	issue_title: { type: String, required: true },
	issue_text: { type: String, required: true },
	created_by: { type: String, required: true },
	assigned_to: String,
	status_text: String,
	open: { type: Boolean, default: true },
	created_on: Date,
	updated_on: Date,
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

			// try to create issue
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
			const goodMessage = {
				result: 'successfully updated',
			};
			// check if there's no id
			if (!req.body._id) {
				return res.json({ error: 'missing _id' });
			}

			// create a query object to hold all possible fields
			const queryObject = {};
			for (const field in req.body) {
				if (req.body[field] !== '' && field !== '_id') {
					queryObject[field] = req.body[field];
				}
			}

			// check if any fields were added
			if (Object.keys(queryObject).length === 0) {
				return res.json({
					error: 'no update field(s) sent',
					_id: req.body._id,
				});
			}

			// add extra fields to queryObject
			queryObject.updated_on = new Date().toUTCString();

			// try to find and update issue
			Issue.findByIdAndUpdate(req.body._id, queryObject, (err, issue) => {
				if (!issue) {
					return res.json({ error: 'could not update', _id: req.body._id });
				}
				if (!err && issue) {
					return res.json({ result: 'successfully updated', _id: issue._id });
				}
			});
		})

		.delete(function (req, res) {
			// check if there's no id
			if (!req.body._id) {
				return res.json({ error: 'missing _id' });
			}

			// try to find and delete issue
			Issue.findByIdAndRemove(req.body._id, (err, issue) => {
				if (!issue) {
					return res.json({ error: 'could not delete', _id: req.body._id });
				}
				if (!err && issue) {
					res.json({ result: 'successfully deleted', _id: req.body._id });
				}
			});
		});
};
