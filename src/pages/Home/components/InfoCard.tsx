import { theme } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
  visible: boolean;
}> = ({ title, href, index, desc, visible }) => {
  const { useToken } = theme;
  const { token } = useToken();

  const { styles } = createStyles(({}) => {
    return {
      container: {
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
        display: visible ? 'block' : 'none',
        '&:hover': {
          boxShadow: '0 0 16px 4px rgba(0, 0, 0, 0.12)',
          cursor: 'pointer',
        },
      },
      cardAlign: {
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
      },
      cardIndex: {
        width: 48,
        height: 48,
        lineHeight: '22px',
        backgroundSize: '100%',
        textAlign: 'center',
        padding: '8px 16px 16px 12px',
        color: '#FFF',
        fontWeight: 'bold',
        backgroundImage:
          "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
      },
      cardTitle: {
        fontSize: '16px',
        color: token.colorText,
        paddingBottom: 8,
      },
      cardDesc: {
        fontSize: '14px',
        color: token.colorTextSecondary,
        textAlign: 'justify',
        lineHeight: '22px',
        marginBottom: 8,
      },
    };
  })();

  const jumpToHref = () => {
    window.open(href);
  };

  return (
    <div className={styles.container} onClick={() => jumpToHref()}>
      <div className={styles.cardAlign}>
        <div className={styles.cardIndex}>{index}</div>
        <div className={styles.cardTitle}>{title}</div>
      </div>
      <div className={styles.cardDesc}>{desc}</div>
    </div>
  );
};

export default InfoCard;
