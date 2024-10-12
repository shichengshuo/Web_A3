const DB = require('./crowdfunding_db.js');
// 处理fundraiser添加category
async function fundraiserGetCategory(fundraiser) {
    if (fundraiser.length) {
        const [categorys] = await DB.query('SELECT * FROM CATEGORY');
        return fundraiser.map(item => {
            item['CATEGORY'] = categorys.find(category => category.CATEGORY_ID === item.CATEGORY_ID);
            return item;
        });
    }
    return fundraiser;
}
// 处理donations添加fundraiser
async function donationGetFundraiser(donations) {
    if (donations.length) {
        const [fundraisers] = await DB.query('SELECT * FROM FUNDRAISER');
        return donations.map(item => {
            item['FUNDRAISER'] = fundraisers.find(fundraiser => fundraiser.FUNDRAISER_ID === item.FUNDRAISER_ID);
            return item;
        });
    }
    return donations;
}
const handler = {
    fundraiserGetCategory: fundraiserGetCategory,
    donationGetFundraiser: donationGetFundraiser
}
module.exports = handler