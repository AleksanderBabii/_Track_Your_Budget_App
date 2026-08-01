import type { PropsWithChildren } from "react";

import styles from "./PageContainer.module.scss";

export function PageContainer({ children }: PropsWithChildren) {
  return <main className={styles.pageContainer}>{children}</main>;
}
