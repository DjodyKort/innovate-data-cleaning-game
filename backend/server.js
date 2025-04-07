// ========= Declaring Variables =========
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// ========= Database Setup =========
const {
    dbPath,
    getAllChallenges,
    getChallengeDirtyData,
    getChallengeCleanData,
    getHighScores,
    closeDatabase,
    createChallenges,
    createTablesIfNotExist,
    insertChallenge,
    insertData,
    addChallenge1,
    addChallenge2,
    addChallenge3,
    addChallenge4,
    addChallenge5
} = require('./functions/database');

// ========= Start of Express =========
app.use(cors());
app.use(express.json());

test = createChallenges()

// ==== Routes ====
// API endpoints
app.get('/api/challenges', async (req, res) => {
    try {
        const challenges = await getAllChallenges();
        res.json(challenges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get('/api/challenge/:id', async (req, res) => {
    const challengeId = parseInt(req.params.id);

    try {
        const dirtyData = await getChallengeDirtyData(challengeId);

        if (dirtyData.length === 0) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        res.json({
            id: challengeId,
            dirtyData: dirtyData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/challenge/:id/submit', async (req, res) => {
    const challengeId = parseInt(req.params.id);
    const userSubmission = req.body.cleanedData;

    try {
        const cleanData = await getChallengeCleanData(challengeId);

        if (cleanData.length === 0) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        // Compare user submission with clean data
        const results = userSubmission.map(item => {
            const correctItem = cleanData.find(c => c.id === item.id);
            const errors = [];

            for (const key in correctItem) {
                if (item[key] !== correctItem[key]) {
                    errors.push(key);
                }
            }

            return {
                id: item.id,
                correct: errors.length === 0,
                errors: errors
            };
        });

        const score = results.filter(r => r.correct).length;
        const totalPossible = cleanData.length;

        res.json({
            score,
            totalPossible,
            percentage: Math.round((score / totalPossible) * 100),
            results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get('/api/highscores/', async (req, res) => {
    try {
        const highscores = await getHighScores();
        res.json(highscores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// ==== Start Backend Server ====
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database path: ${dbPath}`);
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await closeDatabase();
        console.log('Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing database:', err);
        process.exit(1);
    }
});