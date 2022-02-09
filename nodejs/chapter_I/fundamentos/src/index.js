const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_, res) => res.send("Hello World!"))
app.get("/json", (_, res) => res.json({ message: "Hello World!" }))
app.get("/html", (_, res) => res.send("<h1>Hello World!</h1>"))
app.get("/courses", (_, res) => res.json({"Courses": ["JavaScript", "Python", "Ruby"]}))

// Route parameters
app.get("/courses/:id", (req, res) => {
  const { id } = req.params;
  res.json({"Course": id});
})

// Query parameters
app.get("/qparam", (req, res) => res.json(req.query))

// Body parameters
app.post("/bparam", (req, res) => res.json(req.body))

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
