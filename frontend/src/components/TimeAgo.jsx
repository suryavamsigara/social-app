import { formatDistanceToNowStrict } from 'date-fns';

const abbreviateTime = (distance) => {
    return distance
      .replace(' months', 'mo')
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
};

export function TimeAgo({ timestamp }) {
  if (!timestamp) {
    return null;
  }

  try {
    const date = new Date(timestamp);
    const distance = formatDistanceToNowStrict(date); // 5 min
    const timeAgo = abbreviateTime(distance);

    return <span>{timeAgo}</span>;
  } catch (error) {
    console.log(error);
    return null;
  }
}
