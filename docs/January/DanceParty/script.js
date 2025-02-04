const gameState = {
	mode: "rhythm",
	score: 0,
	combo: 0,
	particles: [],
	rumble: false
};

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function createParticles(x, y) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	for (let i = 0; i < 20; i++) {
		gameState.particles.push({
			x: (x - rect.left) * scaleX,
			y: (y - rect.top) * scaleY,
			color: `hsl(${Math.random() * 360}, 100%, 50%)`,
			size: Math.random() * 5 + 2,
			vx: (Math.random() - 0.5) * 10,
			vy: (Math.random() - 2) * 10,
			life: 1
		});
	}
}

function updateParticles() {
	gameState.particles = gameState.particles.filter((p) => {
		p.x += p.vx;
		p.y += p.vy;
		p.vy += 0.5;
		p.life -= 0.02;
		return p.life > 0;
	});
}

function updateNotes() {
	const now = Date.now();
	game.notes = game.notes.filter((note) => {
		const rect = note.getBoundingClientRect();
		if (rect.top > window.innerHeight) {
			if (!note.dataset.outTime) {
				note.dataset.outTime = now;
			} else if (now - note.dataset.outTime >= 2000) {
				// 2-second delay
				note.remove();
				return false;
			}
		} else {
			delete note.dataset.outTime;
		}
		return true;
	});
}

function triggerRumble() {
	if (gameState.rumble) return;
	gameState.rumble = true;
	document.body.style.transform = "translate(5px, 5px)";
	setTimeout(() => {
		document.body.style.transform = "translate(-5px, -5px)";
		setTimeout(() => {
			document.body.style.transform = "";
			gameState.rumble = false;
		}, 50);
	}, 50);
}

function updateHUD() {
	document.getElementById("combo").textContent = gameState.combo;
	document.querySelector(".meter-bar").style.width = `${Math.min(
		gameState.combo * 5,
		100
	)}%`;
	document.getElementById("score").textContent = gameState.score;
}

class RhythmGame {
	constructor() {
		this.notes = [];
		this.spawnInterval = null;
		this.audio = document.getElementById("game-audio");
		this.audio.crossOrigin = "anonymous";
		this.audio.loop = false;
		this.audio.volume = 0.5;
		this.mediaPath = "https://archive.org/download/mythium/";
		this.tracks = [
			{
				track: 1,
				name: "All This Is - Joe L.'s Studio",
				duration: "2:46",
				file: "JLS_ATI"
			}
		];
		this.currentTrack = 0;
		this.extension = "";
		if (this.audio.canPlayType("audio/mpeg")) {
			this.extension = ".mp3";
		} else if (this.audio.canPlayType("audio/ogg")) {
			this.extension = ".ogg";
		}
		this.beatMap = [
			92,
			464,
			789,
			1114,
			1439,
			1787,
			2159,
			2461,
			2786,
			3134,
			3506,
			3808,
			4133,
			4504,
			4876,
			5224,
			5572,
			5921,
			6292,
			6594,
			6942,
			7291,
			7639,
			7987,
			8312,
			8637,
			8962,
			9287,
			9613,
			9961,
			10263,
			10588,
			10890,
			11215,
			11517,
			11865,
			12190,
			12492,
			12840,
			13165,
			13490,
			13815,
			14140,
			14442,
			14767,
			15092,
			15418,
			15766,
			16068,
			16416,
			16718,
			17043,
			17368,
			17693,
			18018,
			18343,
			18645,
			18970,
			19272,
			19574,
			19899,
			20224,
			20526,
			20874,
			21176,
			21501,
			21803,
			22105,
			22407,
			22732,
			23034,
			23359,
			23661,
			23962,
			24264,
			24566,
			24868,
			25170,
			25472,
			25774,
			26076,
			26377,
			26679,
			26981,
			27283,
			27585,
			27887,
			28189,
			28467,
			28769,
			29071,
			29373,
			29675,
			29976,
			30255,
			30557,
			30859,
			31161,
			31463,
			31741,
			32043,
			32345,
			32647,
			32949,
			33274,
			33599,
			33901,
			34202,
			34528,
			34829,
			35131,
			35456,
			35758,
			36060,
			36385,
			36710,
			37012,
			37337,
			37639,
			37941,
			38266,
			38568,
			38893,
			39195,
			39497,
			39799,
			40124,
			40449,
			40751,
			41076,
			41401,
			41703,
			42004,
			42329,
			42655,
			42956,
			43281,
			43607,
			43932,
			44280,
			44605,
			44930,
			45255,
			45580,
			45905,
			46207,
			46532,
			46904,
			47299,
			47624,
			47972,
			48343,
			48692,
			49040,
			49388,
			49737,
			50062,
			50410,
			50782,
			51153,
			51525,
			51896,
			52268,
			52616,
			52987,
			53336,
			53707,
			54032,
			54381,
			54706,
			55031,
			55333,
			55681,
			56029,
			56401,
			56772,
			57144,
			57515,
			57887,
			58235,
			58607,
			58932,
			59280,
			59628,
			59977,
			60302,
			60627,
			60952,
			61254,
			61556,
			61881,
			62183,
			62484,
			62786,
			63088,
			63413,
			63761,
			64133,
			64481,
			64830,
			65155,
			65526,
			65875,
			66223,
			66548,
			66873,
			67198,
			67500,
			67802,
			68127,
			68452,
			68754,
			69079,
			69404,
			69729,
			70054,
			70402,
			70727,
			71053,
			71401,
			71749,
			72074,
			72399,
			72724,
			73073,
			73421,
			73746,
			74071,
			74396,
			74745,
			75070,
			75395,
			75697,
			76022,
			76347,
			76672,
			76997,
			77345,
			77670,
			77995,
			78297,
			78622,
			78947,
			79272,
			79598,
			79946,
			80271,
			80596,
			80921,
			81269,
			81594,
			81920,
			82221,
			82570,
			82895,
			83197,
			83545,
			83870,
			84195,
			84520,
			84822,
			85124,
			85472,
			85797,
			86122,
			86447,
			86749,
			87074,
			87376,
			87701,
			88026,
			88351,
			88677,
			89002,
			89327,
			89629,
			89930,
			90232,
			90581,
			90906,
			91207,
			91533,
			91858,
			92183,
			92508,
			92833,
			93158,
			93483,
			93808,
			94180,
			94551,
			94923,
			95271,
			95596,
			95921,
			96246,
			96571,
			96896,
			97221,
			97523,
			97872,
			98197,
			98522,
			98824,
			99149,
			99451,
			99776,
			100101,
			100426,
			100751,
			101053,
			101355,
			101680,
			102005,
			102330,
			102655,
			102957,
			103282,
			103607,
			103932,
			104234,
			104559,
			104884,
			105186,
			105511,
			105836,
			106161,
			106463,
			106765,
			107090,
			107392,
			107694,
			107996,
			108321,
			108646,
			108948,
			109249,
			109574,
			109900,
			110201,
			110503,
			110828,
			111130,
			111432,
			111734,
			112059,
			112361,
			112663,
			112988,
			113313,
			113615,
			113940,
			114242,
			114544,
			114869,
			115194,
			115496,
			115821,
			116146,
			116448,
			116773,
			117098,
			117423,
			117725,
			118050,
			118375,
			118700,
			119002,
			119327,
			119629,
			119954,
			120279,
			120581,
			120952,
			121301,
			121626,
			121927,
			122229,
			122554,
			122880,
			123228,
			123599,
			123948,
			124319,
			124667,
			125016,
			125364,
			125689,
			126037,
			126386,
			126734,
			127082,
			127407,
			127709,
			128011,
			128313,
			128615,
			128963,
			129311,
			129660,
			130008,
			130356,
			130681,
			131030,
			131355,
			131657,
			131982,
			132330,
			132655,
			132980,
			133305,
			133654,
			133979,
			134350,
			134698,
			135070,
			135418,
			135790,
			136138,
			136486,
			136811,
			137137,
			137462,
			137810,
			138158,
			138483,
			138785,
			139087,
			139389,
			139714,
			140039,
			140387,
			140759,
			141107,
			141455,
			141804,
			142152,
			142524,
			142872,
			143220,
			143568,
			143894,
			144219,
			144544,
			144846,
			145171,
			145473,
			145798,
			146123,
			146425,
			146726,
			147028,
			147353,
			147655,
			147980,
			148305,
			148630,
			148932,
			149257,
			149582,
			149908,
			150233,
			150558,
			150860,
			151185,
			151510,
			151835,
			152160,
			152485,
			152833,
			153158,
			153483,
			153785,
			154110,
			154435,
			154760,
			155086,
			155411,
			155736,
			156061,
			156363
		];
	}

	loadTrack(index) {
		this.currentTrack = index;
		this.audio.src = this.mediaPath + this.tracks[index].file + this.extension;
	}

	start() {
		if (audioContext.state === "suspended") {
			audioContext.resume();
		}
		this.loadTrack(this.currentTrack);
		this.audio.currentTime = 0;
		this.audio.play().catch((error) => console.log("Audio play error:", error));
		this.audio.onended = () => {
			if (this.currentTrack + 1 < this.tracks.length) {
				this.currentTrack++;
			} else {
				this.currentTrack = 0;
			}
			this.loadTrack(this.currentTrack);
			this.audio.play();
		};
		this.scheduleNotes();
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}

	scheduleNotes() {
		this.spawnInterval = this.beatMap.map((beatTime) =>
			setTimeout(() => {
				this.createNote(
					["KeyW", "KeyA", "KeyS", "KeyD"][Math.floor(Math.random() * 4)]
				);
			}, beatTime)
		);
	}

	checkInput(key) {
		const hitZone = document.querySelector(".hit-zone");
		const hitRect = hitZone.getBoundingClientRect();
		const candidate = this.notes.find((note) => {
			if (note.dataset.key !== key) return false;
			const noteRect = note.getBoundingClientRect();
			const noteCenterX = noteRect.left + noteRect.width / 2;
			const noteCenterY = noteRect.top + noteRect.height / 2;
			return (
				noteCenterX >= hitRect.left &&
				noteCenterX <= hitRect.right &&
				noteCenterY >= hitRect.top &&
				noteCenterY <= hitRect.bottom
			);
		});
		if (candidate) {
			console.log("Note hit:", candidate);
			candidate.classList.add("hit");
			const noteRect = candidate.getBoundingClientRect();
			const hitCenterY = hitRect.top + hitRect.height / 2;
			const noteCenterY = noteRect.top + noteRect.height / 2;
			const diff = Math.abs(noteCenterY - hitCenterY);
			let accuracyPoints = 10;
			gameState.combo++;
			gameState.score += accuracyPoints * gameState.combo;
			console.log("Score:", gameState.score, "Combo:", gameState.combo);
			setTimeout(() => candidate.remove(), 200);
			const candidateRect = candidate.getBoundingClientRect();
			createParticles(candidateRect.left, candidateRect.top);
			triggerRumble();
			this.notes = this.notes.filter((n) => n !== candidate);
			updateHUD();
		} else {
			console.log("No note hit");
			gameState.combo = 0;
			updateHUD();
		}
	}

	createNote(key) {
		const note = document.createElement("div");
		note.className = "note";
		note.textContent = { KeyW: "W", KeyA: "A", KeyS: "S", KeyD: "D" }[key];
		note.dataset.key = key;
		document.querySelector(".rhythm-track").appendChild(note);
		this.notes.push(note);
		console.log("Note created:", note); // Log to verify note creation
	}
}

document.addEventListener("keydown", (e) => {
	if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
		game.checkInput(e.code);
	}
});

const game = new RhythmGame();

document.querySelectorAll(".mode-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		document.getElementById("main-menu").classList.add("hidden");
		document.querySelector(".game-container").classList.remove("hidden");
	});
});

document.getElementById("start-game").addEventListener("click", () => {
	document.getElementById("start-game").classList.add("hidden");
	game.start();
});

function updateHUD() {
	document.getElementById("combo").textContent = gameState.combo;
	document.querySelector(".meter-bar").style.width = `${Math.min(
		gameState.combo * 5,
		100
	)}%`;
	document.getElementById("score").textContent = gameState.score;
}

function gameLoop() {
	updateParticles();
	updateNotes();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameState.particles.forEach((p) => {
		ctx.fillStyle = p.color;
		ctx.globalAlpha = p.life;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();
	});
	requestAnimationFrame(gameLoop);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
gameLoop();

function resetGame() {
	gameState.score = 0;
	gameState.combo = 0;
	gameState.particles = [];
	game.notes.forEach((note) => note.remove());
	game.notes = [];
	game.spawnInterval.forEach(clearTimeout);
	updateHUD();
}

function handleExit() {
	game.stop();
	document.querySelector(".game-container").classList.add("hidden");
	document.getElementById("main-menu").classList.remove("hidden");
	document.getElementById("start-game").classList.remove("hidden");
	resetGame();
}

document.querySelector(".exit-btn").addEventListener("click", handleExit);
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") handleExit();
});

// Audio Visualizer
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(game.audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

function drawVisualizer() {
	requestAnimationFrame(drawVisualizer);
	let dataArray = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(dataArray);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#ff6b6b";
	dataArray.forEach((value, i) => {
		ctx.fillRect(i * 3, canvas.height - value, 2, value);
	});
}

drawVisualizer();
