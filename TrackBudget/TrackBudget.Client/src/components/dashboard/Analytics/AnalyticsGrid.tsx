import type { PropsWithChildren } from "react";

import styles from "./AnalyticsGrid.module.scss";

export function AnalyticsGrid({ children }: PropsWithChildren) {
  return <section className={styles.analyticsGrid}>{children}</section>;
}
