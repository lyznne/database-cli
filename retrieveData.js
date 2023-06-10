import db from "./db.js";
import welcome from "./index.js";

export default async function retrieveData() {
  try {

    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        console.log(`Error retrieving data: ${err.message}`);
        return;
      }
      console.log(rows);
    });
    
    console.log('\n');
    await welcome();
  } catch (error) {
    console.log(`Something happened: ${error.message}`);
  }
}
