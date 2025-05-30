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
        db.all("SELECT id, name FROM challenges", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Get dirty data for a specific challenge, filtering out empty columns
 */
function getChallengeDirtyData(challengeId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT record_id as id, * FROM dirty_data
            WHERE challenge_id = ?
            ORDER BY record_id`;

        db.all(query, [challengeId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // If no rows, return empty array
                if (rows.length === 0) {
                    resolve([]);
                    return;
                }

                // Identify columns that have at least one non-null value
                const nonEmptyColumns = new Set(['id']);
                rows.forEach(row => {
                    Object.entries(row).forEach(([key, value]) => {
                        if (value !== null && value !== undefined && value !== '' &&
                            key !== 'challenge_id' && key !== 'record_id') {
                            nonEmptyColumns.add(key);
                        }
                    });
                });

                // Filter rows to only include non-empty columns
                const filteredRows = rows.map(row => {
                    const filteredRow = { id: row.id };
                    nonEmptyColumns.forEach(column => {
                        if (column !== 'id') {
                            filteredRow[column] = row[column];
                        }
                    });
                    return filteredRow;
                });

                resolve(filteredRows);
            }
        });
    });
}

/**
 * Get clean data for a specific challenge, filtering out empty columns
 */
function getChallengeCleanData(challengeId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT record_id as id, * FROM clean_data
            WHERE challenge_id = ?
            ORDER BY record_id`;

        db.all(query, [challengeId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // If no rows, return empty array
                if (rows.length === 0) {
                    resolve([]);
                    return;
                }

                // Identify columns that have at least one non-null value
                const nonEmptyColumns = new Set(['id']);
                rows.forEach(row => {
                    Object.entries(row).forEach(([key, value]) => {
                        if (value !== null && value !== undefined && value !== '' &&
                            key !== 'challenge_id' && key !== 'record_id') {
                            nonEmptyColumns.add(key);
                        }
                    });
                });

                // Filter rows to only include non-empty columns
                const filteredRows = rows.map(row => {
                    const filteredRow = { id: row.id };
                    nonEmptyColumns.forEach(column => {
                        if (column !== 'id') {
                            filteredRow[column] = row[column];
                        }
                    });
                    return filteredRow;
                });

                resolve(filteredRows);
            }
        });
    });
}

/** Get the challenge data by ID */
function getChallengeDataById(challengeId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM challenges WHERE id = ?", [challengeId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
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
                console.log('Challenges already exist, recreating all data...');
                await dropTables();
                await createTablesIfNotExist();
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
 * Drop existing tables for clean recreation
 */
function dropTables() {
    return new Promise((resolve, reject) => {
        db.run(`DROP TABLE IF EXISTS clean_data`, (err) => {
            if (err) {
                reject(err);
                return;
            }
            db.run(`DROP TABLE IF EXISTS dirty_data`, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                db.run(`DROP TABLE IF EXISTS challenges`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Tables dropped successfully');
                        resolve();
                    }
                });
            });
        });
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

            // Create clean_data table with expanded fields
            db.run(`
                CREATE TABLE IF NOT EXISTS clean_data (
                                                          record_id INTEGER,
                                                          challenge_id INTEGER,
                                                          name TEXT,
                                                          email TEXT,
                                                          phone TEXT,
                                                          voornaam TEXT,
                                                          achternaam TEXT,
                                                          volledigenaam TEXT,
                                                          adres TEXT,
                                                          straat TEXT,
                                                          woonplaats TEXT,
                                                          stad TEXT,
                                                          land TEXT,
                                                          leeftijd TEXT,
                                                          prijs REAL,
                                                          klantid TEXT,
                                                          productcode TEXT,
                                                          postcode TEXT,
                                                          geboortedatum TEXT,
                                                          gewicht_kg REAL,
                                                          telefoonnummer TEXT,
                                                          telefoonmobiel TEXT,
                                                          telefoonvast TEXT,
                                                          netnummer TEXT,
                                                          actief INTEGER,
                                                          nieuwsbrief INTEGER,
                                                          productid TEXT,
                                                          prijsperstuk REAL,
                                                          aantal INTEGER,
                                                          totaalprijs REAL,
                                                          contactpersoon TEXT,
                                                          PRIMARY KEY (record_id, challenge_id),
                    FOREIGN KEY (challenge_id) REFERENCES challenges (id)
                    )
            `, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Create dirty_data table with expanded fields
                db.run(`
                    CREATE TABLE IF NOT EXISTS dirty_data (
                                                              record_id INTEGER,
                                                              challenge_id INTEGER,
                                                              name TEXT,
                                                              email TEXT,
                                                              phone TEXT,
                                                              voornaam TEXT,
                                                              achternaam TEXT,
                                                              volledigenaam TEXT,
                                                              adres TEXT,
                                                              straat TEXT,
                                                              woonplaats TEXT,
                                                              stad TEXT,
                                                              land TEXT,
                                                              leeftijd TEXT,
                                                              prijs TEXT,
                                                              klantid TEXT,
                                                              productcode TEXT,
                                                              postcode TEXT,
                                                              geboortedatum TEXT,
                                                              gewicht_kg TEXT,
                                                              telefoonnummer TEXT,
                                                              telefoonmobiel TEXT,
                                                              telefoonvast TEXT,
                                                              netnummer TEXT,
                                                              actief TEXT,
                                                              nieuwsbrief TEXT,
                                                              productid TEXT,
                                                              prijsperstuk REAL,
                                                              aantal REAL,
                                                              totaalprijs TEXT,
                                                              contactpersoon TEXT,
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
                                                                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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

// Challenge 1: Data Validity (Email and Name corrections)
async function addChallenge1() {
    const challengeId = 1;
    const name = "Data Validity";
    const difficulty = "Easy";
    const description = "Fix simpele tekstfouten zoals spelfouten in namen en e-mailadressen. Corrigeer verkeerd gespelde woorden en typfouten om de gegevens nauwkeurig te maken.<br><br>('jan.j@hotmal.com' → 'jan.j@hotmail.com')";

    await insertChallenge(challengeId, name, difficulty, description);

    // Clean data
    const cleanData = [
        { name: "Jan Jansen", email: "jan.j@hotmail.com", phone: "0612345678" },
        { name: "Maria de Vries", email: "maria.vries@gmail.com", phone: "0687654321" },
        { name: "Pieter Pietersen", email: "p.pietersen@bedrijf.nl", phone: "0698765432" },
    ];

    // Dirty data with spelling mistakes and errors
    const dirtyData = [
        { name: "Jan Jnsen", email: "jan.j@hotmal.com", phone: "0612345678" },
        { name: "Maria de Vreis", email: "maria.vreis@gmil.com", phone: "06-87654321" },
        { name: "Piter Pietersen", email: "p.pietersen@bedirjf.nl", phone: "0698765432" },
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 2: Data Type Validation
async function addChallenge2() {
    const challengeId = 2;
    const name = "Data Type Validation";
    const difficulty = "Medium";
    const description = "Converteer tekstwaarden naar het juiste gegevenstype (bijvoorbeeld 'Twaalf' → 12).";


    await insertChallenge(challengeId, name, difficulty, description);

    const cleanData = [
        { leeftijd: "12" },
        { name: "Annelies Bakker", email: "a.bakker@provider.net", phone: "0611223344" },
        { name: "Mohammed Benali", email: "m.benali@yahoo.com", phone: "0655667788" }
    ];

    const dirtyData = [
        { leeftijd: "Twaalf" },
        { name: "Annelies Bakker", email: "a.bakker@providr.net", phone: "06 11223344" },
        { name: "Mohammed Benali", email: "m.benali@yaho.com", phone: "0655667788" }
    ];

    // Insert data
    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 3: Data Standardization
async function addChallenge3() {
    const challengeId = 3;
    const name = "Data Standardization";
    const difficulty = "Medium";
    const description = "Standaardiseer gegevensformaten zoals hoofdlettergebruik en landcodes. Zorg ervoor dat alle gegevens een consistente notatie volgen voor betere leesbaarheid en verwerking.<br><br>('jan' → 'Jan') en landcodes ('Nederland' → 'NL')";

    await insertChallenge(challengeId, name, difficulty, description);

    const cleanData = [
        { voornaam: "Jan", achternaam: "de Vries" },
        { land: "NL" },
        { telefoonmobiel: "+31611223344", telefoonvast: "+31105551212" },
    ];

    const dirtyData = [
        { voornaam: "jan", achternaam: "DE VRIES" },
        { land: "Nederland" },
        { telefoonmobiel: "06-11223344", telefoonvast: "010-555 12 12" },

    ];

    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 4: Missing Data Handling
async function addChallenge4() {
    const challengeId = 4;
    const name = "Missing Data Handling";
    const difficulty = "Hard";
    const description = "Vul ontbrekende velden aan op basis van context of geldende regels. Gebruik de beschikbare gegevens om ontbrekende informatie logisch in te vullen, of geef expliciet 'onbekend' aan als de informatie niet afgeleid kan worden.<br><br>(bijvoorbeeld het netnummer uit een telefoonnummer)";

    await insertChallenge(challengeId, name, difficulty, description);

    const cleanData = [
        { voornaam: "Fatima", achternaam: "Yilmaz", volledigenaam: "Fatima Yilmaz" },
        { straat: "Dorpsstraat 1", postcode: "1234 AB", woonplaats: "Dorpshuizen", land: "NL" },
        { telefoonnummer: "+31101234567", netnummer: "onbekend" },
    ];

    const dirtyData = [
        { voornaam: "Fatima", achternaam: "Yilmaz", volledigenaam: "F" },
        { straat: "Dorpsstraat 1", postcode: "1234 AB", woonplaats: "Dorpshuizen", land: "N" },
        { telefoonnummer: "+31101234567", netnummer: "0" },
    ];

    for (let i = 0; i < cleanData.length; i++) {
        await insertData('clean_data', i + 1, challengeId, cleanData[i]);
        await insertData('dirty_data', i + 1, challengeId, dirtyData[i]);
    }
}

// Challenge 5: Structural Validation
async function addChallenge5() {
    const challengeId = 5;
    const name = "Structural Validation";
    const difficulty = "Hard";
    const description = "Corrigeer structurele problemen zoals verwisselde velden. Verplaats gegevens naar de juiste velden wanneer informatie in verkeerde kolommen is geplaatst<br><br>(bijvoorbeeld voornaam en achternaam omdraaien).";

    await insertChallenge(challengeId, name, difficulty, description);

    const cleanData = [
        { voornaam: "Willem", achternaam: "de Boer", email: "w.deboer@mail.com" },
        { klantid: "5678", stad: "Brussel", land: "BE" },
        { name: "Stichting Voorbeeld", email: "info@company.org", contactpersoon: "Mevr. Jansen" },
    ];

    const dirtyData = [
        { voornaam: "de Boer", achternaam: "Willem", email: "w.deboer@mail.com" },
        { klantid: "5678", stad: "België", land: "Brussel" },
        { name: "info@company.org", email: "Stichting Voorbeeld", contactpersoon: "Mevr. Jansen" },
    ];

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
        db.all("SELECT * FROM highscores ORDER BY score DESC LIMIT 10", (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

/**
 * insert high score
 */
function insertHighScore(name, score) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO highscores (name, score)
            VALUES (?, ?)
        `;

        db.run(query, [name, score], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
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
    getChallengeDataById,
    getHighScores,
    insertHighScore,
    closeDatabase,
    createChallenges,
    createTablesIfNotExist,
    insertChallenge,
    insertData,
    addChallenge1,
    addChallenge2,
    addChallenge3,
    addChallenge4,
    addChallenge5,
    dropTables
};
