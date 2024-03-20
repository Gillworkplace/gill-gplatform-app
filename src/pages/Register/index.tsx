import LoadSelector from '@/components/LoadSelector';
import { randomString } from '@/components/Util/common-util';
import Captcha, { ICaptcha } from '@/pages/User/Login/components/captcha';
import { Setting, Tips } from '@/pages/setting';
import { LoadingOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Button, Form, Input, Spin, Tooltip, notification } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';

const randomCode = randomString(8);

const Register: React.FC = () => {
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
        width: Setting.inputContainer.width,
        minWidth: Setting.inputContainer.minWidth,
        maxWidth: Setting.inputContainer.maxWidth,
      },
    };
  })();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [role, setRole] = useState('');
  const [captcha, setCaptcha] = useState('');
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
    request<API.ResultWrapper<string>>('/api/user/admin/register', {
      method: 'post',
      data: {
        randomCode: randomCode,
        captchaCode: captcha,
        username,
        password,
        nickName,
        role,
      },
    })
      .then(() => {
        notification.info({
          message: '注册成功',
        });
      })
      .catch((e) => {
        notification.error({
          message: e?.response?.data?.message ?? '系统异常',
        });
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
          <Form.Item rules={[{ required: true }]}>
            <LoadSelector
              url={'/api/user/resource/admin/roles'}
              defaultValue={''}
              onChange={(value) => setRole(value)}
              keyMap={(row) => row.id}
              labelMap={(row) => row.name}
            />
          </Form.Item>
          <Form.Item>
            <Captcha ref={captchaRef} randomCode={randomCode} onRefresh={handleCaptchaChange} />
          </Form.Item>
          <Form.Item>
            <div className={styles.buttonRow}>
              <Button type="primary" size="large" htmlType="submit" onClick={handleRegister} block>
                注册
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Register;
