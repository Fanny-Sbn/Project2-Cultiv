const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () =>
  console.log("Good news == mongodb is connected :)")
);

mongoose.connection.on("error", () =>
  console.log("Bad news == db connection error :(")
);
