const client = require('../client');

const EVENT_PREFIX = 'eventStream';

const registerEventStream = (mainWindow) => {
  const eventStream = client.subscribe();

  eventStream.on('data', (event) => {
    // TODO: Check with BE event to update files on FE
    // mainWindow.webContents.send(`${EVENT_PREFIX}:data`, event);

    const type = event.getType().toString();
    const entry = event.getEntry();

    if (type && entry) {
      mainWindow.webContents.send(
        `${EVENT_PREFIX}:${event.type}`,
        {
          path: entry.getPath(),
          name: entry.getName(),
          isDir: entry.getIsdir(),
          created: entry.getCreated(),
          updated: entry.getUpdated(),
          ipfsHash: entry.getIpfshash(),
          sizeInBytes: entry.getSizeinbytes(),
          fileExtension: entry.getFileextension(),
        },
      );
    }
  });

  eventStream.on('error', (error) => {
    mainWindow.webContents.send(`${EVENT_PREFIX}:error`, error);
  });

  return eventStream;
};

module.exports = registerEventStream;
