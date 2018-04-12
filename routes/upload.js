const express = require('express');
const router = express.Router();
const path = require('path');

const mume = require('@shd101wyy/mume');

const init = async () => {
	await mume.init();
	console.log('Mume initialized.');
};

router.post('/', async (req, res) => {
	if (!req.files) res.status(500).send('Error uploading this file');

	const mdFile = req.files.mdFile;
	try {
		const fp = `temp/${mdFile.name}`;
		await mdFile.mv(fp);

		const engine = new mume.MarkdownEngine({
			filePath: fp,
			config: {
				previewTheme: 'github-light.css',
				codeBlockTheme: 'default.css',
				printBackground: true
			}
		});

		const outFile = await engine.htmlExport({
			offline: false,
			runAllCodeChunks: true
		});

		const fullPath = path.join(__dirname.split(path.sep).slice(0, -1).join(path.sep), outFile);

		res.sendFile(fullPath);

	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

init();

module.exports = router;
