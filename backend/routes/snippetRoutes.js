const express = require('express');
const router = express.Router();
const { createSnippet, getAllSnippets, getSnippetByTag, getSnippetById } = require('../controllers/snippetController');

router.post('/', createSnippet);
router.get('/', getAllSnippets);
router.get('/tag/:tag', getSnippetByTag);
router.get('/:id', getSnippetById);