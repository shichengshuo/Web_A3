const cors = require('cors');
const express = require('express');
const DB = require('./db/crowdfunding_db.js');
const { fundraiserGetCategory } = require('./db/dataHandler.js');
const app = express();
// Processing cross domain
app.use(cors())
// Processing json request data
app.use(express.json());
// api route registration
app.get('/api/hello', (req, res) => {
    res.send('hello')
})
// sort
app.get("/api/categories", async (req, res) => {
    try {
        const [data] = await DB.query("SELECT * FROM CATEGORY");
        res.status(200).send(data);
    } catch (error) {
        res.status(500);
    }
});
// List of fundraising Projects
app.get("/api/fundraisers", async (req, res) => {
    try {
        const [rows] = await DB.query('SELECT * FROM FUNDRAISER');
        const data = await fundraiserGetCategory(rows)
        res.status(200).send(data);
    } catch (err) {
        res.status(500);
    }
});

// Query individual fundraising projects
app.get("/api/fundraiser/:id", async (req, res) => {
    const fundraiserId = req.params.id;
    try {
        const [rows] = await DB.query('SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [fundraiserId]);
        const data = await fundraiserGetCategory(rows)
        res.status(200).send(data[0]);
    } catch (err) {
        res.status(500);
    }
});

// Create new fundraising projects
app.post("/api/fundraiser", async (req, res) => {
    const { ORGANIZER, CAPTION, CATEGORY_ID, CITY, CURRENT_FUNDING, TARGET_FUNDING } = req.body;
    try {
        const [result] = await DB.query('INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, CATEGORY_ID, CITY, CURRENT_FUNDING, TARGET_FUNDING) VALUES (?,?,?,?,?,?)',
            [ORGANIZER, CAPTION, CATEGORY_ID, CITY, CURRENT_FUNDING, TARGET_FUNDING]);
        if (result.affectedRows === 0) {
            return res.status(200).json('Failed to create fundraiser. It may not exist.');
        }
        res.status(200).json('create success!');
    } catch (err) {
        res.status(500);
    }
});

// Update existing fundraising projects
app.put("/api/fundraiser/:id", async (req, res) => {
    const fundraiserId = req.params.id;
    const { ORGANIZER, CAPTION, CATEGORY_ID, CITY, CURRENT_FUNDING, TARGET_FUNDING } = req.body;

    try {
        const [result] = await DB.query(
            `   UPDATE FUNDRAISER SET 
                ORGANIZER = ?,
                CAPTION = ?,
                CATEGORY_ID = ?,
                CITY = ?,
                CURRENT_FUNDING = ?,
                TARGET_FUNDING = ?
                WHERE FUNDRAISER_ID = ?`,
            [ORGANIZER, CAPTION, CATEGORY_ID, CITY, CURRENT_FUNDING, TARGET_FUNDING, fundraiserId]);
        if (result.affectedRows === 0) {
            return res.status(200).json('Failed to update fundraiser. It may not exist.');
        }
        res.status(200).json('update success!');
    } catch (err) {
        res.status(500);
    }
});

// Delete fundraising items
app.delete("/api/fundraiser/:id", async (req, res) => {
    const fundraiserId = req.params.id;
    try {
        // Check for donations
        const [rows] = await DB.query('SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [fundraiserId]);
        if (Number(rows[0].CURRENT_FUNDING)) {
            return res.status(200).json('Unable to delete fundraiser data where donation already exists!');
        }
        // Not deleted
        const [result] = await DB.query('DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [fundraiserId]);
        if (result.affectedRows === 0) {
            return res.status(200).json('Failed to delete fundraiser. It may not exist.');
        }
        res.status(200).json('delete success!');
    } catch (err) {
        res.status(500);
    }
});

// search
app.get("/api/search", async (req, res) => {
    const { organizer, city, category } = req.query;
    let sql = `
        SELECT * FROM FUNDRAISER 
        WHERE (CATEGORY_ID  = ? OR ? = '') 
        AND (CITY = ? OR ? = '') 
        AND (ORGANIZER = ? OR ? = '');
    `
    try {
        const [rows] = await DB.query(sql, [category, category, city, city, organizer, organizer]);
        const data = await fundraiserGetCategory(rows)
        res.status(200).send(data);
    } catch (error) {
        res.status(500);
    }
});
// Get a list of donations corresponding to fundraising
app.get('/api/donations', async (req, res) => {
    const sql = `SELECT * FROM DONATION ORDER BY date DESC`;
    try {
        const [rows] = await DB.query(sql);
        const data = await donationGetFundraiser(rows)
        res.status(200).send(data);
    } catch (err) {
        res.status(500);
    }
});
// Get a list of donations corresponding to fundraising
app.get('/api/donation/:fundraiserId', async (req, res) => {
    const { fundraiserId } = req.params;
    const sql = `SELECT * FROM DONATION WHERE FUNDRAISER_ID = ? ORDER BY date DESC`;
    try {
        const [rows] = await DB.query(sql, [fundraiserId]);
        const data = await donationGetFundraiser(rows)
        res.status(200).send(data);
    } catch (err) {
        res.status(500);
    }

});
// Donation interface
app.post('/api/donation', async (req, res) => {
    const { AMOUNT, GIVER, FUNDRAISER_ID } = req.body;
    const sql = `INSERT INTO DONATION (AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?, ?, ?)`;
    try {
        await DB.query(sql, [AMOUNT, GIVER, FUNDRAISER_ID]);
        res.status(200).json('donation success!');
    } catch (err) {
        res.status(500);
    }
});



// Startup server
app.listen(3000, () => {
    console.log(`server is start`);
});

