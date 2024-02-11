import Captcha, { ICaptcha } from '@/pages/User/Login/components/captcha';
import { default as LoginSetting, default as Setting } from '@/pages/User/Login/setting';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Spin, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import axios from 'axios';
import React, { useRef, useState } from 'react';

type Props = {
  randomCode: string;
  setPage?: (page: number) => void;
};

const LoginPage: React.FC<Props> = (props) => {
  const { styles } = createStyles(() => {
    return {
      container: {
        margin: '0 auto',
        display: 'block',
        width: LoginSetting.inputContainer.width,
        minWidth: LoginSetting.inputContainer.minWidth,
        maxWidth: LoginSetting.inputContainer.maxWidth,
      },
      prefix: {
        marginRight: LoginSetting.inputPrefix.marginRight,
      },
      item: {
        marginBottom: LoginSetting.row.marginBottom,
      },
      buttonRow: {
        margin: '36px auto',
        display: 'flex',
        justifyContent: 'space-between',
        width: LoginSetting.inputContainer.width,
        minWidth: LoginSetting.inputContainer.minWidth,
        maxWidth: LoginSetting.inputContainer.maxWidth,
      },
      button: {
        width: '140px',
      },
    };
  })();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captcha, setCaptcha] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string>('account');
  const [loading, setLoading] = useState<boolean>(false);

  const captchaRef = useRef<ICaptcha>();

  function handleUsernameChange(username: string): void {
    setUsername(username);
  }

  function handlePasswordChange(password: string): void {
    setPassword(password);
  }

  function handleCaptchaChange(captcha: string): void {
    setCaptcha(captcha);
  }

  function handleLogin() {
    setLoading(true);
    axios
      .post('/api/user/login', {
        username,
        password,
        captchaCode: captcha,
        randomCode: props.randomCode,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        setError(e?.response?.data?.message ?? Setting.defaultError);
      })
      .finally(() => {
        setLoading(false);
        captchaRef.current?.refresh();
      });
  }

  return (
    <div className={styles.container}>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        tip="登录中"
        spinning={loading}
      >
        <Tabs
          activeKey={type}
          onChange={setType}
          centered
          items={[
            {
              key: 'account',
              label: '账户密码登录',
            },
            {
              key: 'mobile',
              label: '手机号登录',
              disabled: true,
            },
          ]}
        />
        {type === 'account' && (
          <>
            <Form layout="horizontal" labelAlign="left">
              {error && (
                <Alert
                  style={{
                    marginBottom: 24,
                  }}
                  message={error}
                  type="error"
                  showIcon
                />
              )}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<span className={styles.prefix}>账号</span>}
                  placeholder="用户名"
                  maxLength={16}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '密码不能为空！',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<span className={styles.prefix}>密码</span>}
                  placeholder="密码"
                  maxLength={16}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Captcha
                  ref={captchaRef}
                  randomCode={props.randomCode}
                  onRefresh={handleCaptchaChange}
                />
              </Form.Item>
              <Form.Item>
                <div className={styles.buttonRow}>
                  <div className={styles.button}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      onClick={handleLogin}
                      block
                    >
                      登录
                    </Button>
                  </div>
                  <div className={styles.button}>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="button"
                      onClick={() => props.setPage?.(1)}
                      block
                    >
                      注册
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </Form>
            <div
              style={{
                marginBottom: LoginSetting.row.marginBottom,
              }}
            />
          </>
        )}
      </Spin>
    </div>
  );
};

export default LoginPage;
