import pubsub from './index';

describe('PubSub Service', () => {
  let messages = [];
  
  // Mock window.parent.postMessage
  beforeAll(() => {
    window.parent = {
      postMessage: (msg, target) => {
        messages.push({ msg, target });
      }
    };
  });

  beforeEach(() => {
    messages = [];
    pubsub.init();
  });

  afterEach(() => {
    // Cleanup any registered message handlers
    window.removeEventListener('message', window.__messageListener);
  });

  // Helper to simulate incoming messages
  function simulateMessage(event_type, data) {
    window.dispatchEvent(new MessageEvent('message', {
      data: { event_type, data }
    }));
  }

  test('handles PUBSUB:SUBSCRIBE correctly', () => {
    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-1',
      eventType: 'TEST_EVENT'
    });

    // Now simulate a message that should be relayed to this subscriber
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'client-2',
      event: {
        type: 'TEST_EVENT',
        data: { test: true }
      }
    });

    // Should have relayed the message
    expect(messages).toHaveLength(1);
    expect(messages[0].msg).toEqual({
      event_type: 'PUBSUB:RELAY',
      data: {
        target: 'client-1',
        event: {
          type: 'TEST_EVENT',
          data: { test: true }
        }
      }
    });
  });

  test('handles PUBSUB:PUBLISH correctly', () => {
    // Setup subscribers first
    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-1',
      eventType: 'TEST_EVENT'
    });

    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-2',
      eventType: 'TEST_EVENT'
    });

    messages = []; // Clear setup messages

    // Publish a message
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'client-3',
      event: {
        type: 'TEST_EVENT',
        data: { test: true }
      }
    });

    // Should relay to both subscribers
    expect(messages).toHaveLength(2);
    expect(messages.map(m => m.msg.data.target)).toEqual(['client-1', 'client-2']);
  });

  test('handles PUBSUB:UNSUBSCRIBE correctly', () => {
    // Setup subscriber
    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-1',
      eventType: 'TEST_EVENT'
    });

    // Unsubscribe
    simulateMessage('PUBSUB:UNSUBSCRIBE', {
      clientId: 'client-1',
      eventType: 'TEST_EVENT'
    });

    messages = []; // Clear setup messages

    // Publish a message
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'client-2',
      event: {
        type: 'TEST_EVENT',
        data: { test: true }
      }
    });

    // Should not relay to unsubscribed client
    expect(messages).toHaveLength(0);
  });

  test('enforces source permissions for publishing', () => {
    // Try to publish without registering first
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'unauthorized-client',
      event: {
        type: 'TEST_EVENT',
        data: { test: true }
      }
    });

    // No messages should be relayed
    expect(messages).toHaveLength(0);
  });

  test('handles multiple subscribers to different events', () => {
    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-1',
      eventType: 'EVENT_A'
    });

    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-2',
      eventType: 'EVENT_B'
    });

    messages = []; // Clear setup messages

    // Publish EVENT_A
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'publisher',
      event: {
        type: 'EVENT_A',
        data: { test: true }
      }
    });

    // Should only relay to EVENT_A subscriber
    expect(messages).toHaveLength(1);
    expect(messages[0].msg.data.target).toBe('client-1');

    messages = [];

    // Publish EVENT_B
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'publisher',
      event: {
        type: 'EVENT_B',
        data: { test: true }
      }
    });

    // Should only relay to EVENT_B subscriber
    expect(messages).toHaveLength(1);
    expect(messages[0].msg.data.target).toBe('client-2');
  });

  test('handles cleanup properly', () => {
    const cleanup = pubsub.init();
    
    // Setup some subscriptions
    simulateMessage('PUBSUB:SUBSCRIBE', {
      clientId: 'client-1',
      eventType: 'TEST_EVENT'
    });

    // Run cleanup
    cleanup();

    messages = [];

    // Try to publish
    simulateMessage('PUBSUB:PUBLISH', {
      source: 'publisher',
      event: {
        type: 'TEST_EVENT',
        data: { test: true }
      }
    });

    // Should not relay any messages after cleanup
    expect(messages).toHaveLength(0);
  });
});
