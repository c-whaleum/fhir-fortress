const {Parcel} = require("@oasislabs/parcel");

async function initDatabase() {
    const dbName = 'fhir-fortress-db';
    let client = new Parcel({
        clientId: "CMnaTbJYzDSLJchDkUzyrh2",
        privateKey: {"kty": "EC","kid": "lEiAZprmTaYGm4Szoqd52Nmo0org0FUCjBJQ4K8hs70","use": "sig","alg": "ES256","crv": "P-256","x": "O2QtyNgm2pUL2s_AZzGCu1cIYUy8Lmv4EKbx-tp8ztU","y": "0oApXq5HEl5vV7jxOqPHlDX7avkcDoCocpjzLLCB0vQ","d": "WTCu6DCqSd8d8JUvjK2mnax2T_WsAKiG8MJHk9gozPE"},
    });
    let db;
    let owner = await client.getCurrentIdentity();
    try {
        db = await client.createDatabase({ name: dbName });
        console.log(`Created database ${db.id} with name: ${db.name}`);
     } catch (error) {
        console.log(`DB ${dbName} already exists`);
     }

    const allDatabases = (
        await client.listDatabases({
          owner: owner.id,
        })
    ).results;
    for (const d of allDatabases) {
        console.log(`Found database ${d.id} with name: ${d.name}`);
    }

    // patients
    const createPatientsTable = {
        sql: 'CREATE TABLE patients (patient_id TEXT, namer TEXT, dob TEXT, race TEXT, sex TEXT, ssn TEXT, insurance_plan_id, PRIMARY KEY(patient_id))',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createPatientsTable);
        console.log(`Created patients table`);
    } catch (error) {
        console.log(`error creating patients`);
    }

    // admissions
    const createAdmissionsTable = {
        sql: 'CREATE TABLE admissions (provider_id TEXT, patient_id TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, hospital_id TEXT, procedure_code TEXT, diagnosis_code TEXT)',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createAdmissionsTable);
        console.log(`Created admissions table`);
    } catch (error) {
        console.log(`error creating admissions`);
    }

    // providers
    const createProvidersTable = {
        sql: 'CREATE TABLE providers (provider_id TEXT, name TEXT)',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createProvidersTable);
        console.log(`Created providers table`);
    } catch (error) {
        console.log(`error creating providers`);
    }

    // hospitals
    const createHospitalsTable = {
        sql: 'CREATE TABLE hospitals (hospital_id TEXT, name TEXT)',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createHospitalsTable);
        console.log(`Created hospitals table`);
    } catch (error) {
        console.log(`error creating hospitals`);
    }

    // insurance_plans
    const createInsuranceTable = {
        sql: 'CREATE TABLE insurance_plans (insurance_plan_id TEXT, company_id TEXT, organization_name TEXT)',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createInsuranceTable);
        console.log(`Created insurance table`);
    } catch (error) {
        console.log(`error creating insurance table`);
    }

    // appointments
    const createAppointmentsTable = {
        sql: 'CREATE TABLE appointments (appointment_id TEXT, patient_id TEXT, provider_id TEXT, reason TEXT, start_date DATETIME DEFAULT CURRENT_TIMESTAMP)',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createAppointmentsTable);
        console.log(`Created appt table`);
    } catch (error) {
        console.log(`error creating appt table`);
    }

    // patient_medications
    const createMedicationsTable = {
        sql: 'CREATE TABLE patient_medications (medication_id TEXT, patient_id TEXT, medication_name TEXT, dispense_amount TEXT, provider_id TEXT, give_units TEXT)',
        params: {},
    };
    try {
        await client.queryDatabase(db.id, createMedicationsTable);
        console.log(`Created medications table`);
    } catch (error) {
        console.log(`error creating meds`);
    }
}

initDatabase().catch(
    err => {
        console.log(err);
    }
);