import logging


def setup_logger():
    #Setting logging instance
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)

    # Setting up a logging to a file
    filelog = logging.FileHandler('product_catalog_server.log')
    filelog.setLevel(logging.DEBUG)

    # Setting the format of the log message
    formatter = logging.Formatter('%(asctime)s %(processName)-10s %(name)s %(levelname)-8s %(message)s')
    filelog.setFormatter(formatter)
    logger.addHandler(filelog)
    return logger
