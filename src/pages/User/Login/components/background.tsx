import { createStyles } from 'antd-style';
import React from 'react';
import ReactParticleLine from 'react-particle-line';

const Background: React.FC = () => {
  const { styles } = createStyles(() => {
    return {
      background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    };
  })();

  return (
    <div className={styles.background}>
      <ReactParticleLine style={{ position: 'absolute' }} />
    </div>
  );
};

export default Background;
