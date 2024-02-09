import { randomString } from '@/components/Util/common-util';
import { LockOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Input, Spin } from 'antd';
import { createStyles } from 'antd-style';
import axios from 'axios';

const randomCode = randomString(8);

const Captcha: React.FC = () => {
  const { styles } = createStyles(() => {
    return {
      container: {
        display: 'flex',
      },
      input: {
        flex: 2,
        marginRight: '10px',
      },
      img: {
        flex: 1,
      },
    };
  })();

  const {
    loading,
    data: imgUrl,
    run,
  } = useRequest(() => {
    return axios
      .get('/api/user/captcha', {
        method: 'GET',
        params: {
          randomCode: randomCode,
        },
        responseType: 'blob',
      })
      .then((res) => {
        return URL.createObjectURL(new Blob([res.data]));
      })
      .catch(() => {
        return '';
      });
  });

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <Input prefix={<LockOutlined />} placeholder="验证码" />
      </div>
      <div className={styles.img}>
        {loading ? (
          <Spin />
        ) : (
          <img alt="captcha" src={imgUrl} width="100px" height="30px" onClick={() => run()} />
        )}
      </div>
    </div>
  );
};

export default Captcha;