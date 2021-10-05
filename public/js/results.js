/**
 * WebSocket
 */
const socket = io();
socket.on('vote:refresh', () => getResults());

/**
 * Run on page load
 */
getResults();

/**
 * Get all elections
 */
function getResults() {
  fetch('/api/elections/results')
    .then((res) => res.json())
    .then((data) => {
      populateContainer(data);
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Populate container
 */
function populateContainer(data) {
  const container = document.getElementById('results');
  if (data.length > 0) {
    container.innerHTML = data.map((item) => getContainer(item)).join('');
    data.forEach((item) => populateChart(item));
  } else {
    container.innerHTML = getContainerEmpty();
  }
}

/**
 * Populate chart
 */
function populateChart(election) {
  // Get the candidates
  let candidates = [];
  if (election.candidates.length > 0) {
    candidates = election.candidates.map((item) => `${item.firstName} ${item.lastName}`);
  }

  // Get the votes
  let votes = [];
  if (election.candidates.length > 0) {
    election.candidates.forEach((candidate) => {
      let totalVotes = 0;
      election.votes.forEach((vote) => {
        if (vote.candidate === candidate._id) {
          totalVotes++;
        }
      });
      votes.push(totalVotes);
    });
  }

  // Create bar chart
  createBarChart({
    selector: `chart-${election._id}`,
    label: 'Votes',
    labels: candidates,
    data: votes,
  });
}

/**
 * Container template
 */
function getContainer(data) {
  return `
    <section class="mb-4">
      <h2 class="mb-3">${data.name}</h2>
      <canvas id="chart-${data._id}" height="100%"></canvas>
    </section>
  `;
}

/**
 * Empty container template
 */
function getContainerEmpty() {
  return `<h3 class="p-3 text-muted text-center">No results available</h3>`;
}
