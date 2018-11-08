exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    
    req.token = bearerToken;
    console.log(bearerToken);
    next();
  } else {
    res.sendStatus(403);  //로그인으로 다시 리다렉!
  }
};
