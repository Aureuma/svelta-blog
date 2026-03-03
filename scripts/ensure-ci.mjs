if (!process.env.CI) {
	console.error('Tests are CI-only. Run them through GitHub Actions workflows.');
	process.exit(1);
}
