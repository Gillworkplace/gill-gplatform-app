import { Setting } from '@/pages/setting';
import { LockOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Input, Spin } from 'antd';
import { createStyles } from 'antd-style';
import axios from 'axios';
import React from 'react';

type CaptchaProps = {
  randomCode: string;
  onRefresh?: (captcha: string) => void;
};

export interface ICaptcha {
  refresh: () => void;
}

const Captcha = React.forwardRef<any, CaptchaProps>((props, ref?) => {
  const { styles } = createStyles(() => {
    return {
      container: {
        display: 'flex',
      },
      input: {
        flex: 2,
      },
      prefix: {
        marginRight: Setting.inputPrefix.marginRight,
      },
      img: {
        flex: 1,
        marginLeft: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
  })();

  const {
    loading,
    data: imgUrl,
    run,
  } = useRequest(() =>
    axios
      .get('/api/user/captcha', {
        params: {
          randomCode: props.randomCode,
        },
        responseType: 'blob',
      })
      .then((res) => {
        return URL.createObjectURL(new Blob([res.data]));
      })
      .catch(() => {
        return '';
      }),
  );

  function refresh(): void {
    run();
  }

  function handleCaptchaChange(event: React.ChangeEvent<HTMLInputElement>): void {
    props.onRefresh?.(event.target.value);
  }

  React.useImperativeHandle<any, ICaptcha>(ref, () => {
    return {
      refresh,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <Input
          size="large"
          prefix={<LockOutlined className={styles.prefix} />}
          placeholder="验证码"
          onChange={handleCaptchaChange}
        />
      </div>
      <div className={styles.img}>
        {loading ? (
          <Spin />
        ) : (
          <img
            alt="captcha"
            src={imgUrl}
            width="100px"
            height="30px"
            onClick={() => run()}
            style={{ zIndex: 999, cursor: 'pointer' }}
          />
        )}
      </div>
    </div>
  );
});

export default Captcha;
