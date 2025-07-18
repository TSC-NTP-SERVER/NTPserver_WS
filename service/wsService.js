let latestTracking = null;
let latestTime = null;
let latestClient = null;
// let latestClientTimestamp = null;

function updateWatcher(db, broadcast) {
  const trackingCol = db.collection("tracking");
  const timeCol = db.collection("time");
  const clientCol = db.collection("client");

  const trySendLog = () => {
    if (latestTracking && latestTime && latestClient) {
      broadcast({
        type: "chronyc",
        data: {
          tracking: latestTracking,
          time: latestTime,
          client: latestClient,
        //   clientTimestamp: latestClientTimestamp,
        },
      });
    }
  };

  const watch = (collection, label, onChange) => {
    const stream = collection.watch([{ $match: { operationType: "insert" } }]);
    stream.on("change", (change) => {
      console.log(`New ${label} insert:`, change.fullDocument);
      onChange(change.fullDocument);
      trySendLog();
    });
  };

  watch(trackingCol, "tracking", (doc) => {
    latestTracking = doc;
  });
  watch(timeCol, "time", (doc) => {
    latestTime = doc;
  });
  watch(clientCol, "client", (doc) => {
    latestClient = doc;
    // latestClientTimestamp = new Date().toISOString();
  });
}

module.exports = {
    updateWatcher,
};
