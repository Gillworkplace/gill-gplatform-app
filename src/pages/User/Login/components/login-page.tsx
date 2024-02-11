import Captcha from '@/pages/User/Login/components/captcha';
import LoginSetting from '@/pages/User/Login/setting';
import { Button, Form, Input, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

type Props = {
  randomCode: string;
  setPage?: (page: number) => void;
};

type LoginParam = {
  username: string;
  password: string;
  captcha: string;
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

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [captcha, setCaptcha] = useState('');

  const getParam: () => LoginParam = () => {
    return {
      username,
      password,
      captcha,
    };
  };

  const [type, setType] = useState<string>('account');

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
    const param = getParam();
    console.log(param);
  }

  return (
    <div className={styles.container}>
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
              <Captcha randomCode={props.randomCode} refresh={handleCaptchaChange} />
            </Form.Item>
            <Form.Item>
              <div className={styles.buttonRow}>
                <div className={styles.button}>
                  <Button type="primary" size="large" htmlType="submit" onClick={handleLogin} block>
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
          ></div>
        </>
      )}
    </div>
  );
};

export default LoginPage;
