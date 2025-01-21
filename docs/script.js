const repoOwner = "JayNightmare";
const repoName = "CodePen-Challenges";
const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

async function fetchChallenges() {
  const response = await fetch(apiURL);
  const files = await response.json();

  if (!Array.isArray(files)) return;

  const container = document.getElementById("challenge-list");
  const detailsSection = document.getElementById("file-list");

  for (const file of files) {
    if (file.type === "dir".includes(file.name)) {
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
            ? `<button class="view-challenge" data-url="https://${repoOwner}.github.io/${repoName}/${file.name}/">
                View Challenge
              </button>`
            : `<button class="view-code" data-url="${file.url}">
                View Code
              </button>`
        }
      `;
      container.appendChild(card);

      // Add event listeners for buttons
      card.querySelector("button").addEventListener("click", async (e) => {
        if (e.target.classList.contains("view-challenge")) {
          window.open(e.target.dataset.url, "_blank");
        } else if (e.target.classList.contains("view-code")) {
          const response = await fetch(e.target.dataset.url);
          const contents = await response.json();

          // Display folder contents
          detailsSection.innerHTML = contents
            .map(
              item => `<li>
                <a href="${item.download_url || item.html_url}" target="_blank">${item.name}</a>
              </li>`
            )
            .join("");
        }
      });
    }
  }
}

fetchChallenges().catch(error => {
  console.error("Failed to fetch repository contents:", error);
});
