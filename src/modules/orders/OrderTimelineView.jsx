import './orders.css';

const FORWARD_STATUSES = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTimelineView({ status }) {
  if (status === 'cancelled' || status === 'returned') {
    return (
      <div className="order-timeline order-timeline--terminal">
        <span className={`order-timeline__terminal-badge order-timeline__terminal-badge--${status}`}>
          {status === 'cancelled' ? 'Order Cancelled' : 'Order Returned'}
        </span>
      </div>
    );
  }

  const currentIndex = FORWARD_STATUSES.findIndex((s) => s.key === status);

  return (
    <div className="order-timeline">
      {FORWARD_STATUSES.map((s, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        return (
          <div className={`order-timeline__step order-timeline__step--${state}`} key={s.key}>
            <span className="order-timeline__dot">{state === 'done' ? '✓' : i + 1}</span>
            <span className="order-timeline__label">{s.label}</span>
            {i < FORWARD_STATUSES.length - 1 && <span className="order-timeline__line" />}
          </div>
        );
      })}
    </div>
  );
}
