class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static unauthenticated() {
    throw new AppError(401, "unauthenticated");
  }

  static unauthorized() {
    throw new AppError(403, "not allowed");
  }
}

module.exports = AppError;
