import styles from './PageLoader.module.css';

const PageLoader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.pulsingCircle}></div>
    </div>
  );
};

export default PageLoader;