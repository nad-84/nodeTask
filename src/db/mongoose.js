const mongoose = require("mongoose");

const MONGODB_URL =
  "mongodb+srv://ranaaliraza:ali19idontno@cluster0.ttimf.mongodb.net/user-app?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
