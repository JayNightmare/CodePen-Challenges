var text = "Languages I can write in:";
var speed = 125;
var typingTimeout;

function typeWriter(i, txt) {
	if (i < txt.length) {
		document.getElementById("animated-text").innerHTML += txt.charAt(i);
		i++;
		typingTimeout = setTimeout(function () {
			typeWriter(i, txt);
		}, speed);
	}
}

document.getElementById("top-image").setAttribute("draggable", false);

const cards = document.querySelectorAll(".card-container");

cards.forEach((card) => {
	card.addEventListener("mouseenter", () => {
		clearTimeout(typingTimeout);
		document.getElementById("animated-text").innerHTML = "";
		typeWriter(0, text);
	});

	card.addEventListener("mousemove", (e) => {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((y - centerY) / centerY) * 10;
		const rotateY = ((centerX - x) / centerX) * 10;

		card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
		card.style.boxShadow = `${-rotateY * 2}px ${
			rotateX * 2
		}px 20px rgba(255, 255, 255, 0.1)`;
	});

	card.addEventListener("mouseleave", () => {
		clearTimeout(typingTimeout);
		document.getElementById("animated-text").innerHTML = "";
		card.style.transform = "perspective(1000px) scale(1)";
	});

	card.addEventListener("click", (e) => {
		e.stopPropagation();
		card.classList.toggle("expanded");
	});
});

document.addEventListener("click", () => {
	cards.forEach((card) => {
		card.classList.remove("expanded");
	});
});

VANTA.NET({
	el: "#particles-js",
	mouseControls: true,
	touchControls: true,
	scale: 0.5,
	scaleMobile: 1,
	color: "#fff",
	backgroundColor: 0x000000,
	points: 10,
	maxDistance: 8
});

/*
let confettiTimeout;
document
	.querySelector(".card-container")
	.addEventListener("mouseenter", (e) => {
		if (!confettiTimeout) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: {
					x: e.clientX / window.innerWidth,
					y: e.clientY / window.innerHeight
				},
				colors: ["#fb2576", "#332fd0", "#ffffff"]
			});
			confettiTimeout = setTimeout(() => {
				confettiTimeout = null;
			}, 1000);
		}
	});
*/