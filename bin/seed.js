require("dotenv").config();
require("../config/mongodb");
const /*inclureLeModèleConcerné*/ = require("./../models/NomDuModèle");

const demo = [
  {
    
  },
  {
    
  },
  {
   
  },
];

/*inclureLeModèleConcerné*/.create(demo)
.then(dbRes => console.log(dbRes))
.catch(dbErr => console.error(dbErr))