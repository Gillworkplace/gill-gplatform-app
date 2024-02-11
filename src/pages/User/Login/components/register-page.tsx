import Captcha, { ICaptcha } from '@/pages/User/Login/components/captcha';
import { default as LoginSetting, default as Setting } from '@/pages/User/Login/setting';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Spin, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import axios from 'axios';
import React, { useRef, useState } from 'react';

const accountTips = '6-16位数字、大小写英文字母';
const passwordTips = '6-16位数字、大小写英文字母以及.!@#-=$%^&*:;';
const nickTips = '1-16位数字、大小写英文字母、"_"以及中文';

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
        width: LoginSetting.inputContainer.width,
        minWidth: LoginSetting.inputContainer.minWidth,
        maxWidth: LoginSetting.inputContainer.maxWidth,
      },
      prefix: {
        marginRight: LoginSetting.inputPrefix.marginRight,
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
    axios
      .post('/api/user/register', {
        randomCode: props.randomCode,
        captchaCode: captcha,
        username,
        password,
        nickName,
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
          <Form.Item rules={[{ required: true }]} tooltip={accountTips}>
            <Tooltip trigger={['focus']} title={accountTips} placement="topLeft">
              <Input
                size="large"
                prefix={<span className={styles.prefix}>账号</span>}
                maxLength={16}
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
            </Tooltip>
          </Form.Item>
          <Form.Item rules={[{ required: true }]} tooltip={passwordTips}>
            <Tooltip trigger={['focus']} title={passwordTips} placement="topLeft">
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
          <Form.Item rules={[{ required: true }]} tooltip={nickTips}>
            <Tooltip trigger={['focus']} title={nickTips} placement="topLeft">
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
