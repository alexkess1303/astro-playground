import type { ReactNode } from 'react';
import styles from './BodyContainer.module.scss';

interface BodyContainerProps {
  left: ReactNode;
  right: ReactNode;
}

export default function BodyContainer({ left, right }: BodyContainerProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
}
