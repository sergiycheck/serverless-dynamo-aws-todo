export const eventLoggerWrapper = (handler: Function) => {
  return (event, context, callback) => {
    console.log("Received event:", event);
    console.log("Received context:", context);
    return handler(event, context, callback);
  };
};
