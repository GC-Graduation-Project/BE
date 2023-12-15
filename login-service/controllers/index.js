exports.test = async (req, res, next) => {
  try {
    res.send("test");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
