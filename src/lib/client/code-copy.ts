function copyWithFallback(text: string): boolean {
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(ta);
		return ok;
	} catch {
		return false;
	}
}

export function attachCodeCopyButtons(root: HTMLElement): () => void {
	const cleanups: Array<() => void> = [];
	const blocks = Array.from(root.querySelectorAll('pre.shiki'));

	for (const block of blocks) {
		if (!(block instanceof HTMLElement)) continue;
		if (block.dataset.copyReady === 'true') continue;

		block.dataset.copyReady = 'true';
		const code = block.querySelector('code');
		if (!code) continue;

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'code-copy-btn';
		button.setAttribute('data-code-copy', '');
		button.textContent = 'Copy';

		const onClick = async () => {
			const text = code.textContent || '';
			let copied = false;
			if (navigator.clipboard?.writeText) {
				try {
					await navigator.clipboard.writeText(text);
					copied = true;
				} catch {
					copied = false;
				}
			}
			if (!copied) copied = copyWithFallback(text);

			button.textContent = copied ? 'Copied' : 'Retry';
			window.setTimeout(() => {
				button.textContent = 'Copy';
			}, 1200);
		};

		button.addEventListener('click', onClick);
		block.appendChild(button);
		cleanups.push(() => {
			button.removeEventListener('click', onClick);
			button.remove();
			delete block.dataset.copyReady;
		});
	}

	return () => {
		for (const fn of cleanups) fn();
	};
}
