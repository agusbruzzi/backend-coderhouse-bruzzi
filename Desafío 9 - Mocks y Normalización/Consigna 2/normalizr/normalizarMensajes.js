const { schema, normalize, denormalize } = require('normalizr');

const autorSchema = new schema.Entity('authors');
const mensajesSchema = new schema.Entity('posts', {
  author: autorSchema,
});
const chatSchema = new schema.Entity('chats', { chats: [mensajesSchema] });

function normalizarChat(chat) {
  return (chatNormalizado = normalize(chat, chatSchema));
}

function desnormalizarChat(chat) {
  return (chatDesnormalizado = denormalize(normalizedData.result, chat, normalizedData.entities));
}

module.exports = normalizarChat;
module.exports = desnormalizarChat;
