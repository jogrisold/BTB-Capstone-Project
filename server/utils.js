const sendResponse = (res, status, data, message = "No message included.") => {
    console.log(res);
    return res.status(status).json({ status, data, message });
  };

module.exports = { sendResponse };