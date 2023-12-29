"use strict";

const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const fs = require("node:fs");

let sessions = [];
let currentSession = 0;
let validWordsO = {};

try {
  const data = fs.readFileSync(
    path.resolve(`${__dirname}/anagram_dictionary.txt`),
    "utf8"
  );
  //console.log(data);
  let validWords = data.split(/\r?\n/);
  validWords.forEach((validWord) => {
    validWordsO[validWord.toUpperCase()] = 1;
  });
} catch (err) {
  console.log(err);
}

const MongoStore = require("connect-mongo")(session);

require("dotenv").config();
const verbose = process.env.VERBOSE === "true";

const connection = mongoose.createConnection(process.env.RESTREVIEWS_DB_URI);

const app = express();

// Security middleware
app.set("trust proxy", "loopback");

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ["'self'", "wss://savevideotools.com"], //TODO: Replace
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// var FileStore = require("session-file-store")(session);

// var fileStoreOptions = {};

// let sessionMiddleware = session({
//   resave: false,
//   saveUninitialized: true,
//   store: new FileStore(fileStoreOptions),
//   secret: "ashf78awhr8hfaw09thbw78ftuw",
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24,
//     secure: false,
//   },
// });

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

const sessionMiddleware = session({
  secret: "some secret", //TODO: CHANGE THIS
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(sessionMiddleware);

//app.use("/api", apiRouter);
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../robots.txt`));
});

/*
function authLogic(req, res, next) {
    //console.log(req.ip);
    //TODO: fix below
    if(req.session.isAuth || req.originalUrl.includes('login') || req.originalUrl === '/img/a_background.webm'|| req.originalUrl === '/img/a_background.mp4'){
         next();
    } else {
        req.session.username = 'Guest' + guestID;
        guestID++;
        req.session.isAuth = true;
        //res.status(401);
        //res.redirect('/login');
        next();
    }
}


app.use(authLogic);
*/

app.use(
  express.static(path.resolve(`${__dirname}/../client`), {
    index: "start.html",
  })
);

app.use("/play", (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});
/*
app.use('/game', (req, res) => {
    let requestedGameID = req.query.gameid;
    res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});
*/

const startingWords = [
  "Ace",
  "Aid",
  "Aim",
  "Air",
  "Ale",
  "Arm",
  "Art",
  "Awl",
  "Eel",
  "Ear",
  "Era",
  "Ice",
  "Ire",
  "Ilk",
  "Oar",
  "Oak",
  "Oat",
  "Oil",
  "Ore",
  "Owl",
  "Urn",
  "Web",
  "Cab",
  "Dab",
  "Jab",
  "Lab",
  "Tab",
  "Dad",
  "Fad",
  "Lad",
  "Mad",
  "Bag",
  "Gag",
  "Hag",
  "Lag",
  "Mag",
  "Rag",
  "Tag",
  "Pal",
  "Cam",
  "Dam",
  "Fam",
  "Ham",
  "Jam",
  "Ram",
  "Ban",
  "Can",
  "Fan",
  "Man",
  "Pan",
  "Tan",
  "Bap",
  "Cap",
  "Lap",
  "Pap",
  "Rap",
  "Sap",
  "Tap",
  "Yap",
  "Bar",
  "Car",
  "Jar",
  "Tar",
  "War",
  "Bat",
  "Cat",
  "Hat",
  "Mat",
  "Pat",
  "Tat",
  "Rat",
  "Vat",
  "Caw",
  "Jaw",
  "Law",
  "Maw",
  "Paw",
  "Bay",
  "Cay",
  "Day",
  "Hay",
  "Ray",
  "Pay",
  "Way",
  "Max",
  "Sax",
  "Tax",
  "Pea",
  "Sea",
  "Tea",
  "Bed",
  "Med",
  "Leg",
  "Peg",
  "Bee",
  "Lee",
  "Tee",
  "Gem",
  "Bet",
  "Jet",
  "Net",
  "Pet",
  "Set",
  "Den",
  "Hen",
  "Men",
  "Pen",
  "Ten",
  "Yen",
  "Dew",
  "Mew",
  "Pew",
  "Bib",
  "Fib",
  "Jib",
  "Rib",
  "Sib",
  "Bid",
  "Kid",
  "Lid",
  "Vid",
  "Tie",
  "Lie",
  "Pie",
  "Fig",
  "Jig",
  "Pig",
  "Rig",
  "Wig",
  "Dim",
  "Bin",
  "Din",
  "Fin",
  "Gin",
  "Pin",
  "Sin",
  "Tin",
  "Win",
  "Yin",
  "Dip",
  "Lip",
  "Pip",
  "Sip",
  "Tip",
  "Git",
  "Hit",
  "Kit",
  "Pit",
  "Wit",
  "Bod",
  "Cod",
  "God",
  "Mod",
  "Pod",
  "Rod",
  "Doe",
  "Foe",
  "Hoe",
  "Roe",
  "Toe",
  "Bog",
  "Cog",
  "Dog",
  "Fog",
  "Hog",
  "Jog",
  "Log",
  "Poi",
  "Con",
  "Son",
  "Ton",
  "Zoo",
  "Cop",
  "Hop",
  "Mop",
  "Pop",
  "Top",
  "Bot",
  "Cot",
  "Dot",
  "Lot",
  "Pot",
  "Tot",
  "Bow",
  "Cow",
  "Sow",
  "Row",
  "Box",
  "Lox",
  "Pox",
  "Boy",
  "Soy",
  "Toy",
  "Cub",
  "Nub",
  "Pub",
  "Sub",
  "Tub",
  "Bug",
  "Hug",
  "Jug",
  "Mug",
  "Rug",
  "Tug",
  "Bum",
  "Gum",
  "Hum",
  "Rum",
  "Tum",
  "Bun",
  "Gun",
  "Pun",
  "Run",
  "Sun",
  "Cup",
  "Pup",
  "Cut",
  "Gut",
  "Hut",
  "Nut",
  "Rut",
  "Egg",
  "Ego",
  "Elf",
  "Elm",
  "Emu",
  "End",
  "Era",
  "Eve",
  "Eye",
  "Ink",
  "Inn",
  "Ion",
  "Ivy",
  "Lye",
  "Dye",
  "Rye",
  "Pus",
  "Gym",
  "Her",
  "His",
  "Him",
  "Our",
  "You",
  "She",
  "Add",
  "Are",
  "Eat",
  "Oil",
  "Use",
  "Nab",
  "Jab",
  "Bag",
  "Lag",
  "Nag",
  "Rag",
  "Sag",
  "Tag",
  "Wag",
  "Jam",
  "Ram",
  "Tan",
  "Cap",
  "Lap",
  "Nap",
  "Rap",
  "Sap",
  "Tap",
  "Yap",
  "Mar",
  "Has",
  "Was",
  "Pat",
  "Lay",
  "Pay",
  "Say",
  "Tax",
  "See",
  "Get",
  "Let",
  "Net",
  "Met",
  "Pet",
  "Set",
  "Wet",
  "Mew",
  "Sew",
  "Lie",
  "Tie",
  "Bog",
  "Jog",
  "Boo",
  "Coo",
  "Moo",
  "Bop",
  "Hop",
  "Lop",
  "Mop",
  "Pop",
  "Top",
  "Sop",
  "Bow",
  "Mow",
  "Row",
  "Tow",
  "Dub",
  "Rub",
  "Lug",
  "Tug",
  "Hum",
  "Sup",
  "Buy",
  "Jot",
  "Rot",
  "Nod",
  "Hem",
  "Wed",
  "Fib",
  "Jib",
  "Rib",
  "Did",
  "Dig",
  "Jig",
  "Rig",
  "Dip",
  "Nip",
  "Sip",
  "Rip",
  "Zip",
  "Gin",
  "Win",
  "Bit",
  "Hit",
  "Sit",
  "Pry",
  "Try",
  "Cry",
  "All",
  "Fab",
  "Bad",
  "Mad",
  "Far",
  "Fat",
  "Raw",
  "Lax",
  "Gay",
  "Big",
  "Dim",
  "Fit",
  "Red",
  "Wet",
  "Old",
  "New",
  "Hot",
  "Coy",
  "Fun",
  "Ill",
  "Odd",
  "Shy",
  "Dry",
  "Wry",
  "And",
  "But",
  "Yet",
  "For",
  "Nor",
  "The",
  "Not",
  "How",
  "Too",
  "Yet",
  "Now",
  "Off",
  "Any",
  "Out",
  "Bam",
  "Nah",
  "Yea",
  "Yep",
  "Naw",
  "Hey",
  "Yay",
  "Nay",
  "Pow",
  "Wow",
  "Moo",
  "Boo",
  "Bye",
  "Yum",
  "Ugh",
  "Bah",
  "Umm",
  "Why",
];

app.use("/start-game", (req, res) => {
  req.session.gameNumber = currentSession;
  let startingWord =
    startingWords[
      Math.floor(Math.random() * startingWords.length)
    ].toUpperCase();
  sessions[currentSession] = {
    startingWord: startingWord,
    currentWord: startingWord,
  };
  currentSession++;
  res.redirect(`/play?room=${req.session.gameNumber}`);
});
app.use("/join-game", (req, res) => {
  req.session.gameNumber = req.body["room-code-input"];
  res.redirect(`/play?room=${req.session.gameNumber}`);
});

const server = http.createServer(app);
const io = socketio(server);
io.use(function (socket, next) {
  sessionMiddleware(socket.request, {}, next);
});

let waiting = false;
let startingWord = "";

io.on("connection", (sock) => {
  if (
    sock.request.session === undefined ||
    sock.request.session.gameNumber === undefined ||
    sessions[sock.request.session.gameNumber] === undefined
  ) {
    sock.emit("kick-to-login");
    return;
  }

  let gameNumber = sock.request.session.gameNumber;
  sock.join(gameNumber);
  startingWord = sessions[gameNumber].startingWord;

  console.log(startingWord);
  console.log(gameNumber);

  io.in(gameNumber).emit("word-ready", {
    word: sessions[gameNumber].currentWord,
  });
  sock.on("new-word", (info) => {
    let currentWord = sessions[gameNumber].currentWord;
    let letters = currentWord.split("");
    console.log(info.word);
    console.log(currentWord);
    info.word = info.word.toUpperCase();
    info.discardWord = info.discardWord.toUpperCase();
    if (info.discardWord.length != 0) {
      let splitLength = Math.floor(currentWord.length / 2);
      if (
        (info.word.length !== splitLength &&
          info.word.length !== splitLength + 1) ||
        (info.discardWord.length !== splitLength &&
          info.discardWord.length !== splitLength + 1)
      ) {
        sock.emit("word-error", { error: "Split Words Incorrect Length" });
        return;
      }
    } else {
      if (info.word.length !== currentWord.length + 1) {
        sock.emit("word-error", { error: "Incorrect Length" });
        return;
      }
    }
    let tempWord = info.word + info.discardWord;
    let didntUseLetters = false;
    letters.forEach((letter) => {
      let tempTempWord = tempWord.replace(letter, "");
      if (tempTempWord === tempWord) {
        didntUseLetters = true;
      }
      tempWord = tempTempWord;
    });
    if (didntUseLetters) {
      sock.emit("word-error", {
        error: "Did not use all the correct letters.",
      });
    } else if (
      validWordsO[info.word] !== 1 ||
      (info.discardWord.length != 0 && validWordsO[info.discardWord] !== 1)
    ) {
      sock.emit("word-error", { error: "That's not a word!" });
    } else {
      sessions[gameNumber].currentWord = info.word;
      io.emit("word-ready", info);
    }
  });
});

server.on("error", (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log("server started");
});
