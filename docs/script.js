const repoOwner = "JayNightmare";
const repoName = "CodePen-Challenges";
const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

async function fetchChallenges() {
  const response = await fetch(apiURL);
  const files = await response.json();

  if (!Array.isArray(files)) return;

  const container = document.getElementById("challenge-list");
  files
    .filter(file => file.type === "dir")
    .forEach(folder => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${folder.name}</h3>
        <a href="https://${repoOwner}.github.io/${repoName}/${folder.name}/" target="_blank">
          View Challenge
        </a>
      `;
      container.appendChild(card);
    });
}

fetchChallenges().catch(error => {
  console.error("Failed to fetch repository contents:", error);
});
