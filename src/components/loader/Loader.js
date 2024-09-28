import React from "react";
import styles from "./Loader.module.css";

function Loader() {
  return (
    <div className={styles.outerDiv}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default Loader;
