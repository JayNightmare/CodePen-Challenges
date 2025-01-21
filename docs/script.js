const repoOwner = "JayNightmare";
const repoName = "CodePen-Challenges";
const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/docs`;

async function fetchChallenges() {
  const response = await fetch(apiURL);
  const files = await response.json();

  if (!Array.isArray(files)) return;

  const container = document.getElementById("challenge-list");
  const detailsSection = document.getElementById("file-list");
  const detailsHeader = document.getElementById("details-header");

  for (const file of files) {
    if (file.type === "dir") {
      const folderResponse = await fetch(file.url);
      const folderContents = await folderResponse.json();

      // Check if the folder contains an index.html file
      const hasIndexHtml = folderContents.some(item => item.name === "index.html");

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${file.name}</h3>
        <button class="view-details" data-folder-name="${file.name}" data-has-index="${hasIndexHtml}">
          View Details
        </button>
      `;
      container.appendChild(card);

      // Add event listeners for buttons
      card.querySelector(".view-details").addEventListener("click", () => {
        detailsHeader.textContent = `Details for: ${file.name}`;
        detailsSection.innerHTML = `
          ${
            hasIndexHtml
              ? `<button onclick="window.open('https://${repoOwner}.github.io/${repoName}/${file.name}/', '_blank')">
                    View Challenge
                 </button>`
              : `<p> This folder doesn't contain a deployed challenge</p>`
          }
          <button onclick="window.open('${file.html_url}', '_blank')">
            View Code
          </button>
        `;
      });
    }
  }
}

fetchChallenges().catch(error => {
  console.error("Failed to fetch repository contents:", error);
});
