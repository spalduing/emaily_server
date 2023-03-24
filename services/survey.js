module.exports = (recipients) => {
  return recipients.split(",").map((email) => ({
    email: email.trim(),
  }));
};
