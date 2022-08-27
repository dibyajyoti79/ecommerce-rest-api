const sendJwtToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  
  // options for the cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
 }   
module.exports = sendJwtToken;