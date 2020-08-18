export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
  Crititcal = 4,
}

export const logLevelName = (level: LogLevel) => {
  switch (level) {
    case LogLevel.Debug:
      return 'Debug'
    case LogLevel.Info:
      return 'Info'
    case LogLevel.Warning:
      return 'Warning'
    case LogLevel.Error:
      return 'Error'
    case LogLevel.Crititcal:
      return 'Crititcal'
    default:
      throw new Error(`Invalid log level: ${level}`)
  }
}

interface LogHandler {
  write: (message: string) => void
}
export interface Logger {
  handlers: LogHandler[]
  moduleName: string
  logLevel: LogLevel
  debug: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
  error: (message: string) => void
  critical: (message: string) => void
}

class ConsoleHandler implements LogHandler {
  write(message: string) {
    console.log(message)
  }
}

export class ModuleLogger implements Logger {
  public constructor(moduleName: string, logLevel: LogLevel) {
    this.moduleName = moduleName
    this.logLevel = logLevel
    this.handlers = new Array<LogHandler>()
    // TODO: Remove this handler when in production build, use a server handler
    this.handlers.push(new ConsoleHandler())
  }
  handlers: LogHandler[]
  moduleName: string
  logLevel: LogLevel
  debug(message: string) {
    if (this.logLevel >= LogLevel.Debug) {
      this.log(message, LogLevel.Debug)
    }
  }
  info(message: string) {
    if (this.logLevel >= LogLevel.Info) {
      this.log(message, LogLevel.Info)
    }
  }
  warning(message: string) {
    if (this.logLevel >= LogLevel.Warning) {
      this.log(message, LogLevel.Warning)
    }
  }
  error(message: string) {
    if (this.logLevel >= LogLevel.Error) {
      this.log(message, LogLevel.Error)
    }
  }
  critical(message: string) {
    if (this.logLevel >= LogLevel.Crititcal) {
      this.log(message, LogLevel.Crititcal)
    }
  }
  private log(message: string, logLevel: LogLevel) {
    this.handlers.forEach((handler: LogHandler) => {
      handler.write(
        `${this.moduleName}:${logLevelName(this.logLevel)}: ${message}`
      )
    })
  }
}
