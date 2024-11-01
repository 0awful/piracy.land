import Events from '@piracy-land/events';

// Create the event bus
const events = new Events();

// Handle incoming messages from parent relay
window.addEventListener('message', (message) => {
  const { event_type, data } = message.data;
  
  switch (event_type) {
    case 'PUBSUB:SUBSCRIBE':
      const { clientId, eventType } = data;
      events.register(clientId, { subscribes: [eventType] });
      events.on(clientId, eventType, (event) => {
        window.parent.postMessage({
          event_type: 'PUBSUB:RELAY',
          data: {
            target: clientId,
            event
          }
        }, '*');
      });
      break;

    case 'PUBSUB:PUBLISH':
      const { source, event } = data;
      events.register(source, { publishes: [event.type] });
      events.emit(source, event);
      break;

    case 'PUBSUB:UNSUBSCRIBE':
      const { clientId: id, eventType: type } = data;
      // The Events library handles cleanup internally
      events.clear();
      break;
  }
});

// Export the microfrontend interface
export default {
  init: () => {
    // Return cleanup function
    return () => events.clear();
  }
};
