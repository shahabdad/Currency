export interface Conversion {
  fromAmount: string;
  fromCode: string;
  toAmount: string;
  toCode: string;
  time: string;
  trend: string;
  trendType: 'up' | 'down';
}

type Subscriber = (conversions: Conversion[]) => void;

class HistoryStore {
  private conversions: Conversion[] = [
    { fromCode: 'USD', toCode: 'PKR', fromAmount: '100', toAmount: '28,500', time: 'Today at 10:45 AM', trend: '+0.2%', trendType: 'up' },
    { fromCode: 'EUR', toCode: 'USD', fromAmount: '50', toAmount: '54.21', time: 'Yesterday at 3:12 PM', trend: '+0.15%', trendType: 'up' },
    { fromCode: 'GBP', toCode: 'PKR', fromAmount: '200', toAmount: '75,480', time: 'Yesterday at 11:20 AM', trend: '-0.08%', trendType: 'down' },
  ];
  private subscribers: Set<Subscriber> = new Set();

  getConversions(): Conversion[] {
    return [...this.conversions];
  }

  addConversion(conversion: Conversion) {
    // Add to the beginning of the list, filter out identical entries, and limit to 10 entries max
    this.conversions = [
      conversion,
      ...this.conversions.filter(
        (c) =>
          !(
            c.fromCode === conversion.fromCode &&
            c.toCode === conversion.toCode &&
            c.fromAmount === conversion.fromAmount
          )
      ),
    ].slice(0, 10);
    this.notify();
  }

  clear() {
    this.conversions = [];
    this.notify();
  }

  deleteConversion(index: number) {
    this.conversions = this.conversions.filter((_, idx) => idx !== index);
    this.notify();
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => cb([...this.conversions]));
  }
}

export const historyStore = new HistoryStore();
