const category = document.getElementById('category')
// Categorie in render form
function renderCategorieList(data) {
    for (const item of data) {
        const option = document.createElement('option')
        option.value = item.CATEGORY_ID
        option.textContent = item.NAME
        category.appendChild(option)
    }
}
// get Categorie
ajax.get('/categories').then(data => renderCategorieList(data))
// get Fundraisers
function getFundraisersTable() {
    ajax.get('/fundraisers').then(data => renderFundraisersTable(data))
}


const fundraiserTitle = document.getElementById('fundraiserTitle')
const inputs = document.querySelectorAll('.input')
const overlay = document.getElementById('overlay')







// close form
function closeForm() {
    overlay.className = '';
    for (const item of inputs) {
        if (item.type !== 'checkbox') {
            item.value = ''
        } else {
            item.checked = false
        }
    }
}
// Data for Fundraisers needs to be edited
let editFundraiserData = null;

// Save Fundraisers
const fundraisersSave = document.getElementById('fundraisersSave')
fundraisersSave.onclick = async () => {
    const data = {}
    for (const item of inputs) {
        if (item.type == 'checkbox') {
            data[item.name] = Number(item.checked)
            continue
        }
        if (!item.value && item.name != 'CURRENT_FUNDING') {
            return alert(`${item.name} cannot be empty !`)
        }
        data[item.name] = item.value

    }
    if (fundraiserTitle.innerHTML === "Create") {
        const message = await ajax.post(`/fundraiser`, data);
        alert(message)
    } else {
        const message = await ajax.put(`/fundraiser/${editFundraiserData.FUNDRAISER_ID}`, data);
        alert(message)
    }
    getFundraisersTable(); // Refresh list
    closeForm()
}


// edit Fundraisers
const editFundraiser = async (id) => {
    fundraiserTitle.innerHTML = "Edit"
    editFundraiserData = await ajax.get(`/fundraiser/${id}`);
    editFundraiserData.ACTIVE = Boolean(editFundraiserData.ACTIVE)
    for (const item of inputs) {
        if (item.type == 'checkbox') {
            item.checked = editFundraiserData[item.name]
        } else {
            item.value = editFundraiserData[item.name]
        }
    }
    overlay.className = 'open';
};


// Open form
const createEl = document.getElementById('fundraisersCreate')
createEl.onclick = function () {
    fundraiserTitle.innerText = "Create"
    overlay.className = 'open';
}

// delete Fundraisers
const deleteFundraiser = (id) => {
    if (window.confirm('Confirm delete?')) {
        ajax.delete(`/fundraiser/${id}`).then(message => {
            alert(message)
            getFundraisersTable(); // Refresh the list
        });
    }
};


// Fill in the Fundraisers form
const fundraisersTable = document.getElementById('fundraiserTable')
const renderFundraisersTable = (fundraisers) => {
    fundraisersTable.innerHTML = ''; // Clear the current table
    fundraisers.forEach(fundraiser => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fundraiser.FUNDRAISER_ID}</td>
            <td>${fundraiser.ORGANIZER}</td>
            <td class='Caption'>${fundraiser.CAPTION}</td>
            <td>${fundraiser.CATEGORY.NAME}</td>
            <td>${fundraiser.CITY}</td>
            <td>$${fundraiser.TARGET_FUNDING}</td>
            <td>$${fundraiser.CURRENT_FUNDING}</td>
            <td>
                <button class="edit" data-id="${fundraiser.FUNDRAISER_ID}">edit</button>
                <button class="delete" data-id="${fundraiser.FUNDRAISER_ID}">delete</button>
            </td>
        `;
        fundraisersTable.appendChild(row);
    });
    // Add an event to the button
    const edits = document.querySelectorAll('.edit');
    const deletes = document.querySelectorAll('.delete');
    edits.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editFundraiser(id);
        });
    });
    deletes.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteFundraiser(id);
        });
    });
};
// get
getFundraisersTable()
