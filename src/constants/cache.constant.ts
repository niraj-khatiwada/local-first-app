export enum CacheKey {
  ACCESS_TOKEN = 'auth:token:%s:access', // %s: hash
  EMAIL_VERIFICATION_TOKEN = 'auth:token:%s:email-verification', // %s: userId
  USER_SOCKET_CLIENTS = 'socket:%s:clients', // %s: userId
}
