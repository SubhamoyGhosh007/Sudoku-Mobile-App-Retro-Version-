declare global {
  namespace NodeJS {
    interface Timeout extends ReturnType<typeof setTimeout> {}
  }
}   