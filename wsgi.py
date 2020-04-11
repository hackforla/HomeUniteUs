from hosthome import app as application

if __name__ == "__main__":
    application.logger.debug('Hello from WSGI')
    application.run(debug=True)
