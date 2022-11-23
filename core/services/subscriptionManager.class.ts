import {Subscription} from "rxjs";

export abstract class SubscriptionManager {
  private counter: number;
  private subscriptions: {
    id: number;
    tag: string;
    subscription: Subscription
  }[];

  protected constructor() {
    this.subscriptions = [];
    this.counter = 0;
  }

  public getSub(tag: string): Subscription {
    let subs = this.subscriptions.find((item) => item.tag === tag)?.subscription;
    if (subs)
      return subs;
    return Subscription.EMPTY
  }

  public addSub(subscription: Subscription, tag?: string) {
    this.subscriptions.push(
      {
        id: ++this.counter,
        tag,
        subscription
      }
    )
  }

  public removeSub(tag: string) {
    let sub = this.subscriptions.find((item) => item.tag === tag);
    if (sub) {
      sub.subscription.unsubscribe();
      this.subscriptions = this.subscriptions.filter((item) => item.tag !== tag);
    }
  }

  public destroySub() {
    for (const elem of this.subscriptions) {
      (elem.subscription as any).unsubscribe();
    }
    this.subscriptions = [];
  }
}
