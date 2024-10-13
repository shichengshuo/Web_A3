const links = document.querySelectorAll('.link');
const currentPath = window.location.pathname.split('/').pop();
links.forEach(link => {
    if (link.getAttribute('href').includes(currentPath)) {
        link.classList.add('active');
    }
});
// 渲染
const fundraiserList = document.getElementById('cardList')
function renderFundraiserList(fundraisers, showDetail = true, showDonate = true) {
    fundraiserList.innerHTML = '';
    if (fundraisers.length === 0) {
        fundraiserList.innerHTML = '<p class="red">Fundraisers is Empty</p>';
        return;
    }
    fundraisers.forEach(fundraiser => {
        const fundraiserCard = document.createElement('div');
        fundraiserCard.className = 'card';
        fundraiserCard.innerHTML = `
        <img src="./static/images/${fundraiser.FUNDRAISER_ID % 5}.png" alt="" class="cover">
        <div class="cont">
            <h3>${fundraiser.CAPTION}</h3>
            <p>Organizer: ${fundraiser.ORGANIZER}</p>
            <p>Category: ${fundraiser.CATEGORY.NAME}</p>
            <p>Target Funding: $${fundraiser.TARGET_FUNDING}</p>
            <p>Current Funding: $${fundraiser.CURRENT_FUNDING}</p>
            <p>City: ${fundraiser.CITY}</p>
            <div>
                <a href="./fundraiser.html?id=${fundraiser.FUNDRAISER_ID}" target="_blank" style='${showDetail ? "" : "display:none"}'>
                    Detail
                </a>
                <a href="./donation.html?id=${fundraiser.FUNDRAISER_ID}" target="_blank" style='${showDonate ? "" : "display:none"}'>
                    Donation
                </a>
            </div>
        `;
        fundraiserList.appendChild(fundraiserCard);
    });
}
function renderCategorieList(data) {
    const category = document.getElementById('category')
    for (const item of data) {
        const option = document.createElement('option')
        option.value = item.CATEGORY_ID
        option.textContent = item.NAME
        category.appendChild(option)
    }
}
function initHome() {
    ajax.get('/fundraisers').then(data => renderFundraiserList(data))
}

// 搜索的内容
const searchForm = {
    organizer: document.getElementById('organizer'),
    city: document.getElementById('city'),
    category: document.getElementById('category'),
}
// 搜索
function searchFundraisers() {
    const { organizer, city, category } = searchForm
    if (!organizer.value && !city.value && !category.value) {
        alert('Search content cannot be empty!');
        return;
    }
    ajax.get(`/search?organizer=${organizer.value}&city=${city.value}&category=${category.value}`)
        .then(data => renderFundraiserList(data))
}
function reset() {
    for (const key in searchForm) {
        searchForm[key].value = "";
    }
    ajax.get('/fundraisers').then(data => renderFundraiserList(data))
}
// 搜索
function initSearch() {
    ajax.get('/fundraisers').then(data => renderFundraiserList(data))
    ajax.get('/categories').then(data => renderCategorieList(data))
}
// detail
const urlParams = new URLSearchParams(window.location.search);
const fundraiserId = urlParams.get('id');
const donationList = document.getElementById('donationList')
// 渲染捐赠列表
function renderDonationList(donations) {
    donationList.innerHTML = ''; // 清空当前表格
    donations.forEach(donation => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${donation.DONATION_ID}</td> <td>${donation.GIVER}</td> <td>${donation.AMOUNT}</td> <td>${donation.DATE}</td> <td>${donation.FUNDRAISER.CAPTION}</td> `;
        donationList.appendChild(row);
    });
}
// 详情
function initFundraiserDetail() {
    ajax.get(`/fundraiser/${fundraiserId}`).then(data => renderFundraiserList([data], false))
    ajax.get(`/donation/${fundraiserId}`).then(data => renderDonationList(data))
}


let DonationFundraiser = {}
// 捐赠
function createDonation() {
    const inputs = document.querySelectorAll('.input')
    const data = { FUNDRAISER_ID: DonationFundraiser.FUNDRAISER_ID }
    for (const input of inputs) {
        if (!input.value) {
            return alert(`Please input ${input.name}!`)
        }
        if (input.name === 'AMOUNT' && input.value < 5) {
            return alert(`Minimum donation is AUD 5!`)
        }
        data[input.name] = input.value
    }
    ajax.post('/donation', data).then(() => {
        alert(`Thank you for your donation to ${DonationFundraiser.CAPTION}`)
        window.location.reload()
    })
}
// 捐赠页面
function initDonation() {
    ajax.get(`/fundraiser/${fundraiserId}`).then(data => {
        DonationFundraiser = data
        renderFundraiserList([data], false, false)
    })
    ajax.get(`/donations`).then(data => renderDonationList(data))
}

