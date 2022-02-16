const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

const megaEpicDatabase = [];

app.use(express.json());

// Middleware
function verifyIfAccountExists(req, res, next) {
  const { cpf } = req.headers;
  const costumer = megaEpicDatabase.find((costumer) => costumer.cpf === cpf);

  if (!costumer) {
    return res.status(400).json({ error: "Account not found" });
  }

  req.costumer = costumer;
  return next();
}

function getBalance(statement) {
  return statement.reduce((acc, curr) => {
    if (curr.type === "credit") {
      return acc + curr.value;
    } else {
      return acc - curr.value;
    }
  }, 0);
}

app.get("/allaccounts", (_, res) => res.json(megaEpicDatabase))

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  if (megaEpicDatabase.some((costumer) => costumer.cpf == cpf))
    return res.status(400).json({ error: "Account already exists" });

  megaEpicDatabase.push({
    id: uuidv4(),
    cpf,
    name,
    statement: [],
  });

  return res.json({
    message: "Account created with success",
  });
});

app.use(verifyIfAccountExists)

app.get("/statement", (req, res) =>
  res.json(req.costumer.statement)
);

app.get("/statement/date", (req, res) => {
  const { date } = req.query;
  const formattedDate = new Date(date + " 00:00");
  const statement = req.costumer.statement.filter(
    (transaction) =>
      transaction.date.toDateString() === formattedDate.toDateString()
  );
  return res.json(statement);
});

app.get("/account", (req, res) => res.json(req.costumer))

app.get("/balance", (req, res) => res.json({ balance: getBalance(req.costumer.statement) }))

app.post("/deposit", (req, res) => {
  const { description, value } = req.body;
  const { costumer } = req;

  costumer.statement.push({
    id: uuidv4(),
    description,
    value,
    date: new Date(),
    type: "credit",
  });

  return res.status(201).json({
    message: "Deposit made with success",
  });
});

app.post("/withdraw", (req, res) => {
  const { value } = req.body;
  const { costumer } = req;
  const balance = getBalance(costumer.statement);

  if (balance < value) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  costumer.statement.push({
    id: uuidv4(),
    value,
    date: new Date(),
    type: "debit",
  });

  return res.status(201).json({
    message: "Withdraw made with success",
  });
});

app.put("/account", (req, res) => {
  const { name } = req.body;
  const { costumer } = req;

  costumer.name = name;
  return res.json({ "message": "Uptdated" })
})

app.delete("/account", (req, res) => {
  const { costumer } = req;

  megaEpicDatabase.splice(costumer, 1);

  return res.status(204).send()
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
