function myFunction() {

 const res = await axios.get("https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&rows=50")
              .then((res) => {
                  return res.data.records.map((e)=>e.title);
              })
              .catch((err) => {
                  console.log(err)
              })


    const checkbox = document.getElementById("myCheck");
    let input = checkbox.querySelector("input");
    checkbox.addEventListener("change", updateTags);

    let list = [];
    if (input.checked) list.push(input.dataset.tagId);

}