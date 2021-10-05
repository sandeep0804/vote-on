/**
 * Run on page load
 */
getVotes();

/**
 * Get all votes
 */
function getVotes() {
  fetch('/api/votes')
    .then((res) => res.json())
    .then((data) => {
      populateTable(data);
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Populate table
 */
function populateTable(data) {
  const table = document.getElementById('tableVotes');
  if (data.length > 0) {
    table.innerHTML = data.map((item, index) => getTableRow(item, index)).join('');
  } else {
    table.innerHTML = getTableEmptyRow();
  }
}

/**
 * Table row template
 */
function getTableRow(data, index) {
  return `
    <tr>
      <td>${index + 1}</td>
      <td>
        <div>${data.election.name}</div>
        <small class="text-muted">${data.election.status ? 'Running' : 'Closed'}</small>
      </td>
      <td>
        <div>${data.candidate.firstName} ${data.candidate.lastName}</div>
        <small class="text-muted">${data.candidate.party}</small>
      </td>
      <td>
        <div>${data.voter.firstName} ${data.voter.lastName}</div>
        <small class="text-muted">${data.voter.studentId}</small>
      </td>
      <td>${new Date(data.createdAt).toLocaleString()}</td>
      <td>
        <div class="table__actions">
          <button type="button" class="btn btn--link" onclick="handleDeleteVote('${data._id}')">Delete</button>
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
      <td colspan="6" class="text-muted text-center">No votes available</td>
    </tr>
  `;
}

/**
 * Handle delete vote
 */
async function handleDeleteVote(voteId) {
  const { isConfirmed } = await promptDelete('Delete Vote');
  if (isConfirmed) {
    fetch(`/api/votes/${voteId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Vote deleted');
          getVotes();
        }
      })
      .catch((ex) => {
        toast.error(ex.message);
      });
  }
}

/**
 * Handle delete all votes
 */
async function handleDeleteAllVotes() {
  const { isConfirmed } = await promptDelete('Delete Votes');
  if (isConfirmed) {
    fetch('/api/votes', {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Votes deleted');
          getVotes();
        }
      })
      .catch((ex) => {
        toast.error(ex.message);
      });
  }
}
