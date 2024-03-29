import Captcha, { ICaptcha } from '@/pages/User/Login/components/captcha';
import { Setting, Tips } from '@/pages/setting';
import { LoadingOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Alert, Button, Form, Input, Spin, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';

type Props = {
  randomCode: string;
  setPage?: (page: number) => void;
};

const RegisterPage: React.FC<Props> = (props) => {
  const { styles } = createStyles(() => {
    return {
      container: {
        margin: '0 auto',
        paddingTop: '62px',
        display: 'block',
        width: Setting.inputContainer.width,
        minWidth: Setting.inputContainer.minWidth,
        maxWidth: Setting.inputContainer.maxWidth,
      },
      prefix: {
        marginRight: Setting.inputPrefix.marginRight,
      },
      buttonRow: {
        margin: '36px auto',
        display: 'flex',
        justifyContent: 'space-between',
        width: Setting.inputContainer.width,
        minWidth: Setting.inputContainer.minWidth,
        maxWidth: Setting.inputContainer.maxWidth,
      },
      button: {
        width: '140px',
      },
    };
  })();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const captchaRef = useRef<ICaptcha>();

  function handleUsernameChange(username: string): void {
    setUsername(username);
  }

  function handlePasswordChange(password: string): void {
    setPassword(password);
  }

  function handleNickNameChange(nickName: string): void {
    setNickName(nickName);
  }

  function handleCaptchaChange(captcha: string): void {
    setCaptcha(captcha);
  }

  function handleRegister() {
    setLoading(true);
    request('/api/user/register', {
      method: 'post',
      params: {
        randomCode: props.randomCode,
        captchaCode: captcha,
        username,
        password,
        nickName,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        setError(e?.response?.data?.message ?? Setting.defaultError);
      })
      .finally(() => {
        captchaRef.current?.refresh();
        setLoading(false);
      });
  }

  return (
    <div className={styles.container}>
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        tip="注册中"
        spinning={loading}
      >
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
          <Form.Item rules={[{ required: true }]} tooltip={Tips.accountTips}>
            <Tooltip trigger={['focus']} title={Tips.accountTips} placement="topLeft">
              <Input
                size="large"
                prefix={<span className={styles.prefix}>账号</span>}
                maxLength={16}
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
            </Tooltip>
          </Form.Item>
          <Form.Item rules={[{ required: true }]} tooltip={Tips.passwordTips}>
            <Tooltip trigger={['focus']} title={Tips.passwordTips} placement="topLeft">
              <Input.Password
                size="large"
                prefix={<span className={styles.prefix}>密码</span>}
                maxLength={16}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
            </Tooltip>
          </Form.Item>
          <Form.Item rules={[{ required: true }]}>
            <Input.Password
              size="large"
              prefix={<span className={styles.prefix}>确认密码</span>}
              maxLength={16}
            />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} tooltip={Tips.nickTips}>
            <Tooltip trigger={['focus']} title={Tips.nickTips} placement="topLeft">
              <Input
                size="large"
                prefix={<span className={styles.prefix}>昵称</span>}
                maxLength={16}
                onChange={(e) => handleNickNameChange(e.target.value)}
              />
            </Tooltip>
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
                  onClick={handleRegister}
                  block
                >
                  注册
                </Button>
              </div>
              <div className={styles.button}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="button"
                  onClick={() => props.setPage?.(0)}
                  block
                >
                  返回
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default RegisterPage;
