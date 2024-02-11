import { createStyles } from 'antd-style';
import React from 'react';

export type TitleProps = {
  title: React.ReactNode | false;

  logoSrc: string | '';

  subTitle: React.ReactNode | false;
};

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  const { styles } = createStyles(({}) => {
    return {
      container: {
        display: 'block',
        textAlign: 'center',
      },
      titleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '44px',
        lineHeight: '44px',
      },
      logo: {
        width: '44px',
        height: '44px',
        marginInlineEnd: '16px',
        verticalAlign: 'top',
      },
      title: {
        position: 'relative',
        insetBlockStart: '2px',
        fontWeight: 600,
        fontSize: '33px',
      },
      subTitle: {
        marginBlockStart: '12px',
        marginBlockEnd: '8px',
        color: 'rgba(0,0,0,0.65)',
        fontSize: '14px',
      },
    };
  })();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <span className={styles.logo}>
          <img alt="logo" style={{ width: '100%' }} src={props.logoSrc} />
        </span>
        <span className={styles.title}>{props.title}</span>
      </div>
      <div className={styles.subTitle}>{props.subTitle}</div>
    </div>
  );
};

export default Title;
