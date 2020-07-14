function myFunction() {
  const res = axios
    .get(
      "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=50"
    )
    .then((res) => {
      let allTitles = [];
      const events_pre = res.data.records.forEach((event) => {
        if (
          (event.fields.address_city == "Paris" &&
            event.fields.title != undefined) ||
          event.fields.title != null
        ) {
          allTitles.push(event.fields.title);
          console.log(allTitles);
        }
        const listTitles = document.getElementById("titles");
        listTitles.forEach((e) => {
          let li = document.createElement("li");
          li.addEventListener("click");
          titles.append(li);
        });

        // let input = checkbox.querySelector("input");
        // checkbox.addEventListener("change", updateTags);
        // let list = [];
        // if (input.checked) list.push(input.dataset.tagId)
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
myFunction();

//   .then((res) => {
//     let titles = res.data.records.map((e) => e.title);
//     console.log(titles);
//     return titles;
//   })
