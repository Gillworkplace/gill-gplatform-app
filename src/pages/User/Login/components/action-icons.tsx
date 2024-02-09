import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import React from 'react';

const ActionIcons: React.FC = () => {
  const { styles } = createStyles(({ token }) => {
    return {
      action: {
        marginLeft: '8px',
        color: 'rgba(0, 0, 0, 0.2)',
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
        transition: 'color 0.3s',
        '&:hover': {
          color: token.colorPrimaryActive,
        },
      },
    };
  })();
  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};

export default ActionIcons;
