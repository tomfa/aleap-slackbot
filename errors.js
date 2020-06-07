class MessageError extends Error {
  // Sends message to slack
}
class NoRemainingUsers extends MessageError {}

module.exports = {
  NoRemainingUsers, MessageError
}
