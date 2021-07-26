const { Router } = require("express");
const router = Router();

const User = require("../models/users");

const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");

router.get("/", (req, res) => res.send("Hello World!!asfasfasdf"));

router.post("/signup", async (req, res) => {
  //async para utilizar los metodos asincronos
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  await newUser.save(); //await para definir una funcion asincrona
  const token = jwt.sign({ id: newUser._id }, "secretKey");
  console.log("Creating user");
  res.status(200).json({ token });
});

router.post("/signin", async (req, res) => {
  //las consultas a la bd siempre deben ser asyncronas
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("the email doesn't exists");
  if (user.password !== password) return res.status(401).send("Wrong Password");
  console.log("Login");

  const token = jwt.sign({ _id: user._id }, "secretKey");
  return res.status(200).json({ token });
});

router.get("/public/task", (req, res) => {
  res.json([
    {
      _id: 1,
      name: "Task one",
      description: "Lorem ipsum",
      date: "2021-11-17T20:39:05.2112",
    },
    {
      _id: 2,
      name: "Task two",
      description: "Deus no facit alea ludere",
      date: "2021-11-17T21:39:05.2112",
    },
    {
      _id: 3,
      name: "Task three",
      description: "Molon labe",
      date: "2021-11-17T22:39:05.2112",
    },
  ]);
});

router.get("/private/task", verifyToken, (req, res) => {
  res.json([
    {
      _id: 1,
      name: "Private Task one",
      description: "Lorem ipsum",
      date: "2021-11-17T20:39:05.2112",
    },
    {
      _id: 2,
      name: "Private Task two",
      description: "Deus no facit alea ludere",
      date: "2021-11-17T21:39:05.2112",
    },
    {
      _id: 3,
      name: "Private Task three",
      description: "Molon labe",
      date: "2021-11-17T22:39:05.2112",
    },
    {
      _id: 4,
      name: "Private Task four",
      description: "Satex",
      date: "2021-26-17T22:39:05.2112",
    },
  ]);
});

router.get("/private/profile", verifyToken, (req, res) => {
  res.send(req.userId);
});

module.exports = router;

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized Request");
  }

  const token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized Request");
  }
  const payload = jwt.verify(token, "secretKey");
  req.userId = payload._id;
  next();
  console.log(payload);
}
