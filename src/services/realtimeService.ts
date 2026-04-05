export type RealtimeEvent = 'comment:new' | 'comment:status:changed' | 'comment:reported';

interface EventListener {
  (data: any): void;
}

interface Subscribers {
  [key: string]: EventListener[];
}

class RealtimeService {
  private subscribers: Subscribers = {};

  subscribe(event: RealtimeEvent, postId: string, callback: EventListener): () => void {
    const key = `${event}:${postId}`;
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }
    this.subscribers[key].push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers[key].indexOf(callback);
      if (index > -1) {
        this.subscribers[key].splice(index, 1);
      }
    };
  }

  emit(event: RealtimeEvent, postId: string, data: any): void {
    const key = `${event}:${postId}`;
    if (this.subscribers[key]) {
      this.subscribers[key].forEach((callback) => {
        // Simulate async behavior
        setTimeout(() => callback(data), 0);
      });
    }
  }

  clear(): void {
    this.subscribers = {};
  }
}

export const realtimeService = new RealtimeService();
