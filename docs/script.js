const repoOwner = "JayNightmare";
const repoName = "CodePen-Challenges";
const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

async function fetchChallenges() {
  const response = await fetch(apiURL);
  const files = await response.json();

  if (!Array.isArray(files)) return;

  const container = document.getElementById("challenge-list");
  for (const file of files) {
    if (file.type === "dir" && !["docs", ".github"].includes(file.name)) {
      const folderResponse = await fetch(file.url);
      const folderContents = await folderResponse.json();

      // Check if the folder contains an index.html file
      const hasIndexHtml = folderContents.some(item => item.name === "index.html");

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${file.name}</h3>
        ${
          hasIndexHtml
            ? `<a href="https://${repoOwner}.github.io/${repoName}/${file.name}/" target="_blank">
                View Challenge
              </a>`
            : `<a href="${file.html_url}" target="_blank">
                View Code
              </a>`
        }
      `;
      container.appendChild(card);
    }
  }
}

fetchChallenges().catch(error => {
  console.error("Failed to fetch repository contents:", error);
});
