async function initDatabase() {
    const dbName = 'FortressDB-1';
    let db;
    try {
        db = await this.client.createDatabase({ name: dbName });
        console.log(`Created database ${db.id} with name: ${db.name}`);
     } catch (error) {
        console.log(`DB ${dbName} already exists`);
     }

    const allDatabases = (
        await this.client.listDatabases({
          owner: this.owner.id,
        })
    ).results;
    for (const d of allDatabases) {
        console.log(`Found database ${d.id} with name: ${d.name}`);
    }

    const createPatientsTable = {
        sql: 'CREATE TABLE patients_test_1 (id TEXT, first_name TEXT)',
        params: {},
    };
    try {
        await this.client.queryDatabase(db.id, createPatientsTable);
        console.log(`Created patients_test_1 table`);
    } catch (error) {
        console.log(`error creating patients_test_1`);
    }
}

initDatabase().then(() => {}).catch(err => {});