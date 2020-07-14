//const service = axios.create({
//  baseURL: "http://localhost:3000"
//});

let axios = require("axios");
let fs = require("fs");
const date = new //Requête pour ID multiples
// https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=(start105220%20OR%20id:85700)

//Requête pour toutes les événements
axios.get(
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=0"
)
  .then((res) => {
    return res.data.nhits;
  })
  .then((nhits) => {
    axios.get(
      `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=${nhits}`
    );
  });


//Requête pour tous les événements en cours (en chantier)

axios.get(
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=1"
).then(
  (res) => 
)

// arrondissement
const arrondissement = ["75001","75002","75003","75004","75005","75006","75007","75008","75009","75010","75011","75012","75013","75014","75015","75016","75017","75018","75019","75020"]

axios.get(
  `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=(address_zipcode=${arrondissement})`
)


// event gratuit versus payant

axios.get(
  `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=(price_type="payant")
  `
)

axios.get(
  `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=(price_type="gratuit")
  `
)







https://quefaire.paris.fr/rechercher?nR[date][%3D][]=1594591200


https://quefaire.paris.fr/rechercher?nR[date][%3E%3D][]=1594764000


// bout de code pour cleaner les tags
// .then((res) => {
//   const { data } = res;
//   const { records } = data;
//   const myBeautifulData = records.map((row) => {
//     const { fields } = row;

//     const { coordinates, category, description, tags } = fields;

//     let clean_tags = [];
//     try {
//       clean_tags = tags.split(";");
//     } catch (e) {
//       console.log(e);
//     }

//export default service
