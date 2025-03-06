import styles from "./CardItem.module.css";
export default function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: JSX.Element;
}) {
  return (
    <div className={`${styles.card} bg-white w-[100%] sm:w-[32%] shadow-lg`}>
      <div className={`${styles.card_header}`}>
        <div className={`${styles.card_title} text-mainwhite`}>{title}</div>
        <div className={`${styles.card_icon}`}>{icon}</div>
      </div>
      <div className={`${styles.card_content} text-mainwhite`}>{value}</div>
    </div>
  );
}
