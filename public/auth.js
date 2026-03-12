(function () {
	var AUTH_KEY = 'mtgAuth';
	var PASS_HASH = '5de9123588240e236fbdc9ff60f0512a7f2027b7c49597d65f477e1c10001343';

	function isAuthed() {
		return localStorage.getItem(AUTH_KEY) === 'true';
	}

	window.mtgIsAuthed = isAuthed();

	if (!window.mtgIsAuthed) {
		document.documentElement.classList.add('viewer-mode');
	}

	var css = document.createElement('style');
	css.textContent = [
		'.viewer-mode .auth-required { display: none !important; }',
		'.auth-nav-btn { flex: 0 0 auto !important; min-width: 90px; font-size: 13px; }',
		'.login-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; }',
		'.login-modal { background: #1a2835; border: 1px solid #314355; border-radius: 12px; padding: 32px 28px 24px; width: 320px; color: #dbe8f5; }',
		'.login-modal h2 { margin: 0 0 18px; font-size: 20px; }',
		'.login-modal input { width: 100%; padding: 10px 12px; border: 1px solid #314355; border-radius: 6px; background: #111923; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; }',
		'.login-modal input:focus { border-color: #0066cc; }',
		'.login-error { color: #f44; font-size: 13px; margin-top: 8px; }',
		'.login-actions { display: flex; gap: 10px; margin-top: 18px; }',
		'.login-actions button { flex: 1; padding: 10px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }',
		'.login-submit-btn { background: #0066cc; color: #fff; }',
		'.login-submit-btn:hover { background: #0055aa; }',
		'.login-cancel-btn { background: #333; color: #ccc; }',
		'.login-cancel-btn:hover { background: #444; }'
	].join('\n');
	document.head.appendChild(css);

	async function sha256(str) {
		var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
		return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
	}

	document.addEventListener('DOMContentLoaded', function () {
		var nav = document.querySelector('nav.nav');
		if (!nav) return;

		var btn = document.createElement('a');
		btn.href = '#';
		btn.className = 'nav-btn auth-nav-btn';
		btn.textContent = window.mtgIsAuthed ? 'Logout' : 'Login';
		nav.appendChild(btn);

		btn.addEventListener('click', function (e) {
			e.preventDefault();
			if (window.mtgIsAuthed) {
				localStorage.removeItem(AUTH_KEY);
				window.location.reload();
			} else {
				showLoginModal();
			}
		});

		function showLoginModal() {
			var existing = document.getElementById('login-backdrop');
			if (existing) {
				existing.hidden = false;
				var inp = document.getElementById('login-password');
				if (inp) inp.focus();
				return;
			}

			var backdrop = document.createElement('div');
			backdrop.id = 'login-backdrop';
			backdrop.className = 'login-backdrop';
			backdrop.innerHTML =
				'<div class="login-modal">' +
				'<h2>Login</h2>' +
				'<input type="password" id="login-password" placeholder="Password" autocomplete="current-password" />' +
				'<div id="login-error" class="login-error" hidden>Incorrect password</div>' +
				'<div class="login-actions">' +
				'<button id="login-submit" class="login-submit-btn" type="button">Login</button>' +
				'<button id="login-cancel" class="login-cancel-btn" type="button">Cancel</button>' +
				'</div>' +
				'</div>';
			document.body.appendChild(backdrop);

			var pwInput = document.getElementById('login-password');
			var errorEl = document.getElementById('login-error');

			document.getElementById('login-submit').addEventListener('click', async function () {
				var hash = await sha256(pwInput.value);
				if (hash === PASS_HASH) {
					localStorage.setItem(AUTH_KEY, 'true');
					window.location.reload();
				} else {
					errorEl.hidden = false;
				}
			});

			document.getElementById('login-cancel').addEventListener('click', function () {
				backdrop.hidden = true;
				pwInput.value = '';
				errorEl.hidden = true;
			});

			pwInput.addEventListener('keydown', function (e) {
				if (e.key === 'Enter') document.getElementById('login-submit').click();
			});

			backdrop.addEventListener('click', function (e) {
				if (e.target === backdrop) {
					backdrop.hidden = true;
					pwInput.value = '';
					errorEl.hidden = true;
				}
			});

			pwInput.focus();
		}
	});
})();
