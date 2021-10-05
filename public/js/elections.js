/**
 * Run on page load
 */
getElections();

/**
 * Get all elections
 */
function getElections() {
  fetch('/api/elections')
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
  const table = document.getElementById('tableElections');
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
  const getSelectedOption = (value) => (value === data.status ? ' selected' : '');

  return `
    <tr>
      <td>${index + 1}</td>
      <td>${data.name}</td>
      <td>${data.date}</td>
      <td>
        <select class="form__control" onchange="handleChangeElectionStatus(event, '${data._id}')">
        <option value="1"${getSelectedOption(1)}>Running</option>
          <option value="0"${getSelectedOption(0)}>Closed</option>
        </select>
      </td>
      <td>
        <div class="table__actions">
          <button type="button" class="btn btn--link" onclick="handleDeleteElection('${data._id}')">Delete</button>
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
      <td colspan="5" class="text-muted text-center">No elections available</td>
    </tr>
  `;
}

/**
 * Handle change election status
 */
function handleChangeElectionStatus(event, electionId) {
  fetch(`/api/elections/${electionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: +event.target.value,
    }),
  })
    .then((res) => res.json())
    .then(() => {
      getElections();
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Handle delete election
 */
async function handleDeleteElection(electionId) {
  const { isConfirmed } = await promptDelete('Delete Election');
  if (isConfirmed) {
    fetch(`/api/elections/${electionId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Election deleted');
          getElections();
        }
      })
      .catch((ex) => {
        toast.error(ex.message);
      });
  }
}

/**
 * Handle add new election
 */
function handleNewElection(event) {
  // Prevent reloading the page
  event.preventDefault();

  // Send a POST request to the server
  fetch('/api/elections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: event.target.name.value,
      date: event.target.date.value,
      status: +event.target.status.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        toast.error(data.error);
      } else {
        modal('modalNewElection').close();
        toast.success('Election added');
        getElections();
      }
    })
    .catch((ex) => {
      toast.error(ex.message);
    })
    .finally(() => {
      event.target.reset();
    });
}
