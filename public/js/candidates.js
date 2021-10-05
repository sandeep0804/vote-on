/**
 * Global variables
 */
let elections = [];

/**
 * Run on page load
 */
getElections();

/**
 * Get all candidates
 */
function getCandidates() {
  fetch('/api/candidates')
    .then((res) => res.json())
    .then((data) => {
      populateTable(data);
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Get all elections
 */
function getElections() {
  fetch('/api/elections')
    .then((res) => res.json())
    .then((data) => {
      elections = data;
      populateDropdownList(data);
      // Run on page load
      getCandidates();
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Populate table
 */
function populateTable(data) {
  const table = document.getElementById('tableCandidates');
  if (data.length > 0) {
    table.innerHTML = data.map((item, index) => getTableRow(item, index)).join('');
  } else {
    table.innerHTML = getTableEmptyRow();
  }
}

/**
 * Populate dropdown list
 */
function populateDropdownList(data) {
  const dropdownList = document.getElementById('listElections');
  if (data.length > 0) {
    dropdownList.innerHTML = [
      '<option value="">No election selected</option>',
      ...data.map((item) => `<option value="${item._id}">${item.name}</option>`),
    ].join('');
  } else {
    dropdownList.innerHTML = `<option value="">No elections available</option>`;
  }
}

/**
 * Table row template
 */
function getTableRow(data, index) {
  return `
    <tr>
      <td>${index + 1}</td>
      <td>${data.firstName} ${data.lastName}</td>
      <td>${data.party}</td>
      <td>
        <select class="form__control" onchange="handleChangeElection(event, '${data._id}')">
          ${getElectionOptions(data.election._id)}
        </select>
      </td>
      <td>
        <div class="table__actions">
          <button type="button" class="btn btn--link" onclick="handleDeleteCandidate('${data._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Get dropdown list
 */
function getElectionOptions(electionId) {
  if (elections.length > 0) {
    return [
      '<option value="">No election selected</option>',
      ...elections.map(
        (item) => `<option value="${item._id}"${electionId === item._id ? ' selected' : ''}>${item.name}</option>`,
      ),
    ].join('');
  } else {
    return `<option value="">No elections available</option>`;
  }
}

/**
 * Table empty row template
 */
function getTableEmptyRow() {
  return `
    <tr>
      <td colspan="5" class="text-muted text-center">No candidates available</td>
    </tr>
  `;
}

/**
 * Handle change election
 */
function handleChangeElection(event, candidateId) {
  const value = event.target.value;
  if (value && value !== '') {
    fetch(`/api/candidates/${candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        election: value,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        getCandidates();
      })
      .catch((ex) => {
        toast.error(ex.message);
      });
  }
}

/**
 * Handle delete candidate
 */
async function handleDeleteCandidate(candidateId) {
  const { isConfirmed } = await promptDelete('Delete Candidate');
  if (isConfirmed) {
    fetch(`/api/candidates/${candidateId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Candidate deleted');
          getCandidates();
        }
      })
      .catch((ex) => {
        toast.error(ex.message);
      });
  }
}

/**
 * Handle add new candidate
 */
function handleNewCandidate(event) {
  // Prevent reloading the page
  event.preventDefault();

  // Send a POST request to the server
  fetch('/api/candidates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      party: event.target.party.value,
      election: event.target.listElections.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        modal('modalNewCandidate').close();
        toast.success('Candidate added');
        getCandidates();
      }
    })
    .catch((ex) => {
      toast.error(ex.message);
    })
    .finally(() => {
      event.target.reset();
    });
}
