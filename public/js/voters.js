/**
 * Run on page load
 */
getVoters();

/**
 * Get all voters
 */
function getVoters() {
  fetch('/api/voters')
    .then((res) => res.json())
    .then((data) => {
      populateTable('tableNewVoters', 0, data);
      populateTable('tableApprovedVoters', 1, data);
      populateTable('tableRejectedVoters', -1, data);
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Populate table
 */
function populateTable(selector, status, data) {
  const table = document.getElementById(selector);
  if (data.length > 0) {
    const filtered = data.filter((item) => item.status === status);
    if (filtered.length > 0) {
      table.innerHTML = filtered.map((item, index) => getTableRow(item, index)).join('');
    } else {
      table.innerHTML = getTableEmptyRow();
    }
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
      <td>${data.studentId}</td>
      <td>${data.firstName} ${data.lastName}</td>
      <td>${data.email}</td>
      <td>${new Date(data.createdAt).toLocaleString()}</td>
      <td>
        <div class="table__actions">
          <select class="form__control" onchange="handleChangeVoterStatus(event, '${data._id}')">
            <option value="0"${getSelectedOption(0)}>Pending</option>
            <option value="1"${getSelectedOption(1)}>Approved</option>
            <option value="-1"${getSelectedOption(-1)}>Rejected</option>
          </select>
          <button type="button" class="btn btn--link" onclick="handleDeleteVoter('${data._id}')">Delete</button>
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
      <td colspan="6" class="text-muted text-center">No voters available</td>
    </tr>
  `;
}

/**
 * Handle change voter status
 */
function handleChangeVoterStatus(event, voterId) {
  fetch(`/api/voters/${voterId}`, {
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
      getVoters();
    })
    .catch((ex) => {
      toast.error(ex.message);
    });
}

/**
 * Handle delete voter
 */
async function handleDeleteVoter(voterId) {
  const { isConfirmed } = await promptDelete('Delete Voter');
  if (isConfirmed) {
    fetch(`/api/voters/${voterId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success('Voter deleted');
          getVoters();
        }
      })
      .catch((ex) => {
        toast.error(ex.message);
      });
  }
}
