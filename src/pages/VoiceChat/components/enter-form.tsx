import { Button, Form, Input } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

type Props = {
  onEnter?: (roomId: number, password?: string) => void;
};

const EnterForm: React.FC<Props> = (props) => {
  const { styles } = createStyles(({}) => {
    return {
      enterForm: {
        margin: '0 auto',
        display: 'block',
        width: '328px',
        minWidth: '280px',
        maxWidth: '75vw',
      },
      buttonRow: {
        margin: '36px auto',
        display: 'flex',
        justifyContent: 'space-between',
        width: '328px',
        minWidth: '280px',
        maxWidth: '75vw',
      },
      button: {
        width: '140px',
      },
    };
  })();

  const [state, setState] = useState<number>(0);
  const [roomId, setRoomId] = useState<number | undefined>(undefined);
  // const [roomPassword, setRoomPassword] = useState<string | undefined>(undefined)

  const changeRoomId = (roomId: string): void => {
    const id = parseInt(roomId);
    if (!isNaN(id)) {
      setRoomId(id);
    } else {
      setRoomId(undefined);
    }
  };

  const checkRoomAuth = (): void => {
    console.log(roomId);
    if (!roomId) {
      return;
    }

    // TODO try no password
    // if (!roomPassword) {
    //
    //   // TODO failed
    //   setState(1);
    //   return;
    // }

    // TODO success
    props.onEnter?.(roomId /*, roomPassword*/);
  };

  return (
    <div className={styles.enterForm}>
      {state === 0 && (
        <Form layout="horizontal">
          <Form.Item
            rules={[
              {
                required: true,
                message: '请输入房间号',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="房间号"
              maxLength={16}
              onChange={(e) => changeRoomId(e.target.value)}
              onPressEnter={() => checkRoomAuth()}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              onClick={() => checkRoomAuth()}
              block
            >
              加入
            </Button>
          </Form.Item>
        </Form>
      )}
      {state === 1 && (
        <Form layout="horizontal">
          <Form.Item
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="密码"
              maxLength={16}
              onChange={(e) => changeRoomId(e.target.value)}
              onPressEnter={() => checkRoomAuth()}
            />
          </Form.Item>
          <Form.Item>
            <div className={styles.buttonRow}>
              <div className={styles.button}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  onClick={() => checkRoomAuth()}
                  block
                >
                  加入
                </Button>
              </div>
              <div className={styles.button}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  onClick={() => setState(0)}
                  block
                >
                  返回
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default EnterForm;
