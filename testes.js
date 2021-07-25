const users = [
  { name: "Luis Matheus", username: "luismatheusbs"},
  { name: "Maria José", username: "mariazinha"},
  { name: "José Maria", username: "jose21"},
];

const name = "Luis Mathdeus";
const username = "luismaatheusbs"

const res = users.find(( user ) => user.name === name || user.username === username)

console.log(res)


