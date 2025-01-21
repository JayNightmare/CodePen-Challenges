const hitbox = document.getElementById("hitbox");
const start = document.getElementById("start");

let holdStart = 0;
let holdDuration = 0;
let squishTimer = null;
let canTriggerJump = true;
let totalStylePoints = 0;

hitbox.addEventListener("mousedown", () => {
	holdStart = Date.now();
	canTriggerJump = true;

	start.style.animation = "squish 0.3s ease-in-out forwards";

	squishTimer = setTimeout(() => {
		canTriggerJump = false;
		triggerJump(1.5);
	}, 1000);
});

hitbox.addEventListener("mouseup", () => {
	if (!canTriggerJump) return;

	clearTimeout(squishTimer);

	holdDuration = Date.now() - holdStart;

	let intensity;
	if (holdDuration < 300) { intensity = 0.5; } 
	else { intensity = Math.min(holdDuration / 1000, 1.5); }

	triggerJump(intensity);
});

function triggerJump(intensity) {
	// Determine animation properties based on intensity
	const maxHeight = -10 - intensity * 30; // Higher jump for longer holds
	const maxScale = 1 + intensity * 2; // Bigger scaling for longer holds
	const spinSpeed = 360 * (1 + intensity); // Faster spin for longer holds

	// Play jump animation
	start.style.animation = `jump ${1 + intensity}s ease-in-out`;

	// Inject dynamic keyframes
	const styleSheet = document.styleSheets[0];
	styleSheet.insertRule(`
		@keyframes jump {
			0% {
				transform: scaleX(1.3) scaleY(0.2) translateY(250px);
			}
			20% {
				transform: scaleX(0.8) scaleY(1.4) translateY(0);
			}
			50% {
				transform: translateY(${maxHeight}vh) rotateY(${spinSpeed}deg) scale(${maxScale});
				filter: brightness(2);
			}
			100% {
				transform: scaleX(1) scaleY(1) translateY(0);
				filter: brightness(1);
			}
		}
	`, styleSheet.cssRules.length);

	// Trigger sparkles and style points
	const sparkleCount = 10 + Math.floor(intensity * 20); // More sparkles for longer holds
	setTimeout(() => {
		createSparkles(sparkleCount);
		createStylePoints(intensity); // Pass intensity to style points
	}, (1 + intensity) * 500);

	// Reset animation after jump
	start.addEventListener("animationend", () => {
		start.style.animation = "idle 2s infinite";
	}, { once: true });
}

function createSparkles(count) {
	for (let i = 0; i < count; i++) {
		const sparkle = document.createElement("div");
		sparkle.className = "sparkle";

		const angle = Math.random() * Math.PI * 2;
		sparkle.style.setProperty("--dx", Math.cos(angle));
		sparkle.style.setProperty("--dy", Math.sin(angle));

		const rect = start.getBoundingClientRect();
		sparkle.style.left = `${rect.left + rect.width / 2}px`;
		sparkle.style.top = `${rect.top + rect.height / 2}px`;

		document.body.appendChild(sparkle);

		sparkle.addEventListener("animationend", () => sparkle.remove());
	}
}

function initializeStylePointsMeter() {
	const meter = document.createElement("div");
	meter.id = "stylePointsMeter";
	meter.textContent = `Style Points: ${totalStylePoints}`;
	meter.style.position = "fixed";
	meter.style.top = "10px";
	meter.style.right = "10px";
	meter.style.backgroundColor = "#000";
	meter.style.color = "#fff";
	meter.style.padding = "10px 20px";
	meter.style.borderRadius = "10px";
	meter.style.fontFamily = "Arial, sans-serif";
	meter.style.fontSize = "1.2rem";
	meter.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
	document.body.appendChild(meter);
}

function updateStylePointsMeter(points) {
	totalStylePoints += points;
	const meter = document.getElementById("stylePointsMeter");
	meter.textContent = `Style Points: ${totalStylePoints}`;
}

initializeStylePointsMeter();

function createStylePoints(intensity) {
	let points = 0;
	let message = "";
	let color = "";

	if (intensity <= 0.5) {
		points = Math.floor(Math.random() * 90) + 10; // 10–100
		const lowMessages = ["Good Job!", "Nice!", "Decent!", "Okay!"];
		message = lowMessages[Math.floor(Math.random() * lowMessages.length)];
		color = "green";
	} else if (intensity <= 1) {
		points = Math.floor(Math.random() * 290) + 110; // 110–400
		const midMessages = ["SICK!!", "Amazing!", "Stylish!", "Radical!"];
		message = midMessages[Math.floor(Math.random() * midMessages.length)];
		color = "orange";
	} else {
		points = Math.floor(Math.random() * 590) + 410; // 410–1000
		const highMessages = ["REALLY?!", "Insane!!", "Unbelievable!", "Epic!"];
		message = highMessages[Math.floor(Math.random() * highMessages.length)];
		color = "red";
	}

	updateStylePointsMeter(points);

	const stylePoints = document.createElement("div");
	stylePoints.textContent = `${points} - ${message}`;
	stylePoints.style.position = "absolute";
	stylePoints.style.color = color;
	stylePoints.style.fontSize = "1.5rem";
	stylePoints.style.fontWeight = "bold";
	stylePoints.style.top = `${start.getBoundingClientRect().top}px`;
	stylePoints.style.left = `${start.getBoundingClientRect().left}px`;
	stylePoints.style.transform = "translate(-50%, -50%)";
	stylePoints.style.animation = "stylePointsAnim 1s ease-out forwards";

	document.body.appendChild(stylePoints);

	stylePoints.addEventListener("animationend", () => stylePoints.remove());
}

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
	@keyframes stylePointsAnim {
		0% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
		100% {
			transform: translate(-50%, -100%) scale(1.5);
			opacity: 0;
		}
	}
`, styleSheet.cssRules.length);
