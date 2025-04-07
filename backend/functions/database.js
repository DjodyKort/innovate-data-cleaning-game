// ========= Imports =========
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ========= Declaring Variables =========
const dbPath = path.resolve(__dirname, '../data.db');
const db = new sqlite3.Database(dbPath);

// ========= Functions =========
// ==== Challenges ====
/**
 * Get all challenges from the database
 */
function getAllChallenges() {
    return new Promise((resolve, reject) => {
        db.all("SELECT id FROM challenges", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Get dirty data for a specific challenge
 */
function getChallengeDirtyData(challengeId) {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT record_id as id, name, email, phone FROM dirty_data WHERE challenge_id = ?",
            [challengeId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

/**
 * Get clean data for a specific challenge
 */
function getChallengeCleanData(challengeId) {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT record_id as id, name, email, phone FROM clean_data WHERE challenge_id = ?",
            [challengeId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

/**
 * Create challenges with clean and dirty data
 */
function createChallenges() {
    return new Promise(async (resolve, reject) => {
        try {
            // Create tables if they don't exist
            await createTablesIfNotExist();

            // Check if challenges already exist
            const existingChallenges = await getAllChallenges();
            if (existingChallenges.length > 0) {
                console.log('Challenges already exist, skipping creation');
                resolve();
                return;
            }

            // Add challenges
            await addChallenge1();  // Data validity
            await addChallenge2();  // Data Type Validation
            await addChallenge3();  // Data standardization
            await addChallenge4();  // Missing Data Handling
            await addChallenge5();  // Structural Validation

            console.log('Challenges created successfully');
            resolve();
        } catch (err) {
            console.error('Error creating challenges:', err);
            reject(err);
        }
    });
}

/**
 * Create database tables if they don't exist
 */
function createTablesIfNotExist() {
    return new Promise((resolve, reject) => {
        // Create challenges table
        db.run(`
            CREATE TABLE IF NOT EXISTS challenges (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                description TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                reject(err);
                return;
            }

            // Create clean_data table
            db.run(`
                CREATE TABLE IF NOT EXISTS clean_data (
                    record_id INTEGER,
                    challenge_id INTEGER,
                    name TEXT,
                    email TEXT,
                    phone TEXT,
                    address TEXT,
                    city TEXT,
                    postal_code TEXT,
                    date TEXT,
                    number INTEGER,
                    PRIMARY KEY (record_id, challenge_id),
                    FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                )
            `, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Create dirty_data table
                db.run(`
                    CREATE TABLE IF NOT EXISTS dirty_data (
                        record_id INTEGER,
                        challenge_id INTEGER,
                        name TEXT,
                        email TEXT,
                        phone TEXT,
                        address TEXT,
                        city TEXT,
                        postal_code TEXT,
                        date TEXT,
                        number INTEGER,
                        PRIMARY KEY (record_id, challenge_id),
                        FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                    )
                `, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Create highscores table if it doesn't exist
                    db.run(`
                        CREATE TABLE IF NOT EXISTS highscores (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            score INTEGER NOT NULL,
                            challenge_id INTEGER,
                            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                        )
                    `, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });
        });
    });
}

// Helper function to insert challenge
function insertChallenge(id, name, difficulty, description) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO challenges (id, name, difficulty, description) VALUES (?, ?, ?, ?)",
            [id, name, difficulty, description],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
}

// Helper function to insert clean/dirty data
function insertData(table, record_id, challenge_id, data) {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(data);

        db.run(
            `INSERT INTO ${table} (record_id, challenge_id, ${columns.join(', ')}) 
             VALUES (?, ?, ${placeholders})`,
            [record_id, challenge_id, ...values],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

// Challenge 1: Data validity (Easy)
async function addChallenge1() {
    const challengeId = 1;
    const name = "Text Correction";
    const difficulty = "Easy";
    const description = "Fix simple text errors like spelling mistakes and basic factual errors";

    await insertChallenge(challengeId, name, difficulty, description);

    // Clean data
    const cleanData = [
        { name: "John Smith", email: "john.smith@example.com", phone: "555-123-4567" },
        { name: "Sarah Johnson", email: "sarah.j@company.com", phone: "555-987-6543" },
        { name: "Robert Williams", email: "rob.williams@mail.org", phone: "555-246-8135" },
        { name: "Lisa Brown", email: "lisa.brown@example.net", phone: "555-369-1478" },
        { name: "Michael Davis", email: "michael.davis@company.org", phone: "555-159-7531" }
    ];

    // Dirty data with spelling mistakes and errors
    const dirtyData = [
        { name: "Jhon Smtih", email: "john.smith@exapmle.com", phone: "555-123-4567" },
        { name: "Sara Jonson", email: "sarah.j@comapny.com", phone: "555-978-6543" },
        { name: "Robrt Willaims", email: "rob.williams@mail.org", phone: "555-246-8135" },
        { name: "Liza Brown", email: "lisa.brown@example.ent", phone: "555-369-1478" },
        { name: "Micheal Davsi", email: "michael.davis@company.org", phone: "555-195-7531" }
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 2: Data Type Validation (Easy/Medium)
async function addChallenge2() {
    const challengeId = 2;
    const name = "Type Correction";
    const difficulty = "Easy/Medium";
    const description = "Convert textual numbers and dates to their proper formats";

    await insertChallenge(challengeId, name, difficulty, description);

    // Clean data
    const cleanData = [
        { name: "Product A", number: 12, date: "2023-05-15" },
        { name: "Product B", number: 25, date: "2023-06-20" },
        { name: "Product C", number: 8, date: "2023-04-10" },
        { name: "Product D", number: 30, date: "2023-07-05" },
        { name: "Product E", number: 15, date: "2023-03-25" }
    ];

    // Dirty data with text instead of numbers
    const dirtyData = [
        { name: "Product A", number: "Twelve", date: "May 15, 2023" },
        { name: "Product B", number: "Twenty-five", date: "20/06/2023" },
        { name: "Product C", number: "Eight", date: "10th April 2023" },
        { name: "Product D", number: "Thirty", date: "July 5th, 2023" },
        { name: "Product E", number: "Fifteen", date: "25-03-2023" }
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 3: Data standardization (Medium)
async function addChallenge3() {
    const challengeId = 3;
    const name = "Data Standardization";
    const difficulty = "Medium";
    const description = "Standardize data formats such as dates and ensure proper capitalization";

    await insertChallenge(challengeId, name, difficulty, description);

    // Clean data
    const cleanData = [
        { name: "John Doe", email: "john.doe@example.com", date: "2023-08-15" },
        { name: "Jane Smith", email: "jane.smith@company.org", date: "2023-09-22" },
        { name: "Robert Johnson", email: "robert.johnson@mail.net", date: "2023-07-10" },
        { name: "Emily Davis", email: "emily.davis@example.com", date: "2023-10-05" },
        { name: "Michael Wilson", email: "michael.wilson@company.org", date: "2023-06-30" }
    ];

    // Dirty data with inconsistent capitalization and date formats
    const dirtyData = [
        { name: "john doe", email: "JOHN.DOE@EXAMPLE.COM", date: "15-08-2023" },
        { name: "JANE SMITH", email: "jane.smith@company.org", date: "22/09/2023" },
        { name: "Robert johnson", email: "ROBERT.JOHNSON@mail.net", date: "10.07.2023" },
        { name: "emily DAVIS", email: "Emily.Davis@Example.com", date: "05-10-2023" },
        { name: "MICHAEL wilson", email: "michael.wilson@COMPANY.org", date: "30/06/2023" }
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 4: Missing Data Handling (Medium/Hard)
async function addChallenge4() {
    const challengeId = 4;
    const name = "Missing Data Handling";
    const difficulty = "Medium/Hard";
    const description = "Fill in missing fields based on context or mark them appropriately";

    await insertChallenge(challengeId, name, difficulty, description);

    // Clean data
    const cleanData = [
        { name: "John Smith", email: "john@example.com", city: "New York", postal_code: "10001" },
        { name: "Maria Garcia", email: "maria@company.org", city: "Los Angeles", postal_code: "90001" },
        { name: "James Johnson", email: "james@mail.net", city: "Chicago", postal_code: "60007" },
        { name: "Emily Wilson", email: "emily@example.com", city: "Houston", postal_code: "77001" },
        { name: "Robert Brown", email: "robert@company.org", city: "Phoenix", postal_code: "85001" }
    ];

    // Dirty data with missing fields
    const dirtyData = [
        { name: "John Smith", email: "john@example.com", city: "", postal_code: "10001" },
        { name: "Maria Garcia", email: "", city: "Los Angeles", postal_code: "90001" },
        { name: "James Johnson", email: "james@mail.net", city: "Chicago", postal_code: "" },
        { name: "", email: "emily@example.com", city: "Houston", postal_code: "77001" },
        { name: "Robert Brown", email: "robert@company.org", city: "", postal_code: "" }
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 5: Structural Validation (Hard)
async function addChallenge5() {
    const challengeId = 5;
    const name = "Structural Validation";
    const difficulty = "Hard";
    const description = "Fix data with structural problems like inconsistent formatting in addresses and phone numbers";

    await insertChallenge(challengeId, name, difficulty, description);

    // Clean data
    const cleanData = [
        { name: "Thomas Wright", phone: "555-123-4567", address: "123 Main St, Apt 4B" },
        { name: "Sophia Lee", phone: "555-234-5678", address: "456 Oak Ave, Suite 7C" },
        { name: "Alexander Kim", phone: "555-345-6789", address: "789 Pine Rd, Unit 10D" },
        { name: "Isabella Martinez", phone: "555-456-7890", address: "321 Cedar Ln, #15" },
        { name: "William Chen", phone: "555-567-8901", address: "654 Maple Dr, Apt 22" }
    ];

    // Dirty data with structural problems
    const dirtyData = [
        { name: "Thomas Wright", phone: "5551234567", address: "123MainStApt4B" },
        { name: "Sophia Lee", phone: "(555) 234-5678", address: "456, Oak Avenue, Suite 7C" },
        { name: "Alexander Kim", phone: "555.345.6789", address: "789 Pine Road Unit 10D" },
        { name: "Isabella Martinez", phone: "555 456 7890", address: "321 Cedar Lane #15" },
        { name: "William Chen", phone: "+1-555-567-8901", address: "654 Maple Drive, Apartment 22" }
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

/**
 * Get all high scores
 */
function getHighScores() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM highscores ORDER BY score DESC LIMIT 5", (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

/**
 * Close database connection
 */
function closeDatabase() {
    return new Promise((resolve, reject) => {
        db.close(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


// ========= Exports =========
module.exports = {
    db,
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
};