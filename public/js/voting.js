/**
 * WebSocket
 */
const socket = io();

/**
 * Run on page load
 */
checkVoter();

/**
 * Check voter existence
 */
function checkVoter() {
  if (getVoter() === null) {
    // Voter not logged in
    window.location = '/';
  } else {
    // Show voter info
    const { firstName, lastName } = getVoter();
    document.getElementById('voterInfo').textContent = `${firstName} ${lastName}`;
    // Get running elections
    getRunningElections();
  }
}

/**
 * Get all running elections
 */
function getRunningElections() {
  fetch(`/api/elections/running`)
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
  const container = document.getElementById('elections');
  if (data.length > 0) {
    container.innerHTML = data.map((item) => getContainer(item)).join('');
  } else {
    container.innerHTML = getContainerEmpty();
  }
}

/**
 * Populate table
 */
function populateTable(electionId, data) {
  if (data.length > 0) {
    return data.map((item, index) => getTableRow(electionId, item, index)).join('');
  } else {
    return getTableEmptyRow();
  }
}

/**
 * Container template
 */
function getContainer(data) {
  return `
    <section class="mb-4">
      <h2 class="mb-3">${data.name}</h2>
      ${getContainerTable(data)}
    </section>
  `;
}

/**
 * Container table
 */
function getContainerTable(data) {
  const votes = data.votes.filter((item) => item.voter === getVoter()._id);
  if (votes.length > 0) {
    return `<h3 class="p-3 text-primary text-center">You have already voted</h3>`;
  } else {
    return `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate</th>
              <th>Party</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${populateTable(data._id, data.candidates)}</tbody>
        </table>
      </div>
    `;
  }
}

/**
 * Empty container template
 */
function getContainerEmpty() {
  return `<h3 class="p-3 text-muted text-center">No elections available</h3>`;
}

/**
 * Table row template
 */
function getTableRow(electionId, data, index) {
  const params = `'${electionId}', '${data._id}'`;

  return `
    <tr>
      <td>${index + 1}</td>
      <td>${data.firstName} ${data.lastName}</td>
      <td>${data.party}</td>
      <td>
        <div class="table__actions">
          <button type="button" class="btn btn--primary" onclick="handleVote(${params})">Vote</button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Table empty row template
 */
function getTableEmptyRow() {
  return `
    <tr>
      <td colspan="4" class="text-muted text-center">No candidates available</td>
    </tr>
  `;
}

/**
 * Handle vote
 */
function handleVote(electionId, candidateId) {
  fetch('/api/votes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      election: electionId,
      candidate: candidateId,
      voter: getVoter()._id,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Vote registered',
          text: 'Your vote was successfully registered',
        });
        socket.emit('vote:new');
        getRunningElections();
      }
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Get voter info from session storage
 */
function getVoter() {
  return JSON.parse(sessionStorage.getItem('voter'));
}
